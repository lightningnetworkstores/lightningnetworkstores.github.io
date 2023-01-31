export const WithdrawalState = {
  INITIAL: 0,
  PROCESSING: 1,
  SUCCESS: 2,
  FAILED: 3
}

export const WithdrawalType = {
  LIGHTNING_ADDRESS: 0,
  BOLT11_INVOICE: 1
}

export const state = () => ({
  deposit: {
    id: null,
    invoice: null
  },
  profile: null,
  balance: { available: 0, pending_deposits: 0, pending_withdrawals: 0, unsettled_bets: 0, pending_contributor_reward: 0 },
  withdrawal: {
    state: WithdrawalState.INITIAL,
    memo: ''
  },
  affiliate: { pending: 0 },
  contributorProgram: null,
  transfers: []
})

export const actions = {
  getDashboardInfo({ commit, state, dispatch }) {
    this.$axios.get('/api/dashboardinfo')
      .then(res => res.data)
      .then(data => data.data)
      .then(({ balance, transfers, profile, affiliate, contributor_program, address_book }) => {
        commit('setBalance', balance)
        commit('setTransfers', transfers)
        commit('setProfile', profile)
        commit('setAffiliate', affiliate)
        commit('setContributorProgram', contributor_program)
        dispatch('contacts/set', address_book, { root: true })
      })
      .then(() => this.$axios.get('/api/logstatus'))
      .then(res => res.data.data.user)
      .then(user => {
        const twitterID = user.id
        const updatedProfile = Object.assign({}, state.profile)
        updatedProfile.twitterID = twitterID
        commit('setProfile', updatedProfile)
      })
  },
  async getInvoice({ commit }, value) {
    const body = { amount: value }
    try {
      const resp = await this.$axios.post('/api/deposit', body)
      const { payment_request, id } = resp.data.data
      commit('setInvoice', payment_request)
      commit('setPaymentId', id)
      commit('updatePendingBalance', value)
      return payment_request
    } catch (err) {
      console.error('Error while trying to fetch invoice. err: ', err)
    }
  },
  cancelInvoice({ commit }) {
    commit('setInvoice', null)
    commit('setPaymentId', null)
  },
  async sendPayment({ commit, dispatch }, { type, invoice, address, amount, comment = '', feeAmount }) {
    commit('setWithdrawalState', WithdrawalState.PROCESSING)
    let url
    let body
    if (type === WithdrawalType.LIGHTNING_ADDRESS) {
      url = '/api/lnurlwithdraw'
      body = { fee: feeAmount, address, amount, comment }
    } else if (type === WithdrawalType.BOLT11_INVOICE) {
      url = '/api/withdraw'
      body = { fee: feeAmount, payment_request: invoice }
    }
    try {
      const resp = await this.$axios.post(url, body)
      if (resp.data.status === 'success') {
        commit('setWithdrawalState', WithdrawalState.SUCCESS)
        if (type === WithdrawalType.LIGHTNING_ADDRESS) {
          dispatch('updateBalance')
        }
        return {
          state: WithdrawalState.PROCESSING,
          withdrawalID: resp.data.data.withdrawalID
        }
      } else {
        commit('setWithdrawalState', WithdrawalState.FAILED)
        return { state: WithdrawalState.FAILED, message: err.response.data.message }
      }
    } catch (err) {
      console.error('Withdrawal error: ', err)
      commit('setWithdrawalState', WithdrawalState.FAILED)
      dispatch('network/showError', err, { root: true})
      return { state: WithdrawalState.FAILED, message: err.response.data.message }
    }
  },
  resetWithdrawalState({ commit }) {
    commit('setWithdrawalState', WithdrawalState.INITIAL)
  },
  async checkDeposit({ commit, state }) {
    try {
      const { id } = state.deposit
      const resp = await this.$axios.get(`/api2/check_payment?id=${id}`)
      const isPaid = resp.data.data.paid
      if (isPaid) {
        commit('setInvoice', null)
      }
      return isPaid
    } catch (err) {
      console.error('Error while polling for deposit state. err: ', err)
    }
  },
  async transfer(context, payload) {
    try {
      const res = await this.$axios.post('/api/transfer', payload)
      return res.data.status === 'success'
    } catch (err) {
      console.error('Error while performing internal transfer. Err: ', err)
    }
    return false
  },
  async checkWithdrawal(context, withdrawalID) {
    try {
      console.log('checking withdrawal with id: ', withdrawalID)
      const res = await this.$axios.get(`/api/check_withdrawal?id=${withdrawalID}`)
      const { data } = res
      return data && data.data && data.data.paid
    } catch (err) {
      console.error('Error trying to check on withdrawal. err: ', err)
    }
  },
  async getBalance({ commit }) {
    this.$axios.$get('/api/logstatus')
      .then(data => {
        const {
          data: { balance }
        } = data
        commit('setAvailableBalance', balance)
      })
  },
  async updateBalance({ commit }) {
    this.$axios.$get('/api/balance')
      .then(data => data.data.balance)
      .then(balance => commit('setBalance', balance))
  }
}

export const mutations = {
  updatePendingBalance(state, pending) {
    state.balance.pending_deposits = +pending
  },
  setBalance(state, balance) {
    state.balance = balance
  },
  setAvailableBalance(state, availableBalance) {
    state.balance.available = availableBalance
  },
  setTransfers(state, transfers) {
    state.transfers = transfers
  },
  setProfile(state, profile) {
    state.profile = profile
  },
  setAffiliate(state, affiliate) {
    state.affiliate = affiliate
  },
  setContributorProgram(state, contributorProgram) {
    state.contributorProgram = contributorProgram
  },
  setInvoice(state, invoice) {
    state.deposit.invoice = invoice
  },
  setPaymentId(state, id) {
    state.deposit.id = id
  },
  setWithdrawalState(state, withdrawalState) {
    state.withdrawal.state = withdrawalState
  }
}