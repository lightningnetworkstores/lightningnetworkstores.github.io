<template>
  <LazyListCards
    :items="reviews"
    :className="$style['store-row']"
    :maxItems="listCardsMaxItems"
  >
    <template slot="item" slot-scope="{ slotScope: discussion }">
      <store-card
        :class="`${$style['store-card']} mb-0`"
        :key="'store-' + discussion.store.id"
        :store="discussion.store"
      >
      </store-card>
      <review-list
        class="mb-6 pb-0 pt-0"
        :reviews="[discussion.reviews]"
        :storeId="discussion.store.id"
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
  mounted() {
    this.$store.dispatch('getDiscussions')
  },
  computed: {
    ...mapState('discussions', ['reviews']),
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