import { DEFAULT_ERROR_SNACKBAR_TIMEOUT } from '~/utils/constants'

export const state = () => ({
  successMessage: null,
  errorMessage: null,
  timeout: DEFAULT_ERROR_SNACKBAR_TIMEOUT
})

export const actions = {
  showError({ commit }, error) {
    if (error.isAxiosError) {
      const { response } = error
      const timeout = error.timeout ? error.timeout : DEFAULT_ERROR_SNACKBAR_TIMEOUT
      const errorMessage = response && response.data ? response.data.message : 'Unknown server error'
      commit('setError', { errorMessage, timeout })
      setTimeout(() => {
        commit('resetError')
      }, timeout)
    }
  },
  showResponse({ commit }, resp) {
    if (resp.status === 200 || resp.status === 201) {
      const { data } = resp
      const { status, message } = data
      const timeout = DEFAULT_ERROR_SNACKBAR_TIMEOUT
      commit('setSuccess', {
        successMessage: message ? message : status,
        timeout: timeout
      })
      setTimeout(() => {
        commit('resetSuccess')
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
  },
  setSuccess(state, { successMessage }) {
    state.successMessage = successMessage
  },
  resetSuccess(state) {
    state.successMessage = null
  }
}