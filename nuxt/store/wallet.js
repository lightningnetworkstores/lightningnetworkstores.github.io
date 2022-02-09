const WithdrawalState = {
  INITIAL: 0,
  PROCESSING: 1,
  SUCCESS: 2,
  FAILED: 3
}

export const state = () => ({
  invoice: null,
  withdrawal: {
    state: WithdrawalState.INITIAL,
    memo: '',
    errorMsg: null
  }
})

export const actions = {
  getInvoice({ commit }, value) {
    const body = { amount: value }
    this.$axios.post(`/api/deposit`, body)
      .then(res => res.data)
      .then(data => data.data)
      .then(data => commit('setInvoice', data.payment_request))
      .catch(console.error)
  },
  sendPayment({ commit }, invoice) {
    commit('setWithdrawalState', WithdrawalState.PROCESSING)
    const body = { fee: 10, payment_request: invoice }
    this.$axios.post('/api/withdraw', body)
      .then(res => res.data)
      .then(data => data.status === 'success')
      .then(success => {
        if (success) {
          commit('setWithdrawalState', WithdrawalState.SUCCESS)
          return WithdrawalState.SUCCESS
        } else {
          commit('setWithdrawalState', WithdrawalState.FAILED)
          return WithdrawalState.FAILED
        }
      })
      .catch(err => {
        console.error('Withdrawal error: ', err)
        commit('setWithdrawalState', WithdrawalState.FAILED)
        commit('setErrorMessage', err.response.data.message)
        return WithdrawalState.FAILED
      })
  },
  resetWithdrawalState({ commit }) {
    commit('setWithdrawalState', WithdrawalState.INITIAL)
    commit('setErrorMessage', null)
  }
}

export const mutations = {
  setInvoice(state, invoice) {
    state.invoice = invoice
  },
  setWithdrawalState(state, withdrawalState) {
    state.withdrawal.state = withdrawalState
  },
  setErrorMessage(state, errorMsg) {
    state.withdrawal.errorMsg = errorMsg
  }
}