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
  setSelectedTags(state, selectedTags) {
    state.selectedTags = selectedTags
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
      store.likes = remove ? (store.likes -= 1) : (store.likes += 1)
      state.stores[storeIndex] = store
    }

    if (state.store.id === storeId) {
      const likes = remove ? (state.store.likes -= 1) : (state.store.likes += 1)
      state.store.likes = likes
    }
  },
  setStoreLikes(state, likes) {
    state.likedStores = likes
  },
  pushToStoreLike(state, storeId) {
    state.likedStores.push(storeId)
  },
  popToStoreLike(state, storeId) {
    state.likedStores.pop(storeId)
  },
}

export default mutations
