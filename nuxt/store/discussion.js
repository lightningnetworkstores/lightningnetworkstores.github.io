export const state = () => ({
  selected: null
})

export const actions = {
  getDiscussion({ commit, dispatch }, id) {
    return this.$axios.$get(`/api/discussion?id=${id}`)
      .then(body => commit('setDiscussion', body.data.discussions))
      .catch(err => dispatch('networkError/showError', err, { root: true }))
  },
  updateDiscussion({ commit }, thread) {
    commit('updateDiscussion', thread)
  }
} 

export const mutations = {
  setDiscussion(state, discussion) {
    state.selected = discussion
  },
  updateDiscussion(state, thread) {
    const discussion = [...thread]
    state.selected = discussion
  }
}