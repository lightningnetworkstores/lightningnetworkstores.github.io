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
                <div
                  v-for="sortItem in sortItems.slice(0, 3)"
                  :key="sortItem.prop"
                  class="d-flex align-start"
                >
                    <v-radio
                      :key="sortItem.prop"
                      :label="sortItem.name"
                      :value="sortItem.prop"
                      class="mb-2"
                      >
                          <template v-slot:label>
                              <div>{{ sortItem.name }}</div>
                          </template>
                      </v-radio>
                      <v-icon 
                          small 
                          v-if="['custom'].includes(sortItem.prop)" 
                          class="ml-6 mt-1"
                          @click="openCustomModal()"
                      >fas fa-edit</v-icon>
                </div>
              <!-- <v-radio
                v-for="sortItem in sortItems.slice(0, 3)"
                :key="sortItem.prop"
                :label="sortItem.name"
                :value="sortItem.prop"
              /> -->
  
              <div v-if="sortItems.slice(3).length">
                <v-list-group
                  no-action
                  sub-group
                  class="sort-items-more"
                  :ripple="false"
                  color="gray"
                >
                  <template v-slot:activator>
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="pa-0">More</v-list-item-title>
                    </v-list-item-content>
                  </template>
  
                  <v-list-item
                    v-for="sortItem in sortItems.slice(3)"
                    :key="sortItem.prop"
                    class="pa-0 my-0"
                  >
                    <v-radio
                      :key="sortItem.prop"
                      :label="sortItem.name"
                      :value="sortItem.prop"
                    />
                  </v-list-item>
                </v-list-group>
              </div>
            </v-radio-group>
          </v-list-item>
        </v-list>
        <filter-stores :filterTags="filtertags" />
      </v-navigation-drawer>
      <div
        style="padding-bottom: 40px"
        :style="$vuetify.breakpoint.lgAndUp ? 'padding-left: 300px;' : ''"
      >
        <v-layout justify-center>
          <v-flex xs10 md18 lg6 ma-5>
            <v-row>
              <v-col cols="11" xs="11" sm="11" md="11">
                <search-input
                  :isLoading="searchLoading"
                  v-model="searchQuery"
                  @click="toggleDrawer"
                />
              </v-col>
              <v-col cols="1" xs="1" sm="1" md="1">
                <tutorial-modal></tutorial-modal>
              </v-col>
            </v-row>
          </v-flex>
        </v-layout>
  
        <div v-if="sectionFilteredStores">
          <div v-if="maxCardsNewsest > 0" class="container full-list d-flex align-self-center">
              <h1>Newest</h1>
              <v-btn v-if="btnOptionActive.newest" class="mt-2" small color="#fcb919" @click="loadMoreCardsNewest()">Load more</v-btn>
          </div>
          <v-container v-if="maxCardsNewsest > 0" class="full-list" ref="list">
              <!-- <pre>{{ filteredStores.slice(0, maxCards) }}</pre> -->
              <store-card
                :data-storeId="store.id"
                v-for="store in filteredStoresNewest.slice(0, maxCountOfCards(maxCardsNewsest, !btnOptionActive.newest))"
                :key="'store-' + store.id"
                :store="store"
              ></store-card>
          </v-container>
          <div v-if="maxCardsTrending > 0" class="container full-list d-flex align-self-center">
              <h1>Trending</h1>
              <v-btn v-if="btnOptionActive.trending" class="mt-2" small color="#fcb919" @click="loadMoreCardsTrending()">Load more</v-btn>
          </div>
          <v-container v-if="maxCardsTrending > 0" class="full-list" ref="list">
              <!-- <pre>{{ filteredStores.slice(0, maxCards) }}</pre> --> 
              <store-card
                :data-storeId="store.id"
                v-for="store in filteredStoresTrending.slice(0, maxCountOfCards(maxCardsTrending, !btnOptionActive.trending))"
                :key="'store-' + store.id"
                :store="store"
              ></store-card>
          </v-container>
        </div>
        <h1 class="container full-list">Explore</h1>
        <v-container class="full-list" ref="list">
          <!-- <pre>{{ filteredStores.slice(0, maxCards) }}</pre> -->
          <store-card
            :data-storeId="store.id"
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
      <sorting-custom-modal :isOpen.sync="isOpenDialogSorting" />
    </div>
  </template>
  
  <script>
  import AddStoreModal from '~/components/AddStoreModal.vue'
  import FilterStores from '~/components/FilterStores.vue'
  import StoreCard from '~/components/StoreCard.vue'
  import { mapState, mapGetters } from 'vuex'
  import SearchInput from '~/components/SearchInput.vue'
  import SortingCustomModal from '~/components/SortingCustomModal.vue'
  import { actions } from '~/store/discussions'
  
  export default {
    components: { AddStoreModal, StoreCard, FilterStores, SearchInput, SortingCustomModal },
    data() {
      return {
        addCardCount: 6,
        addCardCountNewest: 2,
        addCardCountTrending: 2,
        cardCountSection: 3,
        drawer: false,
        group: null,
        isLoading: false,
        maxCards: 18,
        maxCardsNewsest: 1,
        maxCardsTrending: 1,
        safeMode: false,
        searchLoading: false,
        searchQuery: '',
        selectedSort: 'best',
        sortItems: [
          { name: 'Best', prop: 'best' },
          { name: 'Custom', prop: 'custom' },
          { name: 'Trending', prop: 'trending' },
          { name: 'Newest', prop: 'newest' },
          { name: 'Likes', prop: 'likes' },
          { name: 'Lifetime score', prop: 'lifetime' },
          { name: 'Controversial', prop: 'controversial' },
          { name: 'Last commented', prop: 'lastcommented' },
        ],
        tagsCheckbox: [],
        isOpenDialogSorting: false,
        btnOptionActive: {
            newest: true,
            trending: true
        },
      }
    },
  
    methods: {
      toggleDrawer() {
        this.drawer = !this.drawer
      },
      loadMoreCardsNewest() {
        this.btnOptionActive.newest = false
      },
      loadMoreCardsTrending() {
        this.btnOptionActive.trending = false
      },
      loadMoreCards() {
        this.maxCards += this.addCardCount
        this.$store.dispatch('setScrolledStores', this.maxCards)
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
      openCustomModal () {
          this.selectedSort = "custom"
          this.isOpenDialogSorting = true;
      },
      /**
       * 
       * @param {number} value 
       * @return {number}
       */
      maxCountOfCards (value, option = false) {

        let values = (option) ? value : ((value <= this.countCardPoint) ? value : this.countCardPoint)
        
        return values
      }
    },
    computed: {
      ...mapState({
        activeStoreDiscussions: 'activeStoreDiscussions',
        baseURL: 'baseURL',
        excludedTags: 'excludedTags',
        filterByFavorites: 'filterByFavorites',
        filteredTags: 'filteredTags',
        lastCommentSeenTimestamp: 'lastCommentSeenTimestamp',
        lastDiscussions: 'lastDiscussions',
        likedStores: 'likedStores',
        scores: 'scores',
        scrolledStores: 'scrolledStores',
        selectedTags: 'selectedTags',
        stores: 'stores',
        settingCustomSorting: 'settingCustomSorting',
        sliderCustomSorting: 'sliderCustomSorting',
        customSortingAdvanced: 'customSortingAdvanced',

        widthPoint() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return 390
                case 'sm': return 800
                case 'md': return 800
                case 'lg': return 1280
                case 'xl': return 1780
                case 'xxl': return 1905
            }
        },

        countCardPoint () {
            return parseInt((this.widthPoint / 369))
        },
        
        sectionFilteredStores () {        
          let tagsLength = this.selectedTags.filter((x) => x).length;
  
          return ['best', 'custom'].includes(this.selectedSort) && this.searchQuery == '' && tagsLength == 0
        },
        filteredStoresNewest() {
          const getStores = this.getStores(
            { sector: this.sector, digitalGoods: this.digitalGoods },
            "newest",
            this.searchQuery,
            this.safeMode,
            "newest"
          )
          
          return getStores
        },
        
        filteredStoresTrending() {
          const getStores = this.getCustomTrending(
            "trending",
            this.selectedSort
          )
  
          return getStores
        },
  
        filteredStores(state) {
          const getStores = this.getStores(
            { sector: this.sector, digitalGoods: this.digitalGoods },
            this.selectedSort,
            this.searchQuery,
            this.safeMode
          )
  
          const stores = state.filterByFavorites
            ? getStores.filter((store) => !!state.likedStores[store.id])
            : getStores
  
          return stores
            .filter((store) => {
              return state.selectedTags.every((tag) => store.tags.includes(tag))
            })
            .filter((store) => {
              return !state.excludedTags.some((tag) => store.tags.includes(tag))
            })
        },
      }),
  
      ...mapGetters(['getStores', 'getCustomTrending']),
  
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
      settingCustomSorting(newValue, oldValue) {
        console.log({newValue})
          this.maxCardsNewsest = newValue.newontop
          this.maxCardsTrending = newValue.newontop     
          
          this.btnOptionActive.newest = true
          this.btnOptionActive.trending = true
          // ------------------
      },
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
      $route(to, from) {
        if (
          Object.keys(to.query).length === 0 &&
          Object.keys(from.query).length !== 0
        ) {
          this.$store.dispatch('processRoute', to)
  
          this.safeMode = false
          this.selectedSort = 'best'
          this.searchQuery = ''
        }
      },
    },
    async asyncData({ store, route, redirect }) {
      await store.dispatch('getLoginStatus')
      await store.dispatch('getStores')
      const { safeMode, selectedSort, searchQuery } = await store.dispatch(
        'processRoute',
        route
      )
  
      const setting = await store.getters.getSettingCustomSorting

      console.log({
        a: route.query,
        query: Object.entries(route.query),
        queryValue: (Object.entries(route.query).length === 0),
        setting
      })
      
      console.log("redirect: ", {
            path: "/",
            query: {
                sort: "custom"
            }
        });
      if ((Object.entries(route.query).length === 0) && setting.default) {
        console.log("entro en el redirect")
        // route.push('/erwin')
        // debugger;
          redirect({
              path: "/",
              query: {
                  sort: "custom"
              }
          })
          return { safeMode, selectedSort: 'custom', searchQuery }
      }
  
      return { safeMode, selectedSort, searchQuery }
    },
    beforeMount() {
        window.addEventListener('scroll', this.handleScroll)
        if (this.scrolledStores) {
            this.$route.meta.scrolledStores = this.maxCards
            this.maxCards = this.scrolledStores
        }
    },
    beforeRouteEnter(to, from, next) {
      if (to.query.sector) {
        to.query.tags = to.query.sector
        delete to.query.sector
        return next(to)
      }
      next()
    },
    mounted() {
      this.$recaptcha.init()

      let maxTop = this.customSortingAdvanced.find((d) => d.id=="newontop")

      this.maxCardsNewsest = maxTop.value ?? 0;
      this.maxCardsTrending = maxTop.value ?? 0;
  
      this.searchLoading = true
      this.$store.dispatch('getRestStores').finally(() => {
        this.searchLoading = false
  
        const data = Array.from(this.$refs.list.children)
  
        const store = data.find(
          (store) => Number(store.dataset.storeid) === this.$route.meta.storeId
        )
  
        if (store) {
          setTimeout(
            () => window.scrollTo({ top: store.offsetTop, behavior: 'smooth' }),
            50
          )
        }
      })
      this.$recaptcha.init()
      setInterval(() => this.$recaptcha.init(), 2 * 60 * 1000)
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
  .sort-items {
    .v-input--selection-controls {
      margin-top: 0;
    }
    .v-messages {
      display: none;
    }
    .v-input__slot {
      margin-bottom: 0;
    }
  }
  .sort-items-more {
    .v-list-group__header {
      padding: 0 !important;
    }
    .v-list-item {
      min-height: 36px;
    }
  
    .v-list-item::before {
      background: none;
    }
  
    .v-list-group__header__prepend-icon {
      margin-top: 4px !important;
      margin-bottom: 4px !important;
    }
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
  
  .sort-title {
    height: 14px;
  }
  </style>
  