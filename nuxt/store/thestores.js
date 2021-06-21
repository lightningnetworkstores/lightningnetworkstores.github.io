const mutations = {}

const actions = {
  getStores({ state, commit }) {
    return fetch(`${state.baseURL}stores`)
      .then((response) => {
        commit('setStores', response.data.data.stores)
        response.data.data.configuration.tags.sort()

        commit('setConfiguration', response.data.data.configuration)

        return response.json()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
}

export default {
  actions,
  mutations,
}
