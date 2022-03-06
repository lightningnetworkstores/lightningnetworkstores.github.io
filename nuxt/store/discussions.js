export const state = () => ({
  isAdmin: false,
  lastDiscussions: [],
  topics: [],
  error: null
})

export const actions = {
  getDiscussions({ commit }) {
    this.$axios.$get('/api/discussion')
      .then(data => {
        commit('setTopics', data.data.configuration.topics)
        commit('setLastDiscussions', data.data.last_discussions)
      })
      .catch(err => console.error('Error fetching discussions: ', err))
  },
  postReply({ commit }, params) {
    const body = {
      comment: params.comment,
      parent: params.parent,
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
      .then(data => commit('updateAdmin', data.data.is_admin))
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
  }
}

export const getters = {
  filteredDiscussions: (state) => (selectedTopic) => {
    if (selectedTopic === 'ALL') {
      return state.lastDiscussions
    }
    return state.lastDiscussions.filter(thread => thread[0].topic === selectedTopic)
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
  updateAdmin(state, isAdmin) {
    state.isAdmin = isAdmin
  },
  setError(state, errorMessage) {
    state.error = errorMessage
  },
  clearError(state) {
    state.error = null
  }
}