<template>
  <v-col justify-center class="px-0" xs="11">
    <v-card class="pa-5">
      <v-row class="pt-4 px-0">
        <v-col cols="2" class="text-center px-0">
          <vote-line
            :store="store"
            :isReviewUpvote="comment.score > 0"
            :parentReview="comment.id"
          ></vote-line>
          {{ Number(Math.abs(comment.score)).toLocaleString() }}
        </v-col>

        <v-col cols="10" class="comment-text pa-3">
          {{ comment.text.replace(/\+/g, ' ') }}
        </v-col>
      </v-row>

      <v-layout row pl-4 pr-4 mt-0 class="caption comment-extra">
        <v-flex grow pa-2>ID: {{ comment.id.substring(0, 5) }} </v-flex>
        <v-flex grow pa-2 class="text-right"
          >{{
            getISOStringWithoutSecsAndMillisecs(new Date(comment.timestamp))
          }}
        </v-flex>
        <v-flex shrink pr-2 pt-2>
          <vote-line
            :store="store"
            :parentReview="comment.id"
            :parentComment="comment.id"
            :comment="comment"
          ></vote-line>
        </v-flex>
      </v-layout>

      <!-- .sort((a, b) => {
                            return Math.abs(a.score) - Math.abs(b.score);
                        }) -->
      <v-layout
        row
        pt-1
        pb-1
        pl-3
        pr-3
        v-for="subComment in comments
          .filter((subComment) => subComment.parent == comment.id)
          .sort((a, b) => a.timestamp - b.timestamp)"
        :key="subComment.id"
      >
        <v-flex>
          <v-card class="pa-3">
            <v-layout row pa-2 pt-3>
              <v-flex
                pl-2
                class="comment-text"
                v-html="commentText(subComment.text.replace(/\+/g, ' '))"
              ></v-flex>
            </v-layout>

            <v-layout row pa-2 class="caption comment-extra">
              <v-flex grow pa-2
                >ID: {{ subComment.id.substring(0, 5) }}
              </v-flex>
              <v-flex grow pa-2 class="text-right"
                >{{
                  getISOStringWithoutSecsAndMillisecs(
                    new Date(subComment.timestamp)
                  )
                }}
              </v-flex>
              <v-flex shrink pr-2 pt-2>
                <vote-line
                  :store="store"
                  :parentReview="comment.id"
                  :parentComment="subComment.id"
                  :comment="comment"
                  :isReplyToSubComment="true"
                ></vote-line>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
  </v-col>
</template>

<script>
import VoteLine from './VoteLine.vue'
export default {
  components: { VoteLine },
  props: ['store', 'comment', 'comments'],

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
</style>
