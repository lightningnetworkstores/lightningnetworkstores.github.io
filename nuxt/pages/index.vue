<template>
  <div>
    <v-navigation-drawer
      clipped
      class="fixed-drawer"
      :permanent="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      :absolute="true"
      :inset="$vuetify.breakpoint.lgAndUp"
      width="300"
      disable-route-watcher
    >
      <v-list>
        <v-subheader class="title pb-2">Sort</v-subheader>
        <v-list-item class="my-0 pb-0 sort-items">
          <v-radio-group v-model="selectedSort">
            <v-radio
              v-for="sortItem in sortItems"
              :key="sortItem.prop"
              :label="sortItem.name"
              :value="sortItem.prop"
            ></v-radio>
          </v-radio-group>
        </v-list-item>
      </v-list>
      <filter-stores :filterTags="filtertags" />
    </v-navigation-drawer>
    <div :style="$vuetify.breakpoint.lgAndUp ? 'padding-left: 300px;' : ''">
      <v-layout justify-center>
        <v-flex xs10 md18 lg6 ma-5>
          <v-row>
            <v-col cols="11" xs="11" sm="11" md="11">
              <v-text-field
                v-model="searchQuery"
                class="search"
                flat
                outlined
                label="Type to search"
                solo
                prepend-inner-icon="mdi-magnify"
                hide-details
                :append-icon="$vuetify.breakpoint.lgAndUp ? '' : 'mdi-filter'"
                @click:append="toggleDrawer"
              ></v-text-field>
            </v-col>
            <v-col cols="1" xs="1" sm="1" md="1">
              <tutorial-modal></tutorial-modal>
            </v-col>
          </v-row>
        </v-flex>
      </v-layout>

      <v-container class="full-list">
        <store-card
          v-for="store in filteredStores.slice(0, maxCards)"
          :key="'store-' + store.id"
          :store="store"
        ></store-card>
      </v-container>
      <v-container fill-height v-if="isLoading">
        <v-layout row justify-center align-center>
          <v-progress-circular
            indeterminate
            :size="70"
            :width="7"
            color="#fdb919"
          ></v-progress-circular>
        </v-layout>
      </v-container>
      <v-container v-if="maxCards < filteredStores.length" class="py-10">
        <v-layout row justify-center align-center class="py-5">
          <v-btn color="primary" @click="loadMoreCards()">Load more</v-btn>
        </v-layout>
      </v-container>
    </div>
    <add-store-modal />
  </div>
</template>

<script>
import AddStoreModal from '~/components/AddStoreModal.vue'
import FilterStores from '~/components/FilterStores.vue'
import StoreCard from '../components/StoreCard.vue'
import { mapState } from 'vuex'

export default {
  components: { AddStoreModal, StoreCard, FilterStores },
  data() {
    return {
      addCardCount: 6,
      drawer: false,
      group: null,
      isLoading: false,
      maxCards: 18,
      safeMode: false,
      searchQuery: '',
      selectedSort: 'best',
      sortItems: [
        { name: 'Best', prop: 'best' },
        { name: 'Trending', prop: 'trending' },
        { name: 'Newest', prop: 'newest' },
        { name: 'Lifetime score', prop: 'lifetime' },
        { name: 'Controversial', prop: 'controversial' },
        { name: 'Last commented', prop: 'lastcommented' },
      ],
      tagsCheckbox: [],
    }
  },

  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    loadMoreCards() {
      this.maxCards += this.addCardCount
    },
    handleScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        this.loadMoreCards()
      }
    },
    storeWithScore(store) {
      let score = this.$store.getters.getScore(store)
      return Object.assign({}, this.store, score)
    },
    changeUrl() {
      const query = {}

      if (this.selectedTags.filter((x) => x).length) {
        query.tags = this.selectedTags.filter((x) => x).join(',')
      }

      if (this.excludedTags.length) {
        query.exclude = this.excludedTags.join(',')
      }
      if (this.selectedSort && this.selectedSort != 'best') {
        query.sort = encodeURIComponent(this.selectedSort)
      }
      if (this.searchQuery.length) {
        query.search = encodeURIComponent(this.searchQuery)
      }
      if (this.safeMode) {
        query.safemode = this.safeMode ? this.safeMode.toString() : 'false'
      }
      this.$router.push({
        query: query,
      })
    },
  },
  computed: {
    ...mapState([
      'filteredTags',
      'selectedTags',
      'excludedTags',
      'baseURL',
      'stores',
      'scores',
    ]),

    filteredStores() {
      const stores = this.$store.getters.getStores(
        { sector: this.sector, digitalGoods: this.digitalGoods },
        this.selectedSort,
        this.searchQuery,
        this.safeMode
      )
      return stores
        .filter((store) => {
          return this.selectedTags.every((tag) => store.tags.includes(tag))
        })
        .filter((store) => {
          return !this.excludedTags.some((tag) => store.tags.includes(tag))
        })
    },

    filtertags() {
      const data = this.filteredStores
        .reduce((acc, currentStore) => {
          currentStore.tags.forEach((tag) => {
            const index = acc.findIndex((_tag) => {
              return _tag.name === tag
            })

            if (index > -1) {
              acc[index].quantity += 1
            } else {
              acc.push({ name: tag, quantity: 1 })
            }
          })

          return acc
        }, [])
        .sort(
          ({ quantity: quantity1 }, { quantity: quantity2 }) =>
            quantity2 - quantity1
        )

      if (this.excludedTags.length) {
        const excludeTags = this.excludedTags.map((tag) => {
          return { name: tag, quantity: 0 }
        })

        data.unshift(...excludeTags)
      }

      if (this.selectedTags.length) {
        const selectedTags = this.selectedTags
          .filter((tag) => !data.some((_tag) => _tag.name === tag))
          .map((tag) => ({ name: tag, quantity: 0 }))

        data.unshift(...selectedTags)
      }

      return data
    },
  },
  watch: {
    selectedSort() {
      this.changeUrl()
    },
    searchQuery() {
      this.changeUrl()
    },
    excludedTags() {
      this.changeUrl()
    },
    selectedTags() {
      this.changeUrl()
    },
  },
  async asyncData({ store, route }) {
    await store.dispatch('getStores')
    return await store.dispatch('processRoute', route)
  },
  beforeMount() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
}
</script>

