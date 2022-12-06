<template>
  <v-container class="mb-0 pb-2">
    <v-row class="justify-image-card">
      <v-col
        cols="12" 
        class="pa-0 pt-1"
      >
        <div
          v-if="isMobile"
          class="col-with-image-style"
          :class="(discussionHeader.link)?'col-with-image-style-height':''"  
        >
          <v-img
            v-if="discussionHeader.link"
            width="100%"
            height="100%"
            max-height="100%"
            max-width="100%"
            position="center center"
            :lazy-src="discussionHeader.link"
            :src="discussionHeader.link"
            :style="{
              borderRadius: '5px 5px 0px 0px',
            }"
          ></v-img>
        </div>
        <div 
          class="header-container text-caption d-flex justify-space-between align-center my-3 px-2 tags-style"
        >
          <div>
            <UserTag
              :user="discussionHeader.user"
              :userId="discussionHeader.user_id"
            />
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
      <v-col :cols="isMobile ? 12 : ((discussionHeader.link)? 12 : 7)" :class="{'pa-0': isMobile}">
        <v-row v-if="!isMobile" no-gutters>
          <v-col md="2" class="mr-3">
            <discussion-image :url="discussionHeader.link"/>
          </v-col>
          <v-col :md="((discussionHeader.link)? 9 : 12)">
            <div class="text-h6 font-weight-bold comment-title" style="flex-grow: 1"
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
          <!-- begin -->
          <div class="text-h6 font-weight-bold comment-title" style="flex-grow: 1"
            :inner-html.prop="discussionHeader.title"
          />
          <UserComment
            :content="discussionHeader.comment"
            @hover-on="u => $emit('hover-on', u)"
            @hover-off="u => $emit('hover-off', u)"
          />
          <!-- end -->
        </div>
      </v-col>
      <v-col :cols="isMobile ? 0 : 4" class="d-flex flex-row justify-end align-end mr-0 pr-0">
        <div v-if="discussionHeader.store" class="flex-grow-1">
          <StorePreview class="hidden-sm-and-down" :store="discussionHeader.store"/>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="mx-0">
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
import UserTag from './UserTag.vue'
import DiscussionReplyModal from './DiscussionReplyModal.vue'
import DeleteCommentModal from './DeleteCommentModal'
import ChangeTopicModal from '@/components/discussions/ChangeTopicModal'
import UserComment from '@/components/discussions/UserComment'
import DiscussionImage from '@/components/discussions/DiscussionImage'

import { mapState } from 'vuex'

export default {
  components: {
    StorePreview, UserTag, DiscussionReplyModal, DeleteCommentModal, ChangeTopicModal, UserComment, DiscussionImage
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
    }
  },
  methods: {
    handleDetailClick(threadId) {
      window.open(`${this.$store.state.baseURL}discuss/${threadId}`, '_blank')
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

<style lang="sass">

</style>

<style scoped>
.discussion-text {
  overflow-wrap: break-word;
}
.header-container {
  border-radius: 30px;
}
.col-with-image-style {
    margin-bottom: 15px;
}
.col-with-image-style-height {
  height: 250px;
  max-height: 250px;
}
.tags-style {
  width: 98%;
  height: 36px;
  background-color: #f9f9f9; 
  z-index: 2;
}
.justify-image-card {
  margin: -16px -24px
}

@media screen and (max-width: 1265px) {
  .justify-image-card {
    margin: -16px -16px
  }
}
</style>