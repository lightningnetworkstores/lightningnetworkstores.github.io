<template>
  <v-layout justify-center>
    <AddDiscussModal />
    <v-flex xs12 md12 lg10 xl12>
      <v-container>
        <v-row>
          <v-col cols="12" md="4" xs="12" sm="12">
            <div class="text-center text-h6 py-6">
              <v-layout justify-center ma-3>
                <h2>General discussions</h2></v-layout
              >
            </div>
            <v-row
              class="store-row"
              justify="center"
              v-for="(discussion, index) in lastDiscussions"
              :key="index"
            >
              <Review
                class="store-card"
                :store="{}"
                :comment="discussion[0]"
                :comments="discussion.slice(1)"
                :type="'discussion'"
                :onlyShowLast="2"
              >
              </Review>
            </v-row>
          </v-col>
          <v-col cols="12" md="4" sm="12" xs="12">
            <div class="text-center text-h6 py-6">
              <v-layout justify-center ma-3>
                <h2>Store discussions/reviews</h2></v-layout
              >
            </div>
            <v-row
              class="store-row"
              v-for="discussion in lazyDiscussions"
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
                :comment="
                  discussion.reviews
                    ? discussion.reviews[0]
                    : discussion.discussions[0]
                "
                :comments="
                  discussion.reviews
                    ? discussion.reviews.slice(1)
                    : discussion.discussions.slice(1)
                "
                :store="discussion.store"
                :type="discussion.reviews ? 'comment' : 'discussion'"
              >
              </Review>
            </v-row>
            <v-layout v-if="!isMaxDiscussionsReached" align-center column>
              <p class="text-md-h3 text-center font-weight-bold mb-8">...</p>
              <v-btn color="primary" @click="loadMoreDiscussions"
                >Load More</v-btn
              >
            </v-layout>
          </v-col>
          <v-col cols="12" md="4" sm="12" xs="12">
            <div class="text-center text-h6 py-6">
              <v-layout justify-center ma-3> <h2>Events</h2></v-layout>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-container> </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

import AddDiscussModal from '@/components/AddDiscussModal.vue'
import DiscussionCard from '@/components/DiscussionCard.vue'
import LazyListCards from '@/components/LazyListCards.vue'

export default {
  components: { AddDiscussModal, DiscussionCard, LazyListCards },
  data() {
    return {
      discussions: [],
      maxCards: 1,
    }
  },
  computed: {
    ...mapGetters(['getActiveStoreDiscussions']),
    ...mapState(['lastDiscussions']),
    lazyDiscussions() {
      return this.getActiveStoreDiscussions.slice(0, this.maxCards)
    },
    isMaxDiscussionsReached() {
      return this.maxCards >= this.getActiveStoreDiscussions.length
    },
  },
  methods: {
    loadMoreDiscussions() {
      this.maxCards += 2
    },
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
@media (max-width: 600px) {
  .store-row {
    padding: 1.5em 0;
  }
  .store-card {
    width: 100%;
  }
}
</style>
