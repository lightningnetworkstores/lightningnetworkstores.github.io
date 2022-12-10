<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-around mt-5">
          <div v-if="discussion && discussion.length" class="mx-6 my-6">
            <discussion-threads :threads="[discussion]"/>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'

import DiscussionThreads from '@/components/discussions/DiscussionThreads'

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
    DiscussionThreads
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