<style lang="scss">
.tag {
  margin-top: -22px !important;
  height: 25px;
  display: block;
}
.search > .v-input__control > .v-input__slot {
  border-radius: 30px !important;
}
.search.v-text-field--enclosed > .v-input__control > .v-input__slot {
  background-color: white !important;
}
.v-text-field--outline.v-text-field--single-line input {
  margin-bottom: 12px;
}
.v-input__icon--append > .v-icon {
  font-size: 30px !important;
}
.full-list {
  width: 100%;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 2em;
}
.detail {
  color: #000000de;
  display: grid;
  grid-template-rows: 200px 150px;
  grid-template-columns: 80px 1fr;
  row-gap: 4px;

  .screenshot {
    grid-column: 1 / 3;
  }
  .score {
    display: grid;
    grid: 1fr;
    justify-items: center;
    padding: 5px;
    font-size: 15px !important;

    span {
      display: block;
    }
    .arrow {
      border: 1px solid;
      border-radius: 50%;
      padding: 5px;

      &.up:hover {
        background-color: rgba(76, 175, 80, 0.12);
      }
      &.down:hover {
        background-color: rgba(255, 82, 82, 0.12);
      }
    }
  }
  .content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    .title {
      font-size: 1.7rem !important;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      a {
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
    .description {
      font-size: 14px !important;
      margin-top: 5px;
    }
    .tag-container {
      position: absolute;
      bottom: 8px;
      padding-right: 40px;
      background-color: white;
    }
    .btn-actions {
      display: flex;
      gap: 8px;
      position: absolute;
      bottom: 5px;
      right: 5px;
      font-size: 14px !important;
      .v-icon {
        margin-top: -4px;
      }
      .likes .v-icon:hover {
        color: #f44336;
      }
      &.sm-btn-actions {
        font-size: 24px !important;
        .v-icon {
          font-size: 24px !important;
        }
      }
    }
  }
}
.sort-items {
  height: 160px;
}
.fixed-drawer {
  position: fixed !important;
  padding-top: 64px;
}
.v-toolbar__content,
.v-toolbar {
  height: 64px !important;
}

.v-navigation-drawer {
  .v-navigation-drawer__content {
    .v-list {
      .tag {
        background: #ffffff !important;
        .v-input--selection-controls__ripple {
          z-index: 1;
        }
      }
    }
  }
}

.tag-search-block {
  .v-input__slot {
    padding: 0px 30px !important;
    fieldset {
      border: 0px;
      border-bottom: 1px solid #ccc;
      border-radius: 0px;
      margin-left: 20px;
      margin-right: 30px;
    }
  }
}

.search-icon {
  position: absolute;
  top: 0px;
}
.indeterminate {
  .v-icon.theme--light {
    color: #f34444;
  }
}
</style>
