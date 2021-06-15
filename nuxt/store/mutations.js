const mutations = {
  setIsDev(state, data) {
    state.isDev = true
    state.baseURL = 'https://bitcoin-stores.com/'
    //   state.baseURL = "https://lightningnetworkstores.com:8443/"
  },
  setLoading(state, data) {
    state.loading = data
  },
  setStores(state, stores) {
    state.stores = stores
  },
  setStore(state, store) {
    store.reviews.sort((a, b) => {
      if (Math.abs(b.score) !== Math.abs(a.score)) {
        return Math.abs(b.score) - Math.abs(a.score)
      }
      return b.timestamp - a.timestamp
    })
    state.store = store
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
  setSelectedStore(state, selectedStore) {
    state.selectedStore = selectedStore
  },
  updateSelectedStore(state, { key, value }) {
    state.selectedStore[key] = value
  },
  setSelectedTags(state, selectedTags) {
    state.selectedTags = selectedTags
  },
  setExludedTags(state, selectedTags) {
    state.excludedTags = selectedTags
  },
  setWallets(state, wallets) {
    state.wallets = wallets
  },
  setDiscussions(state, discussions) {
    state.discussions = discussions
  },
  setFaucetStats(state, faucetStats) {
    state.faucetStats = faucetStats
  },
  setLikeInStore(state, { storeId, remove }) {
    const storeIndex = state.stores.findIndex((store) => store.id === storeId)
    if (storeIndex !== -1) {
      const store = state.stores[storeIndex]
      const delta = remove ? -1 : 1
      store.likes += delta
      state.stores[storeIndex] = store
    }
    state.likedStores[storeId] = remove ? false : true
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
      state.excludedTags.pop(tag)
    } else {
      state.excludedTags.push(tag)
    }
  },
  updateSelectedTag(state, { tag, remove = false }) {
    if (remove) {
      state.selectedTags.pop(tag)
    } else {
      state.selectedTags.push(tag)
    }
  },
  updateFilteredStores(state, stores) {
    state.filteredStores = stores
  },
}

export default mutations
