<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-around">
          <div v-if="selected && selected.length" class="my-6">
            <discussion-threads :expand="true" :threads="[selected]"/>
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
          content: this.title,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lightning Network Discussion page',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.title,
        },
        {
          hid: 'og:image',
          property: 'og:description',
          content: this.selected[0].link,
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: 'Lightning Network Discussion page',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: this.title,
        },
        {
          hid: 'twitter:image:src',
          property: 'twitter:image:src',
          content: this.selected[0].link,
        },
      ],
    }
  },

  components: {
    DiscussionThreads
  },

  computed: {
    title() {
      return this.selected ? this.selected[0].title : ''
    },
    ...mapState(['lastCommentSeenTimestamp']),
    ...mapState('discussion', ['selected'])
  },

  async asyncData({ params, store }) {
    await store.dispatch('discussion/getDiscussion', params.id)
  },

  async mounted() {
    this.$recaptcha.init()
    setInterval(() => this.$recaptcha.init(), 2 * 60 * 1000)

    await this.$store.dispatch('getLastDiscussionTimestamp')
    if (this.selected) {
      const { timestamp } = this.selected[this.selected.length - 1]

      if (this.lastCommentSeenTimestamp < timestamp) {
        this.$store.dispatch('updateLastDiscussionTime', {
          discussionTime: timestamp,
        })
      }
    }
  },
}
</script>
