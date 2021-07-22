<template>
  <div>
    <v-container class="pa-6" fluid>
      <h1 class="text-center">Popular Searches</h1>
      <v-row v-for="(catSearches, index) in popularSearches" :key="index">
        <v-col md="12">
          <h2>{{ catSearches.title }}</h2>
          <v-slide-group
            class="py-4 slide-group"
            active-class="success"
            show-arrows
          >
            <v-slide-item
              v-for="(store, index) in catSearches.stores"
              :key="index"
            >
              <store-card :store="store" class="store-card my-4" />
            </v-slide-item>
          </v-slide-group>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['popularSearches']),
  },
  mounted() {
    this.$store.dispatch('getPopularSearches')
  },
}
</script>

<style lang="scss" scoped>
.slide-group {
  ::v-deep {
    .v-slide-group__prev,
    .v-slide-group__next {
      min-width: 0;
    }
  }
}

.store-card {
  width: 300px;
  margin-left: 10px;
  margin-right: 10px;
}

@media screen and (min-width: 600px) {
  .store-card {
    width: 450px;
  }
}

@media screen and (min-width: 960px) {
  .store-card {
    width: 500px;
    margin-left: 20px;
    margin-right: 20px;
  }
}

@media screen and (min-width: 1264px) {
  .store-card {
    width: 500px;
    margin: auto;
  }
}
</style>
