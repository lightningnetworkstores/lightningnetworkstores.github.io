export const state = () => ({
  contacts: []
})

export const actions = {
  set({ commit }, addressBook) {
    commit('set', addressBook.contacts)
  },
  add({ commit, dispatch, state }, newContact) {
    commit('add', newContact)
    const body = {
      contacts: state.contacts
    }
    console.log('body: ', body)
    this.$axios.post('/api/addressbook', body)
      .then(resp => dispatch('network/showResponse', resp, { root: true }))
      .catch(err => dispatch('network/showError', err, { root: true}))
  }
}

export const mutations = {
  set(state, contacts) {
    state.contacts = contacts
  },
  add(state, newContact) {
    const updatedContacts = [...state.contacts]
    updatedContacts.push(newContact)
    state.contacts = updatedContacts
  }
}