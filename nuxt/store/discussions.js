export const state = () => ({
  lastDiscussions: []
})

export const actions = {
  getDiscussions({ commit }) {
    this.$axios.$get('/api/discussion')
      .then(data => data.data.last_discussions)
      .then(lastDiscussions => commit('setLastDiscussions', lastDiscussions))
      .catch(err => console.error('Error fetching discussions: ', err))
  }
}

export const mutations = {
  setLastDiscussions(state, lastDiscussions) {
    state.lastDiscussions = lastDiscussions
  }
}