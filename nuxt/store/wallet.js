export const state = () => ({
  invoice: null
})

export const actions = {
  getInvoice({ commit }, value) {
    const body = { amount: value }
    console.log('body: ', body)
    this.$axios.post(`/api/deposit`, body)
      .then(res => res.data)
      .then(data => data.data)
      .then(data => commit('setInvoice', data.payment_request))
      .catch(console.error)
  }
}

export const mutations = {
  setInvoice(state, invoice) {
    state.invoice = invoice
  }
}