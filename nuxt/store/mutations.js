const mutations = {
  setIsDev(state, data) {
    state.isDev = true
    state.baseURL = "/api/" // Proxy redirect to url set in nuxt.config.js
    // state.baseURL = "https://bitcoin-stores.com/"
    //   state.baseURL = "https://lightningnetworkstores.com:8443/"
  },
  setLoading(state, data) {
    state.loading = data
  },
  setStores(state, stores) {
    state.stores = stores;
  },
  setScores(state, scores) {
    state.scores = scores;
  },
  setConfiguration(state, configuration) {
    state.configuration = configuration;
    state.tags = configuration.tags;
    if (process.env.NODE_ENV != "development") {
      state.replyReviewFee = configuration.minimum_comment
      state.addStoreFee = configuration.listing_fee
    }
  },
  setSelectedTags(state, selectedTags) {
    state.selectedTags = selectedTags;
  },
  setWallets(state, wallets) {
    state.wallets = wallets;
  },
  setDiscussions(state, discussions) {
    state.discussions = discussions;
  }
}

export default mutations;
