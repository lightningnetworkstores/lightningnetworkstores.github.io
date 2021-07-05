<template>
  <v-flex>
    <div v-if="tweet">
      <blockquote class="twitter-tweet">
        <a :href="event.url" data-width="30" data-height="30"></a>
      </blockquote>
      <script
        async
        src="https://platform.twitter.com/widgets.js"
        charset="utf-8"
      ></script>
    </div>
    <a
      v-else
      :href="event.url ? event.url : 'javascript:'"
      class="text-decoration-none"
    >
      <v-card class="py-3 px-5">
        <div class="discussion-title">
          {{ event.title }}
        </div>
        <v-flex
          class="pt-2"
          v-html="commentText(event.description.replace(/\+/g, ' '))"
        ></v-flex>
        <div class="pt-2">
          <div>
            <span class="font-weight-black">Time left :</span>
            {{ timeDifference }}
          </div>
        </div>
        <div class="pt-2"></div>
      </v-card>
    </a>
  </v-flex>
</template>

<script>
export default {
  name: 'EventCard',
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
    event: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    timeDifference() {
      const start = new Date()
      const end = new Date(this.event.end)
      const diff = end.getTime() - start.getTime()
      let msec = diff
      const hh = Math.floor(msec / 1000 / 60 / 60)
      msec -= hh * 1000 * 60 * 60
      const mm = Math.floor(msec / 1000 / 60)
      msec -= mm * 1000 * 60
      return `${hh}hr ${mm}min`
    },
    tweet() {
      var res = this.event.url.match(
        /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/
      )
      if (res) {
        return true
      } else {
        return false
      }
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
  },
}
</script>
<style lang="scss">
.discussion-title {
  font-size: 1.7rem !important;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
