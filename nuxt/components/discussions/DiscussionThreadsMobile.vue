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
            :disabled="header.isStore"
            :hide-actions="header.isStore"
          >
            <div
              v-if="header.isStore"
              class="my-2 mx-0 px-0 d-flex justify-center"
              style="width: 100%"
            >
              <StorePreview
                :store="header"
                style="width: 400px"
              />
            </div>
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
      return this.threads
        .map((comments) => {
          const firstComment = comments[0]
          const { store } = firstComment
          if (store) {
            return [
              { isStore: true, ...store },
              { isStore: false, ...firstComment },
            ]
          } else {
            return [{ isStore: false, ...firstComment }]
          }
        })
        .flat()
    },
    storeCount() {
      return (index) =>
        this.headers.slice(0, index).filter((item) => item.isStore)
          .length
    },
    replies() {
      return (index) => {
        const threadIndex = index - this.storeCount(index)
        return this.threads[
          threadIndex
        ].slice(1)
      }
    },
    repliesCount() {
      return (index) => {
        const threadIndex = index - this.storeCount(index)
        return (
          this.threads[threadIndex]
            .length - 1
        )
      }
    },
    threadId() {
      return (index) => {
        const threadIndex = index - this.storeCount(index)
        return this.threads[
          threadIndex
        ][0].thread_id
      }
    }
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