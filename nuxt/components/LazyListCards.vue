<template>
  <div>
    <v-row :class="className" v-for="(item, index) in lazyItems" :key="index">
      <slot name="item" :slot-scope="item" />
    </v-row>
    <v-row :class="className">
      <v-card
        v-if="lazyItems.length === 0"
        class="mx-auto pa-5 text-center font-weight-bold default-card"
        outlined
      >
        {{ defaultMessage }}
      </v-card>
    </v-row>
    <v-layout v-if="!isMaxReached" align-center column>
      <p class="text-md-h3 text-center font-weight-bold mb-8">...</p>
      <v-btn color="primary" @click="loadMore">Load More</v-btn>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: '',
    },
    defaultMessage: {
      type: String,
      default: 'No Content to display',
    },
    items: {
      type: Array,
      default: () => [],
    },
    maxItems: {
      type: Number,
      default: 2,
    },
    steps: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      loadedItemsCount: this.maxItems,
    }
  },
  computed: {
    lazyItems() {
      return this.items.slice(0, this.loadedItemsCount)
    },
    isMaxReached() {
      return this.loadedItemsCount >= this.items.length
    },
  },
  methods: {
    loadMore() {
      this.loadedItemsCount += this.steps
    },
  },
}
</script>

<style lang="scss" scoped>
.default-card {
  width: 100%;
}
</style>
