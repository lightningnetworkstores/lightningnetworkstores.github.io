const mutations = {
  setIsDev(state, data) {
    if (data) {
      state.isDev = true
      state.baseURL = "https://lightningnetworkstores.com/"
      //   state.baseURL = "https://lightningnetworkstores.com:8443/"
      state.replyReviewFee = 2;
    } else {
      state.isDev = false
      state.baseURL = "https://lightningnetworkstores.com/"
      state.replyReviewFee = 500;
    }
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
  },
  setSelectedTags(state, selectedTags) {
    state.selectedTags = selectedTags;
  },
}

export default mutations;
