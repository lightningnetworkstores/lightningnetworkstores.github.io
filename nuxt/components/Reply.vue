<template>
  <v-flex>
    <v-card class="pa-3">
      <v-layout row pa-2 pt-3>
        <v-flex
          v-if="post.text"
          pl-2
          class="comment-text"
          :inner-html.prop="postText | toHtml | tagUser"
        ></v-flex>
        <v-flex
          v-if="post.comment"
          pl-2
          class="comment-text"
          :inner-html.prop="postComment | toHtml | tagUser"
        ></v-flex>
      </v-layout>

      <v-layout row pa-2 class="caption comment-extra">
        <v-flex grow pa-2
          >ID: {{ post.id.substring(0, 8) }}
          <span v-if="post && post.user_id" class="ml-6">
            <v-chip
              :color="getPillColor(post.user_id)"
              text-color="white"
              small
              >{{ post.user_id }}</v-chip
            >
          </span>
        </v-flex>
        <v-flex row class="text-right" justify-center align-center>
          <v-icon
            small
            v-if="loginStatus.isAdmin"
            class="mr-3"
            @click.stop="deleteComment"
            >mdi-block-helper</v-icon
          >
          <span>{{ new Date(post.timestamp) | formatDate }}</span>
          <v-flex shrink class="ml-3">
            <vote-line
              :store="store"
              :parentReview="parentReview"
              :parentComment="
                type === 'discussion reply' || type === 'comment reply'
                  ? post.id
                  : type === 'discussion'
                  ? post.thread_id
                  : ''
              "
              :comment="post"
              :isReplyToSubComment="
                type === 'discussion reply' || type === 'comment reply'
              "
              :type="type"
            ></vote-line>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Reply',
  props: {
    post: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: '',
    },
    parentReview: {
      type: String,
      default: '',
    },
    store: {
      type: Object,
      default: () => {},
    },
    threadId: {
      // parentReview is being used instead
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState({
      loginStatus: 'loginStatus',
    }),
    postComment() {
      return this.limitParagraphs(this.post.comment, 5)
    },
    postText() {
      return this.limitParagraphs(this.post.text, 5)
    },
  },
  methods: {
    limitParagraphs(text, limit) {
      return (
        text.split('\n').slice(0, limit).join('\n') +
        text.split('\n').slice(limit).join('. ')
      )
    },
    getPillColor(id) {
      const hex = Buffer.from(id, 'base64').toString('hex')
      return `#${hex.substring(0, 6)}`
    },
    async deleteComment() {
      const { id } = this.post
      const result = confirm(
        `Do you want delete this comment? ID:${id.substring(0, 8)}`
      )

      if (result) {
        try {
          await this.$store.dispatch('deleteReply', { replyId: id })
          document.location.reload()
        } catch (error) {
          console.error(error)
        }
      }
    },
  },
}
</script>
