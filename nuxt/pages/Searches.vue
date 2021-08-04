<template>
  <div>
    <v-container class="pa-6" fluid>
      <h1 class="text-center">Popular Searches</h1>
      <v-row v-for="(categorySearches, index) in popularSearches" :key="index">
        <v-col md="12" v-if="categorySearches.stores.length > 0">
          <nuxt-link
            :to="{ name: 'index', query: { tags: categorySearches.tag } }"
            class="title-link d-flex"
          >
            <h2 class="text-md-h4">{{ categorySearches.title }}</h2>
            <v-icon color="gray" class="ml-1" small
              >fa-external-link-alt</v-icon
            >
          </nuxt-link>
          <v-slide-group
            class="py-4 slide-group"
            active-class="success"
            show-arrows
          >
            <v-slide-item
              v-for="(store, index) in categorySearches.stores"
              :key="index"
            >
              <div class="store-card my-4">
                <store-card :store="store" />
              </div>
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
  head() {
    return {
      title: 'Popular searches | LightningNetworkStores',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Popular tag searches at LightningNetworkStores.com',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Popular searches | LightningNetworkStores',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Popular tag searches at LightningNetworkStores.com',
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: 'Popular searches | LightningNetworkStores',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: 'Popular tag searches at LightningNetworkStores.com',
        },
      ],
    }
  },
  computed: {
    ...mapState(['popularSearches']),
  },
  mounted() {
    this.$store.dispatch('getPopularSearches')
  },
}
</script>

<style lang="scss" scoped>
.title-link {
  color: black;
  text-decoration: none;
}

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
