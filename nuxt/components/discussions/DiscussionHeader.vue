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
            <v-btn icon @click="() => handleDetailClick(threadId)">
              <v-icon>
                mdi-open-in-new
              </v-icon>
            </v-btn>
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
      <v-col :cols="isMobile ? 0 : 4" class="d-flex flex-row justify-end align-end mr-0 pr-0">
        <div v-if="discussionHeader.store" class="flex-grow-1">
          <StorePreview class="hidden-sm-and-down" :store="discussionHeader.store"/>
        </div>
      </v-col>
      <v-col :cols="1" class="d-flex flex-column justify-space-around mx-0 px-0">
        <div class="d-flex justify-end flex-grow-0" style="min-width: 3em">
          <v-chip x-small class="mx-0 px-1">
            <v-icon class="mr-1">mdi-message-reply</v-icon>
            {{ repliesCount }}
          </v-chip>
        </div>
        <DeleteCommentModal v-if="isAdmin"
          :threadIndex="threadIndex"
          :commentId="discussionHeader.id"
        />
        <div class="d-flex justify-end flex-grow-0" style="min-width: 3em">
          <DiscussionReplyModal
            :reply="{...discussionHeader, id: 'Reply'}"
            :threadId="threadId"
            :threadIndex="threadIndex"
            :mentionReference="false"
            color="primary"
            @paid-reply-request="data => $emit('paid-reply-request', data)"
          />
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
import DeleteCommentModal from './DeleteCommentModal'
import { mapState } from 'vuex'

export default {
  components: {
    StorePreview, UserTag, DiscussionReplyModal, DeleteCommentModal
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
  methods: {
    handleDetailClick(threadId) {
      this.$router.push(`/discuss/${threadId}`)
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    ...mapState('discussions', ['isAdmin'])
  }
}
</script>
<style scoped>
.discussion-text {
  overflow-wrap: break-word;
}
</style>