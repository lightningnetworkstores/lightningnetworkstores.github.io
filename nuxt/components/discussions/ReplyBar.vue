<template>
  <div class="text-caption d-flex justify-space-between my-3">
    <div class="bar-column-sides">
      <UserTag
        :user="reply.user"
        :userId="reply.user.id"
      />
    </div>
    <div class="bar-column-middle d-flex justify-center">
      {{ formatDate(reply.timestamp) }}
    </div>
    <div class="bar-column-sides d-flex justify-end">
      <DiscussionReplyModal
        :reply="reply"
        :threadId="threadId"
        :threadIndex="threadIndex"
        @paid-reply-request="handlePaidReplyRequest"
      />
    </div>
  </div>
</template>
<script>
import DateFromatter from '~/mixins/DateFormatter'
import DiscussionReplyModal from './DiscussionReplyModal.vue'
import UserTag from './UserTag.vue'
export default {
  components: {
    DiscussionReplyModal, UserTag
  },
  mixins: [ DateFromatter ],
  props: {
    reply: {
      type: Object,
      required: true
    },
    threadIndex: {
      type: Number,
      required: true
    },
    threadId: {
      type: String,
      required: true
    },
    handlePaidReplyRequest: {
      type: Function,
      required: true
    }
  }
}
</script>
<style scoped>
.bar-column-sides {
  width: 33.33%;
}
.bar-column-middle {
  width: 33.33%
}
@media (max-width: 600px) {
  .bar-column-middle {
    width: 25%
  }
  .bar-column-sides {
    width: 37.5%
  }
}
</style>