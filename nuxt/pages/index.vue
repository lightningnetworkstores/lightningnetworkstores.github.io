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
        <!-- <v-text-field   hide-details  single-line class="pt-0 tag-search-block mt-3 mb-3">Search</v-text-field> -->
        <v-text-field
          class="search tag-search-block p-10"
          v-model="tagSearchQuery"
          flat
          outlined
          label="Type to search"
          solo
          prepend-inner-icon="mdi-magnify"
          hide-details
        ></v-text-field>
        <br />
        <br />
        <v-list-item
          v-for="(tag, index) in tags"
          :key="tag"
          class="my-0 py-0 tag"
        >
          <v-checkbox
            hide-details
            @change="selectDeselectTag(tag, index)"
            class="tag"
            color="#fdb919"
            :indeterminate="excludeTag[index].status"
            :class="{'indeterminate':excludeTag[index].status}"
            :value="tag"
            :label="tag + ' ' + storeCountByTag(tag)"
            v-model="tagsCheckbox"
            @update:indeterminate="updateExclude(tag, index)"
          ></v-checkbox>
          <!-- v-model="checkedTags[index]"" -->
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div :style="$vuetify.breakpoint.lgAndUp ? 'padding-left: 300px;' : ''">
      <v-layout justify-center>
        <v-flex xs10 md18 lg6 ma-5>
          <v-row>
            <v-col cols="11" xs="11" sm="11" md="11">
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
            </v-col>
            <v-col cols="1" xs="1" sm="1" md="1">
              <tutorial-modal></tutorial-modal>
            </v-col>
          </v-row>
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
      tagSearchQuery: '',
      maxCards: 18,
      addCardCount: 6,
      checkedTags: [],
      excludedTag: [],
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

      tagsCheckbox: [],
    }
  },
  methods: {
    updateExclude(value, i) {
      console.log('updateExclude')
      /*this.excludedTag.push(value);
    let index = this.checkedTags.indexOf(value);
    if (index !== -1) {
      this.checkedTags.splice(index, 1);
    } else {
      this.checkedTags.push(value);
    }*/
    },
    selectDeselectTag(value, i) {
      console.log('selectDeselectTag')

      let index = this.checkedTags.indexOf(value)
      if (index !== -1) {
        this.checkedTags.splice(index, 1)
      } else {
        this.checkedTags.push(value)
      }

      //  console.log(this.tagsCheckbox, 'lll',this.tagsCheckbox.includes(value));
      if (!this.tagsCheckbox.includes(value)) {
        if (this.excludeTag[i].status) {
          this.excludeTag[i].status = false
        } else {
          this.excludeTag[i].status = true
          this.excludedTag.push(value)
        }

        //this.excludeTag[i].status = false
        this.checkedTags.splice(index, 1)
      } else {
        if (this.excludedTag.includes(value)) {
          let index1 = this.tagsCheckbox.indexOf(value)
          this.tagsCheckbox.splice(index1, 1)
          let index2 = this.excludedTag.indexOf(value)
          this.excludedTag.splice(index2, 1)
          this.excludeTag[i].status = false
          let index = this.checkedTags.indexOf(value)
          if (index !== -1) {
            this.checkedTags.splice(index, 1)
          }
        }
      }
      this.$store.commit(
        'setSelectedTags',
        this.checkedTags.filter((t) => t)
      )
      this.$store.commit(
        'setExludedTags',
        this.excludedTag.filter((t) => t)
      )
      this.changeUrl()
    },

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

      if (this.excludedTag.filter((x) => x).length) {
        query.exclude = this.excludedTag.filter((x) => x).join(',')
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
          this.tagsCheckbox.push(tag)
          this.checkedTags[this.tags.indexOf(tag)] = tag
        }

        this.$store.commit('setSelectedTags', routeTags)
      }

      if (this.$route.query.exclude) {
        const routeexcludedTags = this.$route.query.exclude
          .split(',')
          .map((x) => decodeURI(x))

        for (const tag of routeexcludedTags) {
          this.excludedTag.push(tag)
        }
        this.$store.commit('setExludedTags', routeexcludedTags)
      }
    },
    tagFilterBySearch() {
      console.log(this.tagSearchQuery)
      if (this.tagSearchQuery) {
        console.log('lll')
        this.tags = this.tags.filter((item) => {
          return this.tagSearchQuery
            .toLowerCase()
            .split(' ')
            .every((v) => item.toLowerCase().includes(v))
        })
      } else {
        return this.tags
      }
    },
    storeCountByTag(tag) {
      let count = 0
      this.stores.forEach((item) => {
        if (item.tags.includes(tag)) {
          count++
        }
      })

      return count
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
      let tags = this.$store.state.tags
      if (this.tagSearchQuery) {
        return tags.filter((tag) => {
          return tag.toLowerCase().includes(this.tagSearchQuery.toLowerCase())
        })
      }

      return tags
      /*  let filteredtags = tags.filter((tag) => {
        return tag.toLowerCase().includes(this.tagSearchQuery.toLowerCase())
      })
      return filteredtags */
    },
    excludeTag() {
      const excude = []
      this.tags.forEach((e, i) => {
        if (this.excludedTag.includes(e)) {
          this.excludedTag.includes(e)
          console.log(this.excludedTag, e)
          excude.push({ status: true })
        } else {
          excude.push({ status: false })
        }
      })
      return excude
    },
    selectedTags() {
      return this.$store.state.selectedTags
    },
    getStores() {
      let filtersStore = this.selectedTags.filter((x) => x !== null).length
        ? this.$store.getters
            .getStores(
              { sector: this.sector, digitalGoods: this.digitalGoods },
              this.selectedSort,
              this.searchQuery,
              this.safeMode
            )
            .filter((x) => {
              if (!this.tagSearchQuery) {
                if (!this.tags.length) return true
              }

              return (
                x.tags.filter((y) => {
                  return this.checkedTags.includes(y)
                }).length == this.selectedTags.length
              )
              //console.log(this.excludedTag)

              // return (
              //   x.tags.filter((y) => {
              //     const tagIndex = this.tags.indexOf(y)
              //     return this.checkedTags[tagIndex]
              //   }).length == this.selectedTags.length
              // )
            })
        : this.$store.getters.getStores(
            { sector: this.sector, digitalGoods: this.digitalGoods },
            this.selectedSort,
            this.searchQuery,
            this.safeMode
          )

      if (this.excludedTag.length > 0) {
        filtersStore = filtersStore.filter((x) => {
          return !x.tags.some((item) => this.excludedTag.includes(item))
        })
      }

      return filtersStore
    },
  },
  watch: {
    // checkedTags() {
    //   this.$store.commit(
    //     'setSelectedTags',
    //     this.checkedTags.filter((t) => t)
    //   )
    //   this.changeUrl();
    // },
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
.indeterminate{
  .v-icon.theme--light{
    color: #f34444;
  }
}
</style>
