export const state = () => ({
  isAdmin: false,
  isLogged: false,
  lastDiscussions: [],
  reviews: [],
  events: [],
  topics: [],
  criminalRecord: null,
  error: null
})

export const actions = {
  addDiscussion(context, payload) {
    return this.$axios.$post(`/api/discussion?g-recaptcha-response=${payload.recaptchaToken}`, payload)
      .then(data => data.data)
  },
  addImage(context, file) {
    const headers = {
      'Content-Type': 'image/jpeg'
    }
    const data = file
    return this.$axios.$post(`/api/discussionimage`, data, { headers })
  },
  getDiscussions({ commit }) {
    this.$axios.$get('/api/discussion')
      .then(data => {
        commit('setTopics', data.data.configuration.topics)
        commit('setLastDiscussions', data.data.last_discussions)
        commit('setReviews', data.data.last_reviews)
        commit('setEvents', data.data.last_events)
      })
      .catch(err => console.error('Error fetching discussions: ', err))
  },
  postReply({ commit }, params) {
    const body = {
      comment: params.comment,
      parent: params.parent,
      sage: params.sage,
      recaptchaToken: params.recaptchaToken
    }
    const config = {
      params: {
        'g-recaptcha-response': body.recaptchaToken
      }
    }
    const { threadIndex } = params
    return this.$axios.$post('/api/discussion', body, config)
      .then(data => {
        if (data.data.submitted) {
          const { thread } = data.data
          commit('updateLastDiscussions', { threadIndex, thread })
        }
        return data
      })
  },
  setPendingPayment({ commit }, pendingPayment) {
    commit('setPendingPayment', pendingPayment)
  },
  checkPayment({ commit, dispatch }, paymentId) {
    return this.$axios.$get(`/api2/check_payment?id=${paymentId}`)
      .then(data => data.data.paid)
      .then(paid => {
        if (paid) {
          dispatch('getDiscussions')
        }
        return paid
      })
  },
  getLogStatus({ commit }) {
    this.$axios.$get('/api/logstatus')
      .then(data => commit('updateAdmin', data.data))
  },
  deleteComment({ commit, dispatch }, payload) {
    const deleteBody = {
      ban_reason: payload.reason,
      ban_days: payload.daysToBan,
      comments: payload.comments
    }
    return this.$axios.$delete('/api/comment', { data: deleteBody })
      .then(data => {
        dispatch('getDiscussions')
      })
      .catch(({ response }) => {
        if (response && response.data && response.data.message) {
          commit('setError', response.data.message)
        }
      })
  },
  clearError({ commit }) {
    commit('clearError')
  },
  getBanInfo({ commit }, commentId) {
    this.$axios.$get(`/api/baninfo?comment=${commentId}`)
      .then(data => {
        commit('setCriminalRecord', data.data.criminal_record)
      })
      .catch(err => console.error('Error while fetching ban info. err: ', err))
  },
  updateTopic({ commit }, { threadId, topic }) {
    return this.$axios.$put(`/api/discussion`, { id: threadId, topic: topic })
      .then(data => {
        if (data.status === 'success') {
          // TODO: Update discussion topic locally,
          // being lazy here since this is an admin tool
        }
        return data
      })
  },
  getImageUrl({ }, url) {
    return this.$axios.get(url)
      .then(res => {
        let isImage = null
        if (res.headers['content-type']) {
          isImage = res.headers['content-type'].split('/')[0] === 'image'
        }
        return isImage
      })
  },
  toggleHelpful({ dispatch, commit }, { id, helpful }) {
    commit('setHelpful', {reviewId: id, isHelpful: !helpful })
    return this.$axios.post(`/api/helpful?id=${id}&remove=${helpful}`)
      .catch(err => {
        console.error('Error while posting review. err: ', err)
        commit('setHelpful', {reviewId: id, isHelpful: helpful })
        dispatch('network/showError', err, { root: true})
      })
  },
  setHelpfulReviews({ commit }, helpfulReviews) {
    helpfulReviews.forEach(id => commit('setHelpful', {
      reviewId: id, isHelpful: true
    }))
  }
}

export const getters = {
  filteredDiscussions: (state) => (selectedTopic) => {
    if (selectedTopic === 'ALL') {
      return state.lastDiscussions
    }
    return state.lastDiscussions.filter(thread => thread[0].topic === selectedTopic)
  },
  topicsWithout: state => (topicToRemove) => {
    return state.topics.filter(topic => topic !== topicToRemove)
  }
}

export const mutations = {
  setLastDiscussions(state, lastDiscussions) {
    // Sorting discussions acording to their "bump" attribute
    const sortFunction = (a, b) => {
      if (a[0].bumped === b[0].bumped) return 0
      return a[0].bumped < b[0].bumped ? 1 : -1
    }
    state.lastDiscussions = lastDiscussions.sort(sortFunction)
  },
  updateLastDiscussions(state, { threadIndex, thread }) {
    state.lastDiscussions.splice(threadIndex, 1, thread)
  },
  setTopics(state, topics) {
    state.topics = topics
  },
  updateAdmin(state, data) {
    const { is_admin, user } = data;
    state.isAdmin = is_admin
    state.isLogged = user.logged;
  },

  setError(state, errorMessage) {
    state.error = errorMessage
  },
  clearError(state) {
    state.error = null
  },
  setCriminalRecord(state, criminalRecord) {
    state.criminalRecord = criminalRecord
  },
  setReviews(state, lastActiveStores) {
    // Extracting reviews and segregating them from
    // the store data
    const reviews = lastActiveStores.map(store => {
      let storeOnly = { ...store }
      delete storeOnly['reviews']
      return {
        store: store,
        reviews: store.reviews
      }
    })
    state.reviews = reviews
  },
  setEvents(state, lastEvents) {
    const events = lastEvents.map(store => {
      let storeOnly = { ...store }
      delete storeOnly['events']
      return {
        store: store,
        event: store.event
      }
    })
    state.events = events
  },
  setHelpful(state, {reviewId, isHelpful}) {
    const reviews = [...state.reviews]
    reviews.forEach(tuple => {
      tuple.reviews.forEach(review => {
        if (review.id === reviewId) {
          review.helpful = isHelpful
        }
      })
    })
    state.reviews = reviews
  }
}