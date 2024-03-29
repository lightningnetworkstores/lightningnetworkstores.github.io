<template>
  <v-container class="mb-0 pb-2 header-container">
    <v-row class="justify-image-card">
      <v-col
        cols="12"
        class="px-1 pb-0 pt-1"
      >
        <div
          v-if="isMobile"
          class="col-with-image-style"
          :class="(discussionHeader.link)?'col-with-image-style-height':''"  
        >
          <discussion-image v-if="discussionHeader.link" :url="discussionHeader.link"/>
        </div>
        <header-bar
          :user="discussionHeader.user"
          :timestamp="discussionHeader.timestamp"
          :displayDetailLink="displayDetailLink"
          :threadId="threadId"
        />
      </v-col>
    </v-row>
    <v-row class="py-0">
      <v-col :cols="isMobile ? 12 : ((discussionHeader.link)? 12 : 7)" :class="{'pa-0': isMobile}" class="py-1">
        <v-row v-if="!isMobile" no-gutters>
          <v-col cols="2" class="mr-3 d-flex justify-center align-center">
            <discussion-image v-if="discussionHeader.link" :url="discussionHeader.link"/>
          </v-col>
          <v-col :cols="((discussionHeader.link)? 9 : 12)">
            <div class="text-h6 px-3 font-weight-bold comment-title" style="flex-grow: 1"
              :inner-html.prop="discussionHeader.title"
            />
            <UserComment
              :content="discussionHeader.comment"
              @hover-on="u => $emit('hover-on', u)"
              @hover-off="u => $emit('hover-off', u)"
            />  
          </v-col>
        </v-row>
        <div v-else>
          <div class="text-h6 px-3 font-weight-bold comment-title" style="flex-grow: 1"
            :inner-html.prop="discussionHeader.title"
          />
          <UserComment
            :content="discussionHeader.comment"
            @hover-on="u => $emit('hover-on', u)"
            @hover-off="u => $emit('hover-off', u)"
          />
        </div>
      </v-col>
      <v-col
        v-if="discussionHeader.store"
        :cols="isMobile ? 0 : 4"
        class="d-flex flex-row justify-end align-center mr-0 pr-0 py-1"
      >
        <div class="flex-grow-1">
          <StorePreview :store="discussionHeader.store"/>
        </div>
      </v-col>
    </v-row>
    <v-row class="mx-md-1">
      <v-col cols="12" class="mx-0 my-0 pt-0 px-1 pb-4 pb-md-0">
        <div class="d-flex justify-space-between align-center">
          <v-chip x-small class="mx-0 px-1">
            <v-icon class="mr-1">mdi-message-reply</v-icon>
            {{ repliesCount }}
          </v-chip>
          <DeleteCommentModal v-if="isAdmin"
            :threadIndex="threadIndex"
            :commentId="discussionHeader.id"
          />
          <ChangeTopicModal v-if="isAdmin"
            :threadId="threadId"
          />
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
import DiscussionReplyModal from './DiscussionReplyModal.vue'
import DeleteCommentModal from './DeleteCommentModal'
import ChangeTopicModal from '@/components/discussions/ChangeTopicModal'
import UserComment from '@/components/discussions/UserComment'
import DiscussionImage from '@/components/discussions/DiscussionImage'
import HeaderBar from '@/components/discussions/HeaderBar'

import { mapState } from 'vuex'

export default {
  components: {
    StorePreview, DiscussionReplyModal, DeleteCommentModal, ChangeTopicModal, UserComment, DiscussionImage, HeaderBar
  },
  mixins: [ DateFromatter ],
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
    },
    displayDetailLink: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.name === 'xs'
    },
    ...mapState('discussions', ['isAdmin'])
  }
}
</script>

<style lang="sass">

</style>

<style scoped>
.col-with-image-style {
    margin-bottom: 15px;
}
.col-with-image-style-height {
  height: 250px;
  max-height: 250px;
}
.justify-image-card {
  margin: -16px -24px
}

@media screen and (max-width: 1265px) {
  .justify-image-card {
    margin: -16px -16px
  }
}

.header-container {
  margin: auto;
}
@media (min-width: 1264px) {
  .header-container {
    max-width: 1185px;
  }
}
</style>