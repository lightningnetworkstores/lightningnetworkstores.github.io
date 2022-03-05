<template>
  <div>
    <div>
      <Topics @on-topic-selected="onTopicSelected"/>
      <v-expansion-panels>
        <v-expansion-panel v-for="(header, threadIndex) in headers" :key="header.id">
          <v-expansion-panel-header class="d-flex flex-column align-end my-0 py-0">
            <DiscussionHeader
              :repliesCount="repliesCount(threadIndex)"
              :discussionHeader="header"
              :threadIndex="threadIndex"
              :threadId="threadId(threadIndex)"
              @paid-reply-request="handlePaidReplyRequest"
            />
          </v-expansion-panel-header>
          <v-expansion-panel-content class="px-4">
            <v-sheet
              v-for="(reply, replyIndex) in replies(threadIndex)"
              :key="reply.id"
              :style="{background: getReplyBackground(reply)}"
            >
              <v-divider v-if="replyIndex === 0"></v-divider>
              <div class="text-caption d-flex justify-space-between my-3">
                <div>
                  <UserTag :userId="reply.user_id"/>
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
              <div class="d-flex justify-space-between">
                <Reply
                  :reply="reply.comment"
                  @hover-on="u => handleHoverOn(u)"
                  @hover-off="u => handleHoverOff(u)"
                />
                <DeleteCommentModal v-if="isAdmin"
                  :threadIndex="threadIndex"
                  :commentId="reply.id"
                />
              </div>
              <v-divider v-if="replyIndex < (repliesCount(threadIndex) - 2)"></v-divider>
            </v-sheet>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <PaidReplyModal v-if="paidReplyData"
      @cancel-reply="paidReplyData = null"
      @reply-payment-confirmed="paidReplyData = null"
      :invoice="paidReplyData.data.payment_request"
      :message="paidReplyData.message"
      :paymentId="paidReplyData.data.id"
    />
    <v-snackbar bottom :value="error" :timeout="2e3">
      {{ error }}
      <template v-slot:action="{ attrs }">
        <v-btn text :attrs="attrs" color="red" @click="closeSnackbar">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { format } from 'timeago.js'

import DiscussionReplyModal from './DiscussionReplyModal.vue'
import UserTag from './UserTag.vue'
import PaidReplyModal from './PaidReplyModal'
import Topics from './Topics.vue'
import Reply from './Reply.vue'
import StorePreview from './StorePreview'
import DiscussionHeader from './DiscussionHeader.vue'
import DeleteCommentModal from './DeleteCommentModal.vue'

export default {
  components: {
    DiscussionReplyModal,
    UserTag,
    PaidReplyModal,
    Topics,
    Reply,
    StorePreview,
    DiscussionHeader,
    DeleteCommentModal
  },
  data() {
    return {
      paidReplyData: null,
      selectedTopic: 'ALL',
      selectedReference: null
    }
  },
  async mounted() {
    await this.$store.dispatch('discussions/getDiscussions')
    this.$store.dispatch('discussions/getLogStatus')
  },
  methods: {
    formatDate(timestamp) {
      return format(timestamp)
    },
    handlePaidReplyRequest(data) {
      this.paidReplyData = data
    },
    onTopicSelected({ topic, index}) {
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
        comments: [ commentId ]
      }
      this.$store.dispatch('discussions/deleteComment', deletePayload)
    },
    closeSnackbar() {
      this.$store.dispatch('discussions/clearError')
    }
  },
  computed: {
    headers() {
      return this.filteredDiscussions(this.selectedTopic).map(comments => comments[0])
    },
    replies() {
      return index => this.filteredDiscussions(this.selectedTopic)[index].slice(1)
    },
    repliesCount() {
      return index => this.filteredDiscussions(this.selectedTopic)[index].length - 1
    },
    threadId() {
      return index => this.filteredDiscussions(this.selectedTopic)[index][0].thread_id
    },
    ...mapGetters('discussions', ['filteredDiscussions']),
    ...mapState('discussions', ['lastDiscussions', 'error', 'isAdmin'])
  }
}
</script>
<style scoped>
@media (max-width: 600px) {
  .comment-title {
    width: 45vh;
    overflow: hidden;
  }  
}
selected-comment {
  background-color: aliceblue;
}
</style>