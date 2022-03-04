<template>
  <v-chip-group
    @change="handleChange"
    mandatory
    color="primary"
    class="justify-content-center"
  >
    <div class="d-flex justify-center" style="width: 100%">
      <v-chip filter outlined v-for="topic in this.sortedTopics" :key="topic">
        {{ topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase().replace('_', ' ') }}&nbsp;({{getTopicCount(topic)}})
      </v-chip>
    </div>
  </v-chip-group>
</template>
<script>
import { mapState } from 'vuex'
export default {
  methods: {
    handleChange(index) {
      const payload = { topic: this.sortedTopics[index], index: index }
      this.$emit('on-topic-selected', payload)
    },
    getTopicCount(t) {
      if(t==='ALL') return this.$store.state.discussions.lastDiscussions.length
      let disc = JSON.parse(JSON.stringify(this.$store.state.discussions.lastDiscussions))
      return disc.filter(d=>d[0].topic===t).length
    }
  },
  computed: {
    topics: function() {
      return ['ALL', ...this.$store.state.discussions.topics]
    },
     sortedTopics: function() {
      let ts = ['ALL', ...this.$store.state.discussions.topics]
      ts.sort((t1,t2)=>(this.getTopicCount(t2)-this.getTopicCount(t1)))
      console.log(ts)
      return ts
    }
  }
}
</script>