<template>
  <LazyListCards
    :items="reviews"
    :className="$style['store-row']"
    :maxItems="listCardsMaxItems"
  >
    <template slot="item" slot-scope="{ slotScope: tuple }">
      <store-card
        :class="`${$style['store-card']} mb-0`"
        :key="tuple.store.id"
        :store="tuple.store"
      >
      </store-card>
      <review-list
        class="mb-6 pb-0 pt-0"
        @toggleHelpful="toggleHelpful"
        :reviews="[tuple.reviews]"
        :storeId="tuple.store.id"
        :showReviewsWithStars="[1,2,3,4,5]"
      />
    </template>
  </LazyListCards>
</template>
<script>
import { mapState } from 'vuex'
import LazyListCards from '../LazyListCards'
import ReviewList from '@/components/ReviewList.vue'

export default {
  components: {
    ReviewList,
    LazyListCards,
  },
  async mounted() {
    await this.$store.dispatch('getDiscussions')
    for (let storeId of this.storeIds) {
      await this.$store.dispatch('getStatus', { storeId })
    }
  },
  methods: {
    toggleHelpful(payload) {
      this.$store.dispatch('discussions/toggleHelpful', payload)
    }
  },
  computed: {
    ...mapState('discussions', ['reviews']),
    storeIds() {
      return this.reviews.map(tuple => tuple.store.id)
    },
    listCardsMaxItems() {
      return this.$vuetify.breakpoint.width >= this.screenWidthBp ? 10 : 1
    }
  }
}
</script>
<style module>
.store-row {
  flex-direction: column;
  align-content: center;
  padding: 2em;
  max-width: 550px;
  margin: auto;
}
.store-card {
  width: 100%;
}
@media (max-width: 600px) {
  .store-row {
    padding: 1.5em 0;
  }
}
</style>