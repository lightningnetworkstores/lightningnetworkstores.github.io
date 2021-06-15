require('dotenv').config()
const axios = require('axios')

const actions = {
  async nuxtServerInit({ commit }) {
    process.env.NODE_ENV == 'development'
      ? this.commit('setIsDev', true)
      : this.commit('setIsDev', false)
  },
  getDonations({ state }) {
    return fetch(`${state.baseURL}donationAdresses.json`)
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },

  getStores({ state, commit }) {
    return axios
      .get(`${state.baseURL}api/stores`)
      .then((response) => {
        commit('setStores', response.data.data.stores)
        commit('setConfiguration', response.data.data.configuration)

        return response.data.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  getStore({ state, commit }, data) {
    return fetch(`${state.baseURL}api/storeinfo?id=` + data.id)
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        commit('setConfiguration', response.configuration)
        commit('setSelectedStore', response)
        return response
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  addStore(
    { state },
    {
      name: name,
      description: description,
      url: url,
      uri: uri,
      sector: sector,
      digitalGoods: digitalGoods,
      contributor: contributor,
      recaptcha: recaptcha,
    }
  ) {
    // return fetch(
    //     `${state.baseURL}api/addStore?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&URL=${encodeURIComponent(url)}&URI=${encodeURIComponent(
    //             uri
    //         )}&sector=${encodeURIComponent(sector)}&digitalGoods=${encodeURIComponent(digitalGoods)}&contributor=${contributor}&g-recaptcha-response=${recaptcha}`
    //   )
    //   .then((response) => {
    //     return response.text();
    //   })
    //   .catch((error) => {
    //     return Promise.reject(error);
    //   });

    // Post version
    let params = {
      name: encodeURIComponent(name),
      description: encodeURIComponent(description),
      URL: encodeURIComponent(url),
      URI: encodeURIComponent(uri),
      contributor: contributor,
      'g-recaptcha-response': recaptcha,
    }

    return fetch(`${state.baseURL}api/addStore`, {
      method: 'POST',
      body: JSON.stringify(params),
    })
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },

  addStoreUpdate({ state, commit }, { id: id, body: body }) {
    const debugPwd = null //process.env.debugPwd;
    const url = `${state.baseURL}api/field?id=${id}${
      debugPwd ? '&pwd=' + debugPwd : ''
    }`

    return axios
      .put(url, JSON.stringify(body))
      .then((response) => {
        Object.keys(response.data.data).forEach((attr) => {
          if (response.data.data[attr]) {
            const payload = { key: attr, value: body[attr] }
            commit('updateSelectedStore', payload)
          } else {
            console.log(`${attr} -> not modified!`)
          }
        })
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  suggestBan({ state }, { id: id, name: name, message: message }) {
    return fetch(
      `${state.baseURL}api/suggestBan?id=${id}&name=${encodeURIComponent(
        name
      )}&message=${encodeURIComponent(message)}`
    )
      .then((response) => {
        return response.text()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  getStoreVotePaymentRequest(
    { state },
    { id, amount, isUpvote, comment, parent }
  ) {
    return fetch(
      `${
        state.baseURL
      }api/get_invoice?amount=${amount}&storeID=${id}&direction=${
        isUpvote ? 'Upvote' : 'Downvote'
      }${comment ? '&comment=' + comment : ''}${
        parent ? '&parent=' + parent : ''
      }`
    )
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  checkPayment({ state }, { id: id }) {
    return fetch(`${state.baseURL}api2/check_payment?id=${id}`)
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  suggestTags({ state }, { storeId, tags }) {
    const object = {
      taginfo: {
        storeID: storeId,
        add: tags,
      },
    }
    return fetch(`${state.baseURL}api/tag`, {
      method: 'POST',
      body: JSON.stringify(object),
    })
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  suggestTag({ state }, { storeId, tag }) {
    const object = {
      taginfo: {
        storeID: storeId,
        add: [tag],
      },
    }
    return fetch(`${state.baseURL}api/tag`, {
      method: 'POST',
      body: JSON.stringify(object),
    })
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  setStore({ commit }, store) {
    commit(`setStore`, store)
  },
  removeTag({ state }, { storeId: storeId, tag: tag }) {
    const object = {
      taginfo: {
        storeID: storeId,
        remove: [tag],
      },
    }
    return fetch(`${state.baseURL}api/tag`, {
      method: 'POST',
      body: JSON.stringify(object),
    })
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  getWallets({ state, commit }) {
    return axios
      .get(`${state.baseURL}wallets.json`)
      .then((response) => {
        commit('setWallets', response.data)
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  getDiscussions({ state, commit }) {
    return axios
      .get(`${state.baseURL}api/discussion`)
      .then((response) => {
        if (response.status === 200) {
          const { data } = response
          commit('setDiscussions', data.data.last_active_stores)
        }
      })
      .catch(console.error)
  },
  donateFaucetsRequest({ state, commit }, { data }) {
    return axios
      .post(`${state.baseURL}api/faucet_donation`)
      .then((response) => {
        if (response.status === 200) {
          return response
        }
      })
      .catch(console.error)
  },
  faucetClaim({ state, commit }, { token: token }) {
    return axios
      .get(`${state.baseURL}api/lnurl1?h-captcha-response=${token}`)
      .then((response) => {
        if (response.status === 200) {
          return response
        }
      })
      .catch(console.error)
  },
  getFaucetStats({ state, commit }) {
    return axios
      .get(`${state.baseURL}api/faucetstats`)
      .then((response) => {
        commit('setFaucetStats', response.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  },
  likeStore({ state, commit }, { storeId, remove }) {
    const lsKey = `lns_likes`
    let likedStores = JSON.parse(localStorage.getItem(lsKey)) ?? {}

    return axios({
      method: 'post',
      url: `${state.baseURL}api/like?storeID=${storeId}&remove=${remove}`,
    }).then((res) => {
      if (res.status !== `fail`) {
        const likes = res.data.data.likes
        likedStores[storeId] = remove ? false : true
        localStorage.setItem(lsKey, JSON.stringify(likedStores))
        commit('setLikeInStore', { storeId, remove })
      }
    })
  },
  login({ state }, { token, recipient, storeId }) {
    const body = {
      recipient: recipient,
      storeID: storeId,
      'h-captcha-response': token,
    }
    return axios
      .post(`${state.baseURL}api/loginattempt`, body)
      .then((response) => {
        if (response.status === 200) {
          return response.data
        }
      })
      .catch(console.error)
  },
  getStatus({ state, commit }, { storeId }) {
    return axios
      .get(`${state.baseURL}api/logstatus?id=${storeId}`)
      .then((response) => {
        if (response.status === 200) {
          const payload = { key: 'logged', value: response.data.data.logged }
          commit('updateSelectedStore', payload)
        }
      })
      .catch(console.error)
  },
  logout({ state, commit }) {
    return axios
      .get(`${state.baseURL}api/logout`)
      .then((response) => {
        if (response.status === 200) {
          commit('logout')
          return response.data
        }
      })
      .catch(console.error)
  },
  updateStoreLikes({ commit }) {
    const storeLikes = JSON.parse(localStorage.getItem('lns_likes')) ?? {}
    commit('setStoreLikes', storeLikes)
  },
  setSelectedTags({ state, commit }, { selectedTags, excludedTags }) {
    commit('setSelectedTags', selectedTags)
    commit('setExludedTags', excludedTags)

    const filterExcludedStores = state.stores.filter(
      (store) => !excludedTags.some((tag) => store.tags.includes(tag))
    )

    const filteredStoresTags = filterExcludedStores
      .filter((store) => selectedTags.some((tag) => store.tags.includes(tag)))
      .flatMap((store) => store.tags)

    const uniqueTags = [...new Set(filteredStoresTags)]
    commit('setFilteredTags', uniqueTags)
  },

  setSelectedTag2({ state, commit }, { tag }) {
    if (
      !state.selectedTags.includes(tag) &&
      !state.excludedTags.includes(tag)
    ) {
      commit('updateSelectedTag', { tag, remove: false })
    } else if (state.selectedTags.includes(tag)) {
      commit('updateSelectedTag', { tag, remove: true })
      commit('updateExcludedTag', { tag, remove: false })
    } else if (state.excludedTags.includes(tag)) {
      commit('updateExcludedTag', { tag, remove: true })
    }
  },

  setFilteredTags({ state, commit }) {
    /* const filterExcludedStores = state.stores.filter(
      (store) => !state.excludedTags.some((tag) => store.tags.includes(tag))
    ) */

    const filteredStoresTags = state.stores
      .filter((store) =>
        state.selectedTags.some((tag) => store.tags.includes(tag))
      )
      .flatMap((store) => store.tags)

    const uniqueTags = [...new Set(filteredStoresTags)]

    commit('setFilteredTags', uniqueTags)
  },
}
export default actions
