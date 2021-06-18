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
  confirmStoreFieldRemoval(state, { field }) {
    Vue.delete(state.selectedStore.external, field)
  },
  confirmStoreFieldAddition(state, { field, value }) {
    Vue.set(state.selectedStore.external, field, {href: value});
  },
  updateSocialLink(state, { name, href }) {
    if (state.selectedStore[name]) {
      state.selectedStore[name] = {href}
    } else {
      Vue.set(state.selectedStore.social, name, {href});
    }
  },
  removeSocialLink(state, { name }) {
    Vue.delete(state.selectedStore.social, name)
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
  updateLikedStores(state, { storeId, remove }) {
    state.likedStores = {...state.likedStores, [`${storeId}`]: remove ? false : true}
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
    if (state.store) {
      state.store.likes += delta
    }
  },
  setStoreLikes(state, likes) {
    state.likedStores = likes
  },
  logout(state) {
    state.selectedStore.logged = false
  }
}

export default mutations
