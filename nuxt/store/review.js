export const state = () => ({
  isPosting: false
})

export const actions = {
  postReview({ commit }, { stars, comment, storeID }) {
    commit('setIsPosting', true)
    const body = { storeID, comment, stars }
    return this.$axios.post('/api/review', body)
      .then(data => {
        console.log('data: ', data)
      })
      .catch(err => console.error('Error while posting review. err: ', err))
      .finally(() => commit('setIsPosting', false))
  }
}

export const mutations = {
  setIsPosting(state, isPosting) {
    state.isPosting = isPosting
  }
}