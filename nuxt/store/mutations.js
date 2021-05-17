const mutations = {
  setIsDev(state, data) {
    state.isDev = true
    state.baseURL = "http://localhost:8080/"
    //   state.baseURL = "https://lightningnetworkstores.com:8443/"
    state.replyReviewFee = 2;
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
