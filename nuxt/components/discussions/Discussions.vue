<template>
  <div>
    <div>
      <v-expansion-panels>
        <v-expansion-panel v-for="(comment, index) in comments" :key="comment.id">
          <v-expansion-panel-header class="d-flex flex-column align-start">
            <div class="text-subtitle-1 font-weight-bold"
              :inner-html.prop="comment.title"
            >
            </div>
            <div
              class="text-body-1 comment-title"
              :inner-html.prop="comment.comment | toHtml | tagUser"
            >
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-sheet v-for="(reply, replyIndex) in replies(index)" :key="reply.id">
              <v-divider v-if="replyIndex === 0"></v-divider>
              <div class="py-3 text-body-1"
                :inner-html.prop="reply.comment | toHtml | tagUser"
              >
              </div>
              <div class="text-caption d-flex justify-space-between">
                <div style="color: gray">
                  <UserTag :userId="reply.user_id"/>
                </div>
                  {{ formatDate(reply.timestamp) }}
                <div>
                  <DiscussionReply :reply="reply"/>
                </div>
              </div>
              <v-divider v-if="replyIndex < (repliesCount(index) - 2)"></v-divider>
            </v-sheet>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { format } from 'timeago.js'

import DiscussionReply from './DiscussionReply.vue'
import UserTag from './UserTag.vue'

export default {
  components: { DiscussionReply, UserTag },
  async mounted() {
    await this.$store.dispatch('discussions/getDiscussions')
  },
  methods: {
    formatDate(timestamp) {
      return format(timestamp)
    }
  },
  computed: {
    comments() {
      return this.lastDiscussions.map(comments => comments[0])
    },
    replies() {
      return index => this.lastDiscussions[index].slice(1)
    },
    repliesCount() {
      return index => this.lastDiscussions[index].length
    },
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