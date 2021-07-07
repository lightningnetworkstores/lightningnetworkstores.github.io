<template>
  <div>
    <v-row
      class="store-row"
      justify="center"
      v-for="(item, index) in items"
      :key="index"
    >
      <slot name="item" :slot="item"></slot>
    </v-row>
    <v-layout v-if="!isMaxDiscussionsReached" align-center column>
      <p class="text-md-h3 text-center font-weight-bold mb-8">...</p>
      <v-btn color="primary" @click="$emit('load-more')">Load More</v-btn>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped></style>
