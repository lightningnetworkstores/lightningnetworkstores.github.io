<template>
  <v-col justify-center class="px-0 pt-0" xs="11">
    <v-card
      :hover="type !== 'comment'"
      class="pa-5"
      @click.native="gotoDiscussion(comment.thread_id)"
    >
      <v-row class="px-0">
        <v-col cols="2" class="text-center px-0 mt-4" v-if="type === 'comment'">
          <vote-line
            :store="store"
            :isReviewUpvote="comment.score > 0"
            :parentReview="comment.id"
            :type="type"
          ></vote-line>
          {{ Number(Math.abs(comment.score)).toLocaleString() }}
        </v-col>

        <v-col
          cols="10"
          class="comment-text pa-3"
          v-if="comment && comment.text"
        >
          {{ comment.text.replace(/\+/g, ' ') }}
        </v-col>

        <v-col
          cols="12"
          class="comment-text pa-3"
          v-if="comment && comment.comment"
        >
          <div class="discussion-title">
            {{ comment.title }}
          </div>
          <div class="pt-2">{{ comment.comment.replace(/\+/g, ' ') }}</div>
        </v-col>
      </v-row>

      <v-layout row pl-4 pr-4 mt-0 class="caption comment-extra">
        <v-flex grow pa-2>ID: {{ comment.id.substring(0, 8) }} </v-flex>
        <v-flex grow pa-2 class="text-right"
          >{{
            getISOStringWithoutSecsAndMillisecs(new Date(comment.timestamp))
          }}
        </v-flex>
        <v-flex shrink pr-2 pt-2>
          <vote-line
            :store="store"
            :parentReview="comment.id"
            :parentComment="
              type === 'discussion' || type === 'store discussion'
                ? comment.thread_id
                : comment.id
            "
            :comment="comment"
            :type="type"
          ></vote-line>
        </v-flex>
      </v-layout>
      <!-- .sort((a, b) => {
                            return Math.abs(a.score) - Math.abs(b.score);
                        }) -->
      <v-flex v-if="comments && comments.length > onlyShowLast">
        <v-card class="py-6 my-4 text-center">
          <v-icon large>mdi-dots-horizontal</v-icon>
        </v-card>
      </v-flex>
      <v-layout
        row
        pt-1
        pb-1
        pl-3
        pr-3
        v-for="subComment in commentsArr"
        :key="subComment.id"
      >
        <Reply
          :post="subComment"
          :parentReview="comment.id"
          :store="store"
          :type="type === 'comment' ? 'comment reply' : 'discussion reply'"
        />
      </v-layout>
    </v-card>
  </v-col>
</template>

<script>
import VoteLine from './VoteLine.vue'
import Reply from '@/components/Reply.vue'
export default {
  components: { VoteLine, Reply },
  props: ['store', 'comment', 'comments', 'type', 'onlyShowLast'],
  computed: {
    commentsArr() {
      if (this.type === 'comment') {
        return this.comments
          .filter((subComment) => subComment.parent == this.comment.id)
          .sort((a, b) => a.timestamp - b.timestamp)
      } else {
        if (this.comments.length > this.onlyShowLast) {
          return this.comments.slice(
            this.comments.length - this.onlyShowLast,
            this.comments.length
          )
        } else {
          return this.comments
        }
      }
    },
  },
  mounted() {},
  methods: {
    commentText(comment) {
      return comment.startsWith('@')
        ? "<span class='user-tag'>" +
            this.htmlEntities(comment.substring(0, 6)) +
            '</span>' +
            this.htmlEntities(comment.substring(6, comment.length))
        : this.htmlEntities(comment)
    },
    htmlEntities(input) {
      return String(input)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
    },

    getISOStringWithoutSecsAndMillisecs(date) {
      const dateAndTime = date.toISOString().split('T')
      const time = dateAndTime[1].split(':')
      //   return '000000'
      return dateAndTime[0] + ' ' + time[0] + ':' + time[1]
    },
    gotoDiscussion(discussion_id) {
      if (this.type === 'discussion') {
        this.$router.push(`/discuss/${discussion_id}`)
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.score-line {
  line-height: 30px;
}
.user-tag {
  background-color: #dddddd;
}
//.comment-extra {
// color: rgba(0, 0, 0, 0.5);
//}
.comment-text {
  -ms-word-break: break-all;
  word-break: break-all;
  word-break: break-word;
  max-height: 330px;
  overflow-y: hidden;
}
.discussion-title {
  font-size: 1.7rem !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
