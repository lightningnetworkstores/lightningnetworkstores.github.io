<template>
  <v-layout justify-center>
    <v-flex xs12 md12 lg10 xl2 class="pa-2">
      <v-container>
        <v-row
          class="store-row"
          v-for="discussion in this.$store.getters.getDiscussions"
          :key="'store-' + discussion.store.id">
            <store-card
              class="store-card"
              :key="'store-' + discussion.store.id"
              :store="discussion.store">
            </store-card>
            <Review
              class="store-card"
              :comment="discussion.comments[0]"
              :comments="discussion.comments.slice(1)"
              :store="discussion.store">
            </Review>
        </v-row>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      discussions: []
    }
  },
  mounted() {
    console.log('mounted');
    this.$store.dispatch('getDiscussions');
  }
}
</script>
<style scoped>
  .store-row {
    flex-direction: column;
    align-content: center;
    padding: 2em;
  }
  .store-card {
    width: 50%;
  }
  @media (max-width: 600px) {
    .store-row {
      padding: 1.5em 0;
    }
    .store-card {
      width: 100%;
    }
  }
</style>