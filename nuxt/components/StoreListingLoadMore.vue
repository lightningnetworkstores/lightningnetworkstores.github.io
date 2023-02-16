<template>
  <div>
    <div class="container full-list d-flex align-self-center">
      <h1>{{ header }}</h1>
      <v-btn
        v-if="canLoadMore"
        class="mt-2"
        small
        color="#fcb919"
        @click="loadMore"
      >Load more</v-btn>
    </div>
    <v-container class="full-list">
      <store-card
        v-for="store in stores"
        :key="'store-' + store.id"
        :data-storeId="store.id"
        :store="store"
      ></store-card>
    </v-container>
  </div>
</template>

<script>
import StoreCard from '~/components/StoreCard.vue'

export default {
  components: {
    StoreCard
  },
  props: {
    header: { type: String, default: '' },
    stores: { type: Array, default: () => [] },
    canLoadMore: { type: Boolean, default: false },
    loadMore: { type: Function, default: () => console.log('missing loadMore callback') }
  }
}
</script>
