<template>
  <v-chip-group
    @change="handleChange"
    mandatory
    color="primary"
    class="justify-content-center"
  >
    <div class="d-flex justify-center" style="width: 100%">
      <v-chip filter outlined v-for="topic in topics" :key="topic">
        {{ topic }}
      </v-chip>
    </div>
  </v-chip-group>
</template>
<script>
import { mapState } from 'vuex'
export default {
  methods: {
    handleChange(index) {
      const payload = { topic: this.topics[index], index: index }
      this.$emit('on-topic-selected', payload)
    }
  },
  computed: mapState({
    topics: state => [
      'ALL',
      ...state.discussions.topics
    ]
  })
}
</script>