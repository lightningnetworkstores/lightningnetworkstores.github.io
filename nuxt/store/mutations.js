import Vue from 'vue'

const mutations = {
  setIsDev(state, data) {
    state.isDev = true
    state.baseURL = process.env.BASE_URL
  },
  setLoading(state, data) {
    state.loading = data
  },
  setStores(state, stores) {
    state.stores = stores
  },
  setSelectedStore(state, store) {
    store.reviews.sort((a, b) => {
      if (Math.abs(b.score) !== Math.abs(a.score)) {
        return Math.abs(b.score) - Math.abs(a.score)
      }
      return b.timestamp - a.timestamp
    })
    store.logged = false
    state.selectedStore = store
  },
  setScores(state, scores) {
    state.scores = scores
  },
  setConfiguration(state, configuration) {
    state.configuration = configuration
    state.tags = configuration.tags
    if (process.env.NODE_ENV != 'development') {
      state.replyReviewFee = configuration.minimum_comment
      state.addStoreFee = configuration.listing_fee
    }
  },
  updateSelectedStore(state, { key, value }) {
    state.selectedStore[key] = value
  },
  confirmStoreFieldRemoval(state, { field }) {
    Vue.delete(state.selectedStore.external, field)
  },
  confirmStoreFieldAddition(state, { field, value }) {
    Vue.set(state.selectedStore.external, field, { href: value })
  },
  updateSocialLink(state, { name, href }) {
    if (state.selectedStore[name]) {
      state.selectedStore[name] = { href }
    } else {
      Vue.set(state.selectedStore.social, name, { href })
    }
  },
  removeSocialLink(state, { name }) {
    Vue.delete(state.selectedStore.social, name)
  },
  updateSocialLink(state, { name, href }) {
    if (state.selectedStore[name]) {
      state.selectedStore[name] = { href }
    } else {
      Vue.set(state.selectedStore.social, name, { href })
    }
  },
  removeSocialLink(state, { name }) {
    Vue.delete(state.selectedStore.social, name)
  },
  addStoreMedia(state, { homepage, link, type, position }) {
    const media = { link: link, type: type, homepage: homepage }
    state.selectedStore.media.main.splice(position, 1, media)
    state.selectedStore.media.number++
  },
  removeStoreMedia(state, { position }) {
    state.selectedStore.media.main.splice(position, 1)
  },
  updateStoreHomeImage(state, { position }) {
    // Disabling previous home
    const currentIndex = state.selectedStore.media.main.findIndex(item => item.homepage)
    const currentHome = state.selectedStore.media.main.find(item => item.homepage)
    Vue.set(state.selectedStore.media.main, currentIndex, {...currentHome, homepage: false})
    // Enabling new home image
    const newHome = state.selectedStore.media.main[position]
    Vue.set(state.selectedStore.media.main, position, {...newHome, homepage: true})
  },
  setSelectedTags(state, selectedTags) {
    state.selectedTags = selectedTags
  },
  setExcludedTags(state, selectedTags) {
    state.excludedTags = selectedTags
  },
  setWallets(state, wallets) {
    state.wallets = wallets
  },
  setDiscussions(state, discussions) {
    state.activeStoreDiscussions = discussions.last_active_stores
    state.lastDiscussions = discussions.last_discussions
  },
  setFaucetStats(state, faucetStats) {
    state.faucetStats = faucetStats
  },
  updateLikedStores(state, { storeId, remove }) {
    state.likedStores = {
      ...state.likedStores,
      [`${storeId}`]: remove ? false : true,
    }
  },
  setLikeCounter(state, { storeId, remove }) {
    const delta = remove ? -1 : 1
    if (state.stores.length > 0) {
      const storeIndex = state.stores.findIndex((store) => store.id === storeId)
      if (storeIndex !== -1) {
        const store = state.stores[storeIndex]
        store.likes += delta
        state.stores[storeIndex] = store
      }
    }
    if (state.selectedStore) {
      state.selectedStore.likes += delta
    }
  },
  setStoreLikes(state, likes) {
    state.likedStores = likes
  },
  logout(state) {
    state.selectedStore.logged = false
  },
  setFilteredTags(state, filteredTags) {
    state.filteredTags = filteredTags
  },
  updateExcludedTag(state, { tag, remove = false }) {
    if (remove) {
      const index = state.excludedTags.indexOf(tag)
      if (index > -1) {
        state.excludedTags.splice(index, 1)
      }
    } else {
      state.excludedTags.push(tag)
    }
  },
  updateSelectedTag(state, { tag, remove = false }) {
    if (remove) {
      const index = state.selectedTags.indexOf(tag)
      if (index > -1) {
        state.selectedTags.splice(index, 1)
      }
    } else {
      state.selectedTags.push(tag)
    }
  },
  updateFilteredStores(state, stores) {
    state.filteredStores = stores
  },
  updateFilterFavoriteStores(state, flag) {
    state.filterByFavorites = flag
  },
  updateScrolledStores(state, number) {
    state.scrolledStores = number
  },
  updateAnnouncements(state, announcements) {
    state.announcements = announcements
  },
}

export default mutations
