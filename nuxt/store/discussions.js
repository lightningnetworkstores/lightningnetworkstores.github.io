export const state = () => ({
  lastDiscussions: []
})

export const actions = {
  getDiscussions({ commit }) {
    this.$axios.$get('/api/discussion')
      .then(data => data.data.last_discussions)
      .then(lastDiscussions => commit('setLastDiscussions', lastDiscussions))
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
  }
}

export const mutations = {
  setLastDiscussions(state, lastDiscussions) {
    state.lastDiscussions = lastDiscussions
  },
  updateLastDiscussions(state, { threadIndex, thread }) {
    state.lastDiscussions.splice(threadIndex, 1, thread)
  }
}