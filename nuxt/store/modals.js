export const state = () => ({
  isSettingsModalOpen: false,
})

export const mutations = {
  toggleSettingsModal(state) {
    state.isSettingsModalOpen = !state.isSettingsModalOpen
  },
  openSettingsModal(state) {
    state.isSettingsModalOpen = true
  },
  closeSettingsModal(state) {
    state.isSettingsModalOpen = false
  },
}

export const actions = {
  toggleSettingsModal({ commit }) {
    commit('toggleSettingsModal')
  },
  openSettingsModal({ commit }) {
    commit('openSettingsModal')
  },
  closeSettingsModal({ commit }) {
    commit('closeSettingsModal')
  },
}
