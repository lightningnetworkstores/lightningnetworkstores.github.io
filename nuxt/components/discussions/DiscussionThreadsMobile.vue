<template>
  <div>
    <div>
      <v-expansion-panels :value="expand ? 0 : undefined" class="discussion-container">
        <v-expansion-panel
          v-for="(header, threadIndex) in headers"
          :key="header.id"
        >
          <v-expansion-panel-header
            class="d-flex flex-column align-start py-0 px-1"
          >
            <DiscussionHeader
              v-if="!header.isStore"
              :repliesCount="repliesCount(threadIndex)"
              :discussionHeader="header"
              :threadIndex="threadIndex"
              :threadId="threadId(threadIndex)"
              :displayDetailLink="true"
              @paid-reply-request="handlePaidReplyRequest"
            />
          </v-expansion-panel-header>
          <v-expansion-panel-content class="px-2">
            <v-sheet
              v-for="(reply, replyIndex) in replies(threadIndex)"
              :key="reply.id"
            >
              <v-divider v-if="replyIndex === 0"></v-divider>
              <reply-bar
                :reply="reply"
                :threadIndex="threadIndex"
                :threadId="threadId(threadIndex)"
                :handlePaidReplyRequest="handlePaidReplyRequest"
              />
              <discussion-image
                v-if="reply.link"
                :url="reply.link"
                style="min-height: 50px"
              />
              <Reply :reply="reply.comment" />
              <v-divider
                v-if="
                  replyIndex < repliesCount(threadIndex) - 2
                "
              ></v-divider>
            </v-sheet>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <PaidReplyModal
      v-if="paidReplyData"
      @cancel-reply="paidReplyData = null"
      @reply-payment-confirmed="paidReplyData = null"
      :invoice="paidReplyData.data.payment_request"
      :message="paidReplyData.message"
      :paymentId="paidReplyData.data.id"
    />
  </div>
</template>
<script>
import PaidReplyModal from './PaidReplyModal'
import Reply from './Reply.vue'
import StorePreview from './StorePreview'
import DiscussionHeader from './DiscussionHeader.vue'
import DiscussionImage from '@/components/discussions/DiscussionImage'
import ReplyBar from '@/components/discussions/ReplyBar'

export default {
  components: {
    PaidReplyModal,
    Reply,
    StorePreview,
    DiscussionHeader,
    DiscussionImage,
    ReplyBar
  },
  props: {
    threads: {
      type: Array,
      default: () => []
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
  async mounted() {
    this.$store.dispatch('discussions/getLogStatus')
    await this.$store.dispatch('discussions/getDiscussions')
  },
  methods: {
    handlePaidReplyRequest(data) {
      this.paidReplyData = data
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
  },
}
</script>
<style scoped>
.discussion-container {
  margin: auto;
}
.hidden-replies {
  min-height: 5em;
}
@media (min-width: 1264px) {
  .discussion-container {
    max-width: 1185px;
  }
}
</style>