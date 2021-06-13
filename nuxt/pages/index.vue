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
      <v-list>
        <v-subheader class="title pb-2">Filter</v-subheader>
        <v-list-item
          v-for="(tag, index) in tags"
          :key="tag"
          class="my-0 py-0 tag"
        >
          <v-checkbox
            hide-details
            class="tag"
            color="#fdb919"
            :value="tag"
            :label="tag"
            v-model="checkedTags[index]"
          ></v-checkbox>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div :style="$vuetify.breakpoint.lgAndUp ? 'padding-left: 300px;' : ''">
      <v-layout justify-center>
        <v-flex xs10 md18 lg6 ma-5>
          <!-- <v-card>
                    <v-toolbar card color="rgb(56, 56, 56)" dark dense
                        ><v-text-field v-model="searchQuery" hide-details prepend-icon="search" single-line class="pt-0"></v-text-field><v-spacer></v-spacer><tutorial-modal></tutorial-modal
                    ></v-toolbar>
                    <v-layout row style="padding: 20px 20px 14px 20px;" wrap>
                        <v-flex grow pa-1><v-select v-model="selectedSort" item-text="name" item-value="prop" label="Sort" :items="sortItems" return-object></v-select></v-flex>
                        <v-flex grow pa-1><v-select v-model="selectedSector" item-text="name" item-value="prop" label="Sector" :items="sectorItems" return-object></v-select></v-flex>
                        <v-flex grow pa-1><v-select v-model="selectedDigitalGood" item-text="name" item-value="prop" label="Digital goods" :items="digitalGoodItems" return-object></v-select></v-flex>
                    </v-layout>
                </v-card> -->

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
        </v-flex>
      </v-layout>

      <v-container class="full-list">
        <store-card
          v-for="store in getStores.slice(0, maxCards)"
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
      <v-container v-if="maxCards < getStores.length" class="py-10">
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
import StoreCard from '../components/StoreCard.vue'
export default {
  components: { AddStoreModal, StoreCard },
  data() {
    return {
      drawer: false,
      group: null,
      isLoading: false,
      searchQuery: '',
      maxCards: 18,
      addCardCount: 6,
      checkedTags: [],
      selectedSort: 'best',
      safeMode: false,
      sortItems: [
        { name: 'Best', prop: 'best' },
        { name: 'Trending', prop: 'trending' },
        { name: 'Newest', prop: 'newest' },
        { name: 'Lifetime score', prop: 'lifetime' },
        { name: 'Controversial', prop: 'controversial' },
        { name: 'Last commented', prop: 'lastcommented' },
      ],
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
      let query = {}
      if (this.checkedTags.filter((x) => x).length) {
        query.tags = this.checkedTags.filter((x) => x).join(',')
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
    setFromRoute() {
      if (this.$route.query.safemode) {
        this.safeMode = this.$route.query.safemode
      }
      if (this.$route.query.sort) {
        this.selectedSort = this.$route.query.sort
      }
      if (this.$route.query.search) {
        this.searchQuery = this.$route.query.search
      }
      if (this.$route.query.tags) {
        const routeTags = this.$route.query.tags
          .split(',')
          .map((x) => decodeURI(x))

        for (const tag of routeTags) {
          this.checkedTags[this.tags.indexOf(tag)] = tag
        }

        this.$store.commit('setSelectedTags', routeTags)
      }
    },
  },
  computed: {
    baseURL() {
      return this.$store.state.baseURL
    },
    stores() {
      return this.$store.state.stores
    },
    scores() {
      return this.$store.state.scores
    },
    tags() {
      return this.$store.state.tags
    },
    selectedTags() {
      return this.$store.state.selectedTags
    },
    getStores() {
      return this.selectedTags.filter((x) => x !== null).length
        ? this.$store.getters
            .getStores(
              { sector: this.sector, digitalGoods: this.digitalGoods },
              this.selectedSort,
              this.searchQuery,
              this.safeMode
            )
            .filter((x) => {
              if (!this.tags.length) return true
              return (
                x.tags.filter((y) => {
                  const tagIndex = this.tags.indexOf(y)
                  return this.checkedTags[tagIndex]
                }).length == this.selectedTags.length
              )
            })
        : this.$store.getters.getStores(
            { sector: this.sector, digitalGoods: this.digitalGoods },
            this.selectedSort,
            this.searchQuery,
            this.safeMode
          )
    },
  },
  watch: {
    checkedTags() {
      this.$store.commit(
        'setSelectedTags',
        this.checkedTags.filter((t) => t)
      )
      this.changeUrl()
    },
    selectedSort() {
      this.changeUrl()
    },
    searchQuery() {
      this.changeUrl()
    },
  },
  async mounted() {
    this.$store.commit('setLoading', true)
    await this.$store.dispatch('getStores')
    this.setFromRoute()
    this.$store.commit('setLoading', false)
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
    .comments {
      position: absolute;
      bottom: 5px;
      right: 5px;
      font-size: 14px !important;
      .v-icon {
        margin-top: -4px;
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
</style>
