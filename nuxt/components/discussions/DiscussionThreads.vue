<template>
  <div style="width: 100%">
    <v-expansion-panels :value="expand ? 0 : undefined">
      <v-expansion-panel
        v-for="(header, threadIndex) in headers"
        :key="header.id"
      >
        <v-expansion-panel-header
          class="d-flex flex-column align-center my-0 pt-0 pb-2 px-1"
          expand-icon="mdi-menu-down"
        >
          <DiscussionHeader
            :repliesCount="repliesCount(threadIndex)"
            :discussionHeader="header"
            :threadIndex="threadIndex"
            :threadId="threadId(threadIndex)"
            @paid-reply-request="handlePaidReplyRequest"
            :displayDetailLink="displayDetailLink"
          />
        </v-expansion-panel-header>
        <v-expansion-panel-content class="px-6">
          <v-sheet
            class="reply-container"
            v-for="(reply, replyIndex) in replies(threadIndex)"
            :key="reply.id"
            :style="{ background: getReplyBackground(reply) }"
          >
            <v-divider v-if="replyIndex === 0 && firstPost(threadIndex).hidden"></v-divider>
            <div v-if="replyIndex === 0 && firstPost(threadIndex).hidden"
              class="d-flex flex-column justify-center align-center text-subtitle-2 my-2 hidden-replies"
            >
               {{ firstPost(threadIndex).hidden }} hidden replies
                <v-btn icon @click="$router.push(`/discuss/${firstPost(threadIndex).thread_id}`)">
                  <v-icon>mdi-unfold-more-horizontal</v-icon>
                </v-btn>
            </div>
            <v-divider v-if="replyIndex === 0"></v-divider>
            <div
              class="text-caption d-flex justify-space-between my-3"
            >
              <div>
                <UserTag
                  :user="reply.user"
                  :userId="reply.user_id"
                />
              </div>
              {{ formatDate(reply.timestamp) }}
              <div>
                <DiscussionReplyModal
                  :reply="reply"
                  :threadId="threadId(threadIndex)"
                  :threadIndex="threadIndex"
                  @paid-reply-request="handlePaidReplyRequest"
                />
              </div>
            </div>
            <div class="d-flex justify-space-between mb-3">
              <v-row>
                <v-col v-if="reply.link" cols="2">
                  <discussion-image
                    v-if="reply.link"
                    :url="reply.link"
                  />
                </v-col>
                <v-col>
                  <Reply
                    :reply="reply.comment"
                    @hover-on="(u) => handleHoverOn(u)"
                    @hover-off="(u) => handleHoverOff(u)"
                  />
                </v-col>
              </v-row>
              <DeleteCommentModal
                v-if="isAdmin"
                :threadIndex="threadIndex"
                :commentId="reply.id"
              />
            </div>
            <v-divider v-if="replyIndex < repliesCount(threadIndex) - 1"/>
          </v-sheet>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <PaidReplyModal
      v-if="paidReplyData"
      @cancel-reply="paidReplyData = null"
      @reply-payment-confirmed="paidReplyData = null"
      :invoice="paidReplyData.data.payment_request"
      :message="paidReplyData.message"
      :paymentId="paidReplyData.data.id"
    />
    <v-snackbar bottom :value="error" :timeout="2e3">
      {{ error }}
      <template v-slot:action="{ attrs }">
        <v-btn text :attrs="attrs" color="red" @click="closeSnackbar">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { format } from 'timeago.js'
import DiscussionReplyModal from './DiscussionReplyModal.vue'
import UserTag from './UserTag.vue'
import PaidReplyModal from './PaidReplyModal'
import Topics from './Topics.vue'
import Reply from './Reply.vue'
import DiscussionHeader from './DiscussionHeader.vue'
import DeleteCommentModal from './DeleteCommentModal.vue'
import DiscussionImage from '@/components/discussions/DiscussionImage'

export default {
  components: {
    DiscussionReplyModal,
    UserTag,
    PaidReplyModal,
    Topics,
    Reply,
    DiscussionHeader,
    DeleteCommentModal,
    DiscussionImage
  },
  props: {
    threads: {
      type: Array,
      default: []
    },
    displayDetailLink: {
      type: Boolean,
      default: false
    },
    expand: {
      type: Boolean,
      default: undefined
    }
  },
  data() {
    return {
      paidReplyData: null,
      selectedReference: null,
    }
  },
  methods: {
    formatDate(timestamp) {
      return format(timestamp)
    },
    handlePaidReplyRequest(data) {
      this.paidReplyData = data
    },
    onTopicSelected({ topic, index }) {
      this.selectedTopic = topic
    },
    handleHoverOn(reference) {
      this.selectedReference = reference
    },
    handleHoverOff() {
      this.selectedReference = null
    },
    getReplyBackground(reply) {
      if (!this.selectedReference) return 'white'
      const found = reply.id.includes(this.selectedReference.slice(1))
      if (this.selectedReference && found) {
        return 'aliceblue'
      }
      return 'white'
    },
    handleDelete(threadIndex, commentId) {
      const deletePayload = {
        threadIndex,
        reason: '',
        comments: [commentId],
      }
      this.$store.dispatch('discussions/deleteComment', deletePayload)
    },
    closeSnackbar() {
      this.$store.dispatch('discussions/clearError')
    },
  },
  computed: {
    headers() {
      return this.threads.map(thread => thread[0])
    },
    firstPost() {
      return (index) =>
        this.threads[index].slice(0, 1)[0]
    },
    replies() {
      return (index) =>
        this.threads[index].slice(1)
    },
    repliesCount() {
      return (index) =>
        this.threads[index].length - 1
    },
    threadId() {
      return (index) =>
        this.threads[index][0].thread_id
    },
    ...mapState('discussions', ['isAdmin', 'error']),
  }
}
</script>
<style scoped>
.reply-container {
  margin: auto;
}
.hidden-replies {
  min-height: 5em;
}
@media (min-width: 1264px) {
  .reply-container {
    max-width: 1185px;
  }
}

</style>