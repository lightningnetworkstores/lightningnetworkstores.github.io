<template>
  <div v-if="discussion && discussion.length">
      <v-layout justify-center ma-4><h1>{{discussion[0].title}}</h1></v-layout>
    <v-col lg="6">
      <PostCard :post="discussion[0]" :type="'discussion'" />
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
        <PostCard :post="subComment" :threadId="discussion[0].thread_id" :type="'discussion reply'" />
      </v-layout>
    </v-col>
  </div>
</template>
<script>
import PostCard from '@/components/PostCard.vue'
export default {
  components: {
    PostCard,
  },
  data() {
    return {
      discussion: [],
    }
  },
  mounted() {
    this.fetchDiscussion(this.$route.params.id)
  },
  methods: {
    fetchDiscussion(id) {
      this.$store.dispatch('getDiscussion', id).then((response) => {
        this.discussion = response.discussions
      })
    },
  },
}
</script>
