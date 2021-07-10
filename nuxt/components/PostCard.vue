<template>
  <v-flex>
    <v-card class="pa-3">
      <v-layout row pa-2 pt-3>
        <v-flex
          v-if="post.text"
          pl-2
          class="comment-text"
          v-html="commentText(post.text.replace(/\+/g, ' '))"
        ></v-flex>
        <v-flex
          v-if="post.comment"
          pl-2
          class="comment-text"
          v-html="commentText(post.comment.replace(/\+/g, ' '))"
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
        <v-flex grow pa-2 class="text-right"
          >{{ new Date(post.timestamp) | formatDate }}
        </v-flex>
        <v-flex shrink pr-2 pt-2>
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
                ? true
                : false
            "
            :type="type"
          ></vote-line>
        </v-flex>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'PostCard',
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
  },
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
    getPillColor(id) {
      const hex = Buffer.from(id, 'base64').toString('hex')
      console.log(hex.substring(0, 10), hex)
      return `#${hex.substring(0, 6)}`
    },
  },
}
</script>
