<template>
  <div
    :class="{
      'favorites-filter': true,
      'ml-4': true,
      active: filterByFavorites,
    }"
    @click="onFilterByFavorites"
  >
    <label :class="{ 'lb-fav-active': filterByFavorites }"
      >Show favorites</label
    >
    <v-icon class="ml-1" dense :color="filterByFavorites ? `red` : `gray`"
      >fa-heart</v-icon
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['filterByFavorites']),
  },
  methods: {
    onFilterByFavorites() {
      this.$store.dispatch('toggleFilterByFavoritesStores')
    },
  },
}
</script>

<style lang="scss" scoped>
$activeBackground: #eaeaea;

.favorites-filter {
  cursor: pointer;
  font-size: 16px;
  width: 160px;
  background-color: #efefef;
  padding: 10px;

  .lb-fav-active {
    font-weight: 500;
  }

  label {
    cursor: pointer;
  }

  &:hover {
    background: $activeBackground;
  }

  &:hover .v-icon {
    color: red;
  }

  &.active {
    background-color: $activeBackground;
  }
}
</style>
