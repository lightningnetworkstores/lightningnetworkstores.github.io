import Vue from 'vue'

const mutations = {
  setIsDev(state, data) {
    state.isDev = true
    state.baseURL = process.env.baseUrl
  },
  setLoading(state, data) {
    state.loading = data
  },
  setStores(state, stores) {
    state.stores = stores
  },
  setStorePages(state, storePages) {
    state.storePages = storePages
  },
  setSelectedStore(state, store) {
    store.reviews2.sort((a, b) => {
      if (b[0].likes !== a[0].likes) {
        return b[0].likes - a[0].likes
      }
      return b[0].timestamp - a[0].timestamp
    })
    store.logged = false
    state.selectedStore = store
  },
  setScores(state, scores) {
    state.scores = scores
  },
  setConfiguration(state, configuration) {
    state.configuration = configuration
    if (configuration.tags) state.tags = configuration.tags
  },
  updateSelectedStore(state, { key, value }) {
    if (state.selectedStore[key]) {
      state.selectedStore[key] = value
    } else {
      Vue.set(state.selectedStore, key, value)
    }
  },
  confirmStoreFieldRemoval(state, { field }) {
    Vue.delete(state.selectedStore.external, field)
  },
  confirmStoreFieldAddition(state, { field, value }) {
    Vue.set(state.selectedStore.external, field, { href: value })
  },
  toggleEditing(state) {
    state.editingSelectedStore = !state.editingSelectedStore
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
    const currentIndex = state.selectedStore.media.main.findIndex(
      (item) => item.homepage
    )
    const currentHome = state.selectedStore.media.main.find(
      (item) => item.homepage
    )
    Vue.set(state.selectedStore.media.main, currentIndex, {
      ...currentHome,
      homepage: false,
    })
    // Enabling new home image
    const newHome = state.selectedStore.media.main[position]
    Vue.set(state.selectedStore.media.main, position, {
      ...newHome,
      homepage: true,
    })
  },
  setSelectedTags(state, selectedTags) {
    state.selectedTags = selectedTags
  },
  setExcludedTags(state, selectedTags) {
    state.excludedTags = selectedTags
  },
  setExternallyTrending(state, trending) {
    state.externallyTrending = trending
  },
  setWallets(state, wallets) {
    state.wallets = wallets
  },
  setDiscussions(state, discussions) {
    state.activeStoreDiscussions = discussions.last_active_stores
    state.lastDiscussions = discussions.last_discussions
    state.storeEvents = discussions.last_events
  },
  setFaucetStats(state, faucetStats) {
    state.faucetStats = faucetStats
  },
  setStatistics(state, statistics) {
    state.statistics = statistics
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
  updateAnnouncements(state, payload) {
    state.announcements = payload
  },
  updateStoreSummary(state, summary) {
    state.storeSummary = summary
  },
  selectedStoreSettings(state, settings) {
    state.selectedStoreSettings = settings
  },
  updateFirstTime(state) {
    state.selectedStoreSettings.isFirstTime = false
  },
  updateFaucetDonors(state, faucetDonors) {
    Vue.set(state, 'faucetDonors', faucetDonors)
  },
  updatePopularSearches(state, searches) {
    state.popularSearches = searches
  },
  updateStores(state, stores) {
    stores.forEach((store) => {
      const index = state.stores.findIndex((s) => s.id === store.id)
      if (index === -1) {
        // Pushing missing store
        state.stores.push(store)
      } else {
        // Replacing existing store
        state.stores.splice(index, 1, store)
      }
    })
  },
  setDeviceFingerprint(state, deviceFingerprint) {
    state.deviceFingerprint = deviceFingerprint
  },
  setBrowserFingerprint(state, browserFingerprint) {
    state.browserFingerprint = browserFingerprint
  },
  setDeviceResolution(state, deviceResolution) {
    state.deviceResolution = deviceResolution
  },
  updateLastCommentSeenTimestamp(state, lastCommentSeenTimestamp) {
    state.lastCommentSeenTimestamp = lastCommentSeenTimestamp
  },
  updateLastActivity(state, time) {
    state.lastActivity = time
  },

  updateLoginStatus(state, status) {
    state.loginStatus = status
  },
  updateBalance(state, delta) {
    const { loginStatus } = state
    if (!loginStatus) return
    const { balance } = loginStatus
    if (!balance) return
    if (balance + delta < 0) return
    state.loginStatus.balance = balance + delta
  },
  cleanStoreContest(state) {
    state.storeContest = {}
  },
  setStoreContest(state, payload) {
    state.storeContest = { ...payload }
  },
  setNameStoreContest(state, payload) {
    state.nameStoreContest = payload
  },
  setQuizContest(state, payload) {
    state.quizContest = { ...payload }
  },
  setNameQuizContest(state, payload) {
    state.nameQuizContest = payload
  },
  setAddObjQuizContest(state, payload) {
    state.quizContest.user_bets = [
      ...state.quizContest.user_bets,
      { ...payload },
    ]

    const sum = state.quizContest.user_bets.reduce(
      (prev, curr) => prev + curr.wager,
      0
    )

    state.quizContest.contest.pot = sum
  },
  setAddObjStoreContest(state, payload) {
    state.storeContest.user_bets = [
      ...state.storeContest.user_bets,
      { ...payload },
    ]

    const sum = state.storeContest.user_bets.reduce(
      (prev, curr) => prev + curr.wager,
      0
    )

    state.storeContest.contest.pot = sum
  },
  updateSettingCustomSorting(state, payload) {
    state.settingCustomSorting = payload
  },
  updateSliderCustomSorting(state, payload) {
    const { value, idp, id } = payload

    if (idp == 'advanced') {
      state.customSortingAdvanced.forEach((_, j) => {
        if (state.customSortingAdvanced[j].id == id) {
          state.customSortingAdvanced[j].value = value
        }
      })
      return
    }

    state.sliderCustomSorting.forEach((_, i) => {
      if (state.sliderCustomSorting[i].id == idp) {
        state.sliderCustomSorting[i].slide.forEach((_, j) => {
          if (state.sliderCustomSorting[i].slide[j].id == id) {
            state.sliderCustomSorting[i].slide[j].value = value
          }
        })
      }
    })
  },
  updateSliderGroup(state, payload) {
    state.sliderCustomSorting = payload
  },
  updateSliderAdvanced(state, payload) {
    state.customSortingAdvanced = payload
  },
  setBuilders(state, payload) {
    state.builderStore = payload
  },
  setContributions(state, contributions) {
    state.contributions = contributions
  },
  setBuildersProjects(state, builders) {
    state.buildersProjects = builders
  },
}

export default mutations
