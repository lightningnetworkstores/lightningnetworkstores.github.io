<template>
  <div>
    <div>
      <Topics @on-topic-selected="onTopicSelected" />
    </div>
    <discussion-threads
      v-if="!$vuetify.breakpoint.mobile"
      :displayDetailLink="true"
      :threads="threads"
    />
    <discussion-threads-mobile
      v-if="$vuetify.breakpoint.mobile"
      :displayDetailLink="true"
      :threads="threads"
    />
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import Topics from './Topics.vue'
import DiscussionThreads from './DiscussionThreads.vue'
import DiscussionThreadsMobile from './DiscussionThreadsMobile.vue'

export default {
  components: {
    Topics,
    DiscussionThreads,
    DiscussionThreadsMobile
  },
  data() {
    return {
      selectedTopic: 'ALL'
    }
  },
  mounted() {
    this.$store.dispatch('discussions/getLogStatus')
  },
  methods: {
    onTopicSelected({ topic }) {
      this.selectedTopic = topic
    },
  },
  computed: {
    threads() {
      return this.filteredDiscussions(this.selectedTopic)
    },
    ...mapGetters('discussions', ['filteredDiscussions']),
    ...mapState('discussions', ['error', 'isAdmin']),
  },
}
</script>
<style scoped>
@media (max-width: 600px) {
  .comment-title {
    width: 45vh;
    overflow: hidden;
  }
}
selected-comment {
  background-color: aliceblue;
}
</style>