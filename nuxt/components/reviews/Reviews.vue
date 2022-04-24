<template>
  <LazyListCards
    :items="reviews"
    :className="$style['store-row']"
    :maxItems="listCardsMaxItems"
  >
    <template slot="item" slot-scope="{ slotScope: discussion }">
      <store-card
        :class="`${$style['store-card']} mb-2`"
        :key="'store-' + discussion.store.id"
        :store="discussion.store"
      >
      </store-card>
      <Thread
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
        :onlyShowLast="2"
      >
      </Thread>
    </template>
  </LazyListCards>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import LazyListCards from '../LazyListCards'
import Thread from '../Thread.vue'

export default {
  components: {
    LazyListCards,
    Thread
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