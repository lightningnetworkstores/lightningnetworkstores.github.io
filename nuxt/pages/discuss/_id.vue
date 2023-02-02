<template>
  <v-container>
    <v-row>
      <v-col>
        <div v-if="selected && selected.length" class="d-flex justify-space-around mt-6">
          <discussion-threads :expand="true" :threads="[selected]"/>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'

import DiscussionThreads from '@/components/discussions/DiscussionThreads'
import Head from '~/mixins/Head'

export default {
  mixins: [ Head ],
  head() {
    return this.getMetadata(
      'Nostrich.fun discussion page',
      this.title,
      this.selected[0].link
    )
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
