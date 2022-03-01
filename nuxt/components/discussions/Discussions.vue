<template>
  <div>
    <div>
      <Topics @on-topic-selected="onTopicSelected"/>
      <v-expansion-panels>
        <v-expansion-panel v-for="(thread, threadIndex) in threads" :key="thread.id">
          <v-expansion-panel-header class="d-flex flex-column align-start my-0 py-0">
            <v-container class="mb-0 pb-0">
              <v-row>
                <v-col cols="7">
                  <div class="text-h6 font-weight-bold" style="flex-grow: 1"
                    :inner-html.prop="thread.title"
                  />
                  <div
                    class="text-body-1 comment-title"
                    :inner-html.prop="thread.comment | toHtml | tagUser"
                  />
                </v-col>
                <v-col cols="5" class="d-flex flex-row justify-end mr-0 pr-0">
                  <div v-if="thread.store" class="flex-grow-1">
                    <StorePreview :store="thread.store"/>
                  </div>
                  <div class="d-flex justify-end flex-grow-0" style="min-width: 3em">
                    <v-chip x-small class="mx-0 px-1">
                      <v-icon class="mr-1">mdi-message-reply</v-icon>
                      {{ repliesCount(threadIndex) }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>
            </v-container>
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
              <Reply
                :reply="reply.comment"
                @hover-on="u => handleHoverOn(u)"
                @hover-off="u => handleHoverOff(u)"
              />
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

export default {
  components: { DiscussionReplyModal, UserTag, PaidReplyModal, Topics, Reply, StorePreview },
  data() {
    return {
      paidReplyData: null,
      selectedTopic: 'ALL',
      selectedReference: null
    }
  },
  async mounted() {
    await this.$store.dispatch('discussions/getDiscussions')
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
    }
  },
  computed: {
    threads() {
      return this.filteredDiscussions(this.selectedTopic).map(comments => comments[0])
    },
    replies() {
      return index => this.filteredDiscussions(this.selectedTopic)[index].slice(1)
    },
    repliesCount() {
      return index => this.filteredDiscussions(this.selectedTopic)[index].length
    },
    threadId() {
      return index => this.filteredDiscussions(this.selectedTopic)[index][0].thread_id
    },
    ...mapGetters('discussions', ['filteredDiscussions']),
    ...mapState('discussions', ['lastDiscussions'])
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