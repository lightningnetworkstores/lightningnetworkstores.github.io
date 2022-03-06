<template>
  <v-container class="mb-0 pb-0">
    <v-row>
      <v-col cols="12" class="pa-0 pt-1">
        <div class="text-caption d-flex justify-space-between align-center my-1" style="width: 100%; background-color: #f9f9f9">
          <div>
            <UserTag :userId="discussionHeader.user_id"/>
          </div>
            {{ formatDate(discussionHeader.timestamp) }}
          <div>
            <DiscussionReplyModal
              :reply="discussionHeader"
              :threadId="threadId"
              :threadIndex="threadIndex"
            />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="isMobile ? 12 : 7" :class="{'pa-0': isMobile}">
        <div class="text-h6 font-weight-bold comment-title" style="flex-grow: 1"
          :inner-html.prop="discussionHeader.title"
        />
        <div
          class="text-body-1 comment-title discussion-text"
          :inner-html.prop="discussionHeader.comment | toHtml | tagUser"
        />
      </v-col>
      <v-col :cols="isMobile ? 0 : 5" class="d-flex flex-row justify-end align-end mr-0 pr-0">
        <div v-if="discussionHeader.store" class="flex-grow-1">
          <StorePreview class="hidden-sm-and-down" :store="discussionHeader.store"/>
        </div>
        <div class="d-flex justify-end flex-grow-0" style="min-width: 3em">
          <v-chip x-small class="mx-0 px-1">
            <v-icon class="mr-1">mdi-message-reply</v-icon>
            {{ repliesCount }}
          </v-chip>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import StorePreview from './StorePreview'
import DateFromatter from '~/mixins/DateFormatter'
import UserTag from './UserTag.vue'
import DiscussionReplyModal from './DiscussionReplyModal.vue'
export default {
  components: {
    StorePreview, UserTag, DiscussionReplyModal
  },
  mixins: [ DateFromatter ],
  props: {
    discussionHeader: {
      type: Object,
      required: true
    },
    repliesCount: {
      type: Number,
      default: 0
    },
    threadIndex: {
      type: Number
    },
    threadId: {
      type: String
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    }
  }
}
</script>
<style scoped>
.discussion-text {
  overflow-wrap: break-word;
}
</style>