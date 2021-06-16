<template>
  <v-layout justify-center>
    <v-flex xs12 md12 lg10 xl2 class="pa-2">
      <div class="text-center text-h6 py-6">Last Discussions</div>
      <v-container>
        <AddDiscussModal />
        <v-row
          justify="center"
          v-for="(discussion, index) in $store.state.lastDiscussions"
          :key="index"
        >
          <DiscussionCard :discussion="discussion[0]" class="mb-5" />
        </v-row>
        <v-row
          class="store-row"
          v-for="discussion in $store.getters.getActiveStoreDiscussions"
          :key="'store-' + discussion.store.id"
        >
          <store-card
            class="store-card"
            :key="'store-' + discussion.store.id"
            :store="discussion.store"
          >
          </store-card>
          <Review
            class="store-card"
            :comment="discussion.reviews[0]"
            :comments="discussion.reviews.slice(1)"
            :store="discussion.store"
          >
          </Review>
        </v-row>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import AddDiscussModal from '@/components/AddDiscussModal.vue'
import DiscussionCard from '@/components/DiscussionCard.vue'
export default {
  components: { AddDiscussModal, DiscussionCard },
  data() {
    return {
      discussions: [],
    }
  },
  mounted() {
    console.log('mounted')
    this.$store.dispatch('getDiscussions')
  },
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
