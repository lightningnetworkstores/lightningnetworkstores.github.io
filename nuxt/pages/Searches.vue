<template>
  <div>
    <v-container class="pa-6" fluid>
      <h1 class="text-center">Popular Searches</h1>
      <v-row v-for="(catSearches, index) in popularSearches" :key="index">
        <v-col md="12">
          <h2>{{ catSearches.title }}</h2>
          <v-slide-group
            v-model="model"
            class="py-4"
            active-class="success"
            :show-arrows="!$vuetify.breakpoint.xs"
          >
            <v-slide-item
              v-for="(store, index) in catSearches.stores"
              :key="index"
            >
              <store-card :store="store" class="store-card my-4"></store-card>
            </v-slide-item>
          </v-slide-group>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <!-- <div>
    <v-container class="pa-6">
      <h1 class="text-center">Popular Searches</h1>
      <v-row v-for="(catSearches, index) in popularSearches" :key="index">
        <v-col md="12">
          <h2>{{ catSearches.title }}</h2>
          <lazy-list-cards
            className="mt-4"
            :items="catSearches.stores"
            :maxItems="2"
            horizontal
          >
            <template #item="{ slotScope: store }">
               {{ store }}
              <store-card :store="store" class="store-card"></store-card>
            </template>
          </lazy-list-cards>
        </v-col>
      </v-row>
    </v-container>
  </div> -->
</template>

<script>
import LazyListCards from '@/components/LazyListCards.vue'

import { mapState } from 'vuex'

export default {
  components: { LazyListCards },
  computed: {
    ...mapState(['popularSearches']),
  },
  mounted() {
    this.$store.dispatch('getPopularSearches')
  },
}
</script>

<style lang="scss" scoped>
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
