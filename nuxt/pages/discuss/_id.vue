<template>
  <div v-if="discussion && discussion.length">
    <v-layout justify-center ma-4
      ><h1>{{ discussion[0].title }}</h1></v-layout
    >
    <v-col lg="6">
      <Reply :post="discussion[0]" :type="'discussion'" />
    </v-col>
    <v-col lg="5">
      <v-layout
        row
        pt-1
        pb-1
        pl-3
        pr-3
        v-for="subComment in discussion.slice(1)"
        :key="subComment.id"
      >
        <Reply
          :post="subComment"
          :threadId="discussion[0].thread_id"
          :parentReview="discussion[0].thread_id"
          :type="'discussion reply'"
        />
      </v-layout>
    </v-col>
  </div>
</template>
<script>
import { mapState } from 'vuex'

import Reply from '@/components/Reply.vue'

export default {
  head() {
    return {
      title: 'Lightning Network Discussion page',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.discussion[0].title,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lightning Network Discussion page',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.discussion[0].title,
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: 'Lightning Network Discussion page',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: this.discussion[0].title,
        },
      ],
    }
  },

  components: {
    Reply,
  },

  computed: {
    ...mapState(['lastCommentSeenTimestamp']),
  },

  async asyncData({ params, store }) {
    const resp = await store.dispatch('getDiscussion', params.id)

    return {
      discussion: resp.discussions,
    }
  },

  async mounted() {
    this.$recaptcha.init()
    setInterval(() => this.$recaptcha.init(), 2 * 60 * 1000)

    await this.$store.dispatch('getLastDiscussionTimestamp')
    const { timestamp } = this.discussion[this.discussion.length - 1]

    if (this.lastCommentSeenTimestamp < timestamp) {
      this.$store.dispatch('updateLastDiscussionTime', {
        discussionTime: timestamp,
      })
    }
  },
}
</script>
