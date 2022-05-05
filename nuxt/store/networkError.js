import { DEFAULT_ERROR_SNACKBAR_TIMEOUT } from '~/utils/constants'

export const state = () => ({
  errorMessage: null,
  timeout: DEFAULT_ERROR_SNACKBAR_TIMEOUT
})

export const actions = {
  showError({ commit }, error) {
    console.log(Object.keys(error))
    if (error.isAxiosError) {
      const { response } = error
      const timeout = error.timeout ? error.timeout : DEFAULT_ERROR_SNACKBAR_TIMEOUT
      const errorMessage = response && response.data ? response.data.message : 'Unknown server error'
      commit('setError', { errorMessage, timeout })
      setTimeout(() => {
        commit('resetError')
      }, timeout)
    }
  }
}

export const mutations = {
  setError(state, { errorMessage, timeout }) {
    state.errorMessage = errorMessage
    state.timeout = timeout
  },
  resetError(state) {
    state.errorMessage = null
    state.timeout = DEFAULT_ERROR_SNACKBAR_TIMEOUT
  }
}