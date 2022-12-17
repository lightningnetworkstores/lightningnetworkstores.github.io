export const state = () => ({
  isPosting: false,
  reviews: []
})

export const actions = {
  postReview(context, { stars, comment, storeID, parent }) {
    const { commit, dispatch } = context
    const body = { storeID, comment, stars, parent }
    commit('setIsPosting', true)
    return this.$axios.post('/api/review', body)
      .then(resp => dispatch('network/showResponse', resp, { root: true }))
      .catch(err => {
        console.error('Error while posting review. err: ', err)
        dispatch('network/showError', err, { root: true})
      })
      .finally(() => commit('setIsPosting', false))
  },
  toggleHelpful({ dispatch, commit }, review) {
    console.log('toggleHelpful.review: ', review)
    const { id, helpful } = review
    commit('setHelpful', {reviewId: id, isHelpful: !helpful })
    return this.$axios.post(`/api/helpful?id=${id}&remove=${helpful}`)
      // .then(resp => dispatch('network/showResponse', resp, { root: true }))
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

export const mutations = {
  setIsPosting(state, isPosting) {
    state.isPosting = isPosting
  },
  setReviews(state, reviews) {
    state.reviews = reviews
  },
  setHelpful(state, {reviewId, isHelpful}) {
    const reviews = [...state.reviews]
    reviews.forEach(r => {
      if (r[0].id === reviewId) {
        r[0].helpful = isHelpful
      }
    })
    state.reviews = reviews
  }
}