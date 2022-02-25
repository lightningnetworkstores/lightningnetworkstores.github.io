<template>
  <div>
    <div>
      <Topics @on-topic-selected="onTopicSelected"/>
      <v-expansion-panels>
        <v-expansion-panel v-for="(thread, threadIndex) in threads" :key="thread.id">
          <v-expansion-panel-header class="d-flex flex-column align-start">
            <v-container class="d-flex px-0">
              <div class="text-subtitle-1 font-weight-bold" style="flex-grow: 1"
                :inner-html.prop="thread.title"
              />
              <v-badge inline :content="repliesCount(threadIndex)"></v-badge>
            </v-container>
            <div
              class="text-body-1 comment-title"
              :inner-html.prop="thread.comment | toHtml | tagUser"
            >
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-sheet v-for="(reply, replyIndex) in replies(threadIndex)" :key="reply.id">
              <v-divider v-if="replyIndex === 0"></v-divider>
              <div class="text-caption d-flex justify-space-between my-3">
                <div>
                  <UserTag :userId="reply.user_id"/>
                </div>
                  {{ formatDate(reply.timestamp) }}
                <div>
                  <DiscussionReply
                    :reply="reply"
                    :threadId="threadId(threadIndex)"
                    :threadIndex="threadIndex"
                    @paid-reply-request="handlePaidReplyRequest"
                  />
                </div>
              </div>
              <div class="py-3 text-body-1"
                :inner-html.prop="reply.comment | toHtml | tagUser"
              >
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
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { format } from 'timeago.js'

import DiscussionReply from './DiscussionReply.vue'
import UserTag from './UserTag.vue'
import PaidReplyModal from './PaidReplyModal'
import Topics from './Topics.vue'

export default {
  components: { DiscussionReply, UserTag, PaidReplyModal, Topics },
  data() {
    return {
      paidReplyData: null,
      selectedTopic: 'ALL'
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
</style>