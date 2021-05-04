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
        <v-card
          hover
          v-for="store in getStores.slice(0, maxCards)"
          :key="'store-' + store.id"
          @click.native="gotoStore(store.id)"
        >
          <v-card-text class="pa-0">
            <div class="detail">
              <div class="screenshot">
                <v-img
                  :aspect-ratio="4 / 3"
                  max-height="200px"
                  :src="`${baseURL}thumbnails/${store.id}.jpg`"
                  class="text-right"
                  @click.native="gotoStore(store.id)"
                >
                  <v-chip
                    v-if="isNewStore(store)"
                    color="green"
                    text-color="white"
                    class="ma-2"
                    >New</v-chip
                  >
                  <v-chip
                    v-if="store.trending >= 10"
                    color="purple"
                    text-color="white"
                    class="ma-2"
                    >Trending</v-chip
                  >
                  <v-chip
                    v-if="store.rank !== 'unranked'"
                    color="#fdb919"
                    text-color="white"
                    class="ma-2"
                    >#{{ store.rank }}</v-chip
                  >
                </v-img>
              </div>
              <div class="score">
                <vote-button :isUpvoting="true" :store="store" />
                <span> {{ store.upvotes }}</span>
                <vote-button :isUpvoting="false" :store="store" />
              </div>
              <div class="content pa-2 pl-5">
                <div class="title">
                  <a :href="store.href" class="font-weight-regular">
                    {{ store.name }}
                    <v-icon class="ml-1" color="blue darken-2"
                      >mdi-open-in-new</v-icon
                    >
                  </a>
                </div>
                <div class="description">
                  {{ store.description }}
                </div>
                <div>
                  <div class="tag-container">
                    <v-chip
                      v-for="(tag, index) in store.tags.slice(0, 5)"
                      :key="index"
                      color="primary"
                      outlined
                      small
                      class="mr-2 my-1"
                    >
                      <b>{{ tag }}</b>
                    </v-chip>
                  </div>
                  <div class="comments" v-if="store.total_comments">
                    <v-icon small>fa-comment</v-icon> {{ store.total_comments }}
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
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
import VoteButton from '../components/VoteButton.vue'
export default {
  components: { AddStoreModal, VoteButton },
  data() {
    return {
      drawer: false,
      group: null,
      isLoading: false,
      searchQuery: '',
      maxCards: 15,
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
    gotoStore(store_id) {
      this.$router.push('/store/' + store_id)
    },
    isNewStore(store) {
      return new Date(store.added * 1000 + 1000 * 60 * 60 * 24 * 8) > new Date()
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
    await this.$store.dispatch('getScores')
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
  margin-top: -22px;
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
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2em;
}
.detail {
  color: #000000de;
  display: grid;
  grid-template-rows: 200px 150px;
  grid-template-columns: 60px 1fr;
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
    .title {
      font-size: 1.7rem !important;

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
      bottom: 7px;
      padding-right: 40px;
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
</style>
