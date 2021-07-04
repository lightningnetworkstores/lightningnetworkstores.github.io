require('dotenv').config()
const axios = require('axios')

function syncLikesFromServer(serverLikes, likedStores, lsKey) {
  const likes = serverLikes.reduce((acc, id) => {
    acc[id] = true
    return acc
  }, {})

  Object.assign(likedStores, likes)
  localStorage.setItem(lsKey, JSON.stringify(likedStores))

  return likedStores
}

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
      .catch(({ response }) => {
        return Promise.reject({
          statusCode: response.status,
          message: response.data.message,
        })
      })
  },
  getStore({ state, commit }, data) {
    return axios
      .get(`${state.baseURL}api/storeinfo?id=` + data.id)
      .then((response) => {
        return response.data
      })
      .then((response) => {
        commit('setConfiguration', response.configuration)
        commit('setSelectedStore', response)
        return response
      })
      .catch(({ response }) => {
        return Promise.reject({
          statusCode: response.status,
          message: response.data.message,
        })
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
  setSelectedStore({ commit }, store) {
    commit('setSelectedStore', store)
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
	addDiscussion({ state }, payload) {
			return axios
					.post(`${state.baseURL}api/discussion`, payload)
					.then((response) => {
							if (response.status === 200) {
									return response.data
							}
					})
					.catch(console.error)
    },
	getDiscussionReplyPaymentRequest({ state }, payload){
		return axios
		.post(`${state.baseURL}api/discussion`, payload)
		.then((response) => {
				if (response.status === 200) {
						return response.data
				}
		})
		.catch(console.error)
	},
	getDiscussions({ state, commit }) {
			return axios
					.get(`${state.baseURL}api/discussion`)
					.then((response) => {
							if (response.status === 200) {
									const { data } = response.data
									commit('setDiscussions', data)
							}
					})
					.catch(console.error)
	},
    getDiscussion({ state }, id) {
        return axios
            .get(`${state.baseURL}api/discussion?id=${id}`)
            .then((response) => {
                    if (response.status === 200) {
                            const { data } = response.data
                            return data
                    }   
            })
            .catch(console.error)
    },
    addEvent({ state }, payload) {
        return axios
            .post(`${state.baseURL}api/event`, payload)
            .then((response) => {
                if (response.status === 200) {
                        return response.data
                }
            })
            .catch(e =>{
                return e.response.data
            })
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
      if (res.status === 202) {
        // Store was already liked/unliked, we just didn't know about this
        commit('updateLikedStores', { storeId, remove })
        const likes = res.data.data.likes

        // This line sync the likes from the server with the localStorage
        // commit('setStoreLikes', syncLikesFromServer(likes, likedStores, lsKey))
      } else if (res.status === 200) {
        // Store 'like' status was changed successfully
        likedStores[storeId] = remove ? false : true
        localStorage.setItem(lsKey, JSON.stringify(likedStores))
        commit('setLikeCounter', { storeId, remove })
        commit('updateLikedStores', { storeId, remove })
      } else {
        console.warn('Unhndled case')
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
  doFaucetDonation({ state, commit }, { data }) {
    return fetch(`${state.baseURL}api/faucet_donation`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  getFaucetDonors({ state, commit }) {
    return axios
      .get(`${state.baseURL}api/faucetinfo`)
      .then((response) => {
        if (response.status === 200) {
          return response
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
  deleteStoreField({ state, commit }, { id, field }) {
    const body = { fields: [field] }
    return axios
      .delete(`${state.baseURL}api/field?id=${id}`, { data: body })
      .then((response) => {
        if (response.status === 200) {
          commit('confirmStoreFieldRemoval', { field })
        }
      })
      .catch(console.error)
  },
  addExternalAttribute({ state, commit }, { id, name, value }) {
    const body = { [`${name}`]: value }
    return axios
      .put(`${state.baseURL}api/field?id=${id}`, body)
      .then((response) => {
        if (response.status === 200) {
          const { data } = response.data
          if (data[name]) {
            commit('confirmStoreFieldAddition', { field: name, value })
            return {
              result: response.data.status,
            }
          }
        }
        return {}
      })
      .catch((err) => {
        console.error(err)
        if (err.response && err.response.data) {
          return {
            error: err.response.data.message,
          }
        } else {
          return {
            error: 'Undefined error',
          }
        }
      })
  },
  verifyInvoiceRequest({ state }, { id: id }) {
    return fetch(`${state.baseURL}api2/check_payment?id=${id}`)
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  checkClaimRequest({ state }, { id: id }) {
    return fetch(`${state.baseURL}api/check_claim?id=${id}`)
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  setSelectedTag({ commit }, tag) {
    commit('updateSelectedTag', { tag, remove: false })
  },

  unsetSelectedTag({ commit }, tag) {
    commit('updateSelectedTag', { tag, remove: true })
  },

  setExcludedTag({ commit }, tag) {
    commit('updateExcludedTag', { tag, remove: false })
  },

  unsetExcludedTag({ commit }, tag) {
    commit('updateExcludedTag', { tag, remove: true })
  },

  selectOneTag({ commit }, tag) {
    commit('setSelectedTags', [])
    commit('setExcludedTags', [])

    commit('updateSelectedTag', { tag })
  },

  updateSocialMedia({ state, commit }, { id, socialArray }) {
    const body = {}
    socialArray.forEach((social) => {
      body[`${social.name}`] = social.url
    })
    return axios
      .put(`${state.baseURL}api/field?id=${id}`, body)
      .then((response) => {
        if (response.status === 200) {
          const { data } = response.data
          socialArray
            .filter((social) => data[social.name])
            .forEach((social) => {
              commit('updateSocialLink', {
                name: social.name,
                href: social.url,
              })
            })
          return response.data
        } else {
          return response.data
        }
      })
      .catch((err) => {
        console.error(err)
        if (err.response && err.response.data) {
          return { error: err.response.data.message }
        } else {
          return { error: 'Undefined error' }
        }
      })
  },
  removeSocialMedia({ state, commit }, { id, socialToRemove }) {
    const body = {
      fields: socialToRemove,
    }
    return axios
      .delete(`${state.baseURL}api/field?id=${id}`, { data: body })
      .then((response) => {
        if (response.status === 200) {
          const { data } = response.data
          Object.keys(data)
            .filter((name) => data[name])
            .forEach((name) => {
              commit('removeSocialLink', { name })
            })
        }
        return response.data
      })
      .catch((err) => {
        console.error('delete error: ', err)
        if (err.response && err.response.data) {
          return { error: err.response.data.message }
        } else {
          return { error: 'Undefined error' }
        }
      })
  },
  updateImage({ commit, state }, data) {
    console.log(data)
    return axios.post(`${state.baseURL}api/image`, null, { params: data })
  },
  processRoute({ commit, state }, route) {
    const tagsCheckbox = []
    const checkedTags = []
    const excludedTags = []
    let safeMode = false
    let selectedSort = 'best'
    let searchQuery = ''
    if (route.query.safemode) {
      safeMode = route.query.safemode
    }
    if (route.query.sort) {
      selectedSort = route.query.sort
    }
    if (route.query.search) {
      searchQuery = route.query.search
    }
    if (route.query.tags) {
      const routeTags = route.query.tags.split(',').map((x) => decodeURI(x))

      for (const tag of routeTags) {
        tagsCheckbox.push(tag)
        checkedTags[state.tags.indexOf(tag)] = tag
      }
    }

    if (route.query.exclude) {
      const routeExcludedTags = route.query.exclude
        .split(',')
        .map((x) => decodeURI(x))

      for (const tag of routeExcludedTags) {
        excludedTags.push(tag)
      }
    }

    commit('setSelectedTags', tagsCheckbox)
    commit('setExcludedTags', excludedTags)

    return {
      safeMode,
      selectedSort,
      searchQuery,
    }
  },
  toggleFilterByFavoritesStores({ commit, state }) {
    commit('updateFilterFavoriteStores', !state.filterByFavorites)
  },
  async loadImagePreview({ commit, state }, { store, imagePath }) {
    const ytRegex =
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/))([\w\-]+)(\S+)?$/
    if (ytRegex.test(imagePath)) {
      const videoId = ytRegex.exec(imagePath)[5]
      return {
        type: 'youtube',
        url: `https://youtube.com/embed/${videoId}`,
      }
    } else {
      try {
        const response = await axios.post(
          `${state.baseURL}api/image?storeID=${store.id}&source=${imagePath}`
        )
        if (response.status === 200) {
          return {
            type: 'image',
            filename: response.data.data.media,
            url: `${state.baseURL}thumbnails/${response.data.data.media}`,
          }
        }
      } catch (err) {
        console.error('set preview image error: ', err)
        if (err.response && err.response.data) {
          return { error: err.response.data.message }
        } else {
          return { error: 'Undefined error' }
        }
      }
    }
    return {
      type: 'unknown',
      url: null,
    }
  },
  confirmImageSelection(
    { state, commit },
    { storeId, position, media, isHomepage, mediaType }
  ) {
    const maxPosition = state.selectedStore.media.main.length
    if (position > maxPosition) {
      position = maxPosition
    }
    const url = `${state.baseURL}api/image?storeID=${storeId}&position=${position}&media=${media}&homepage=${isHomepage}`
    return axios
      .put(url)
      .then((response) => {
        if (response.status === 200) {
          const type = mediaType === 'image' ? 'IMAGE' : 'VIDEO'
          const data = {
            homepage: isHomepage,
            link: media,
            type: type,
            position: position,
          }
          commit('addStoreMedia', data)
          return response.data
        }
        return { error: 'Undefined error with status 200' }
      })
      .catch((err) => {
        console.error('confirm image error: ', err)
        if (err.response && err.response.data) {
          return { error: err.response.data.message }
        } else {
          return { error: 'Undefined error' }
        }
      })
  },
  deleteStoreImage({ commit, state }, { id, position }) {
    return axios
      .delete(`${state.baseURL}api/image?storeID=${id}&position=${position}`)
      .then((response) => {
        const { data } = response
        if (response.status === 200) {
          if (data.status === 'success') {
            commit('removeStoreMedia', { position: position })
            return {
              message: data.message,
            }
          }
          return {
            error: data.message,
          }
        }
        return {
          error: data.message ? data.message : 'Unknown error',
        }
      })
      .catch((err) => {
        console.error('Got an error')
        if (err.response && err.response.data) {
          return { error: err.response.data.message }
        } else {
          return { error: 'Undefined error' }
        }
      })
  },
  setHomeImage({ commit, state }, { position, storeID }) {
    return axios
      .put(
        `${state.baseURL}api/image?storeID=${storeID}&position=${position}&homepage=true`
      )
      .then((response) => {
        if (response.status === 200) {
          const { data } = response
          commit('updateStoreHomeImage', { position })
          return { message: data.status.message }
        } else {
          return { error: 'Unknown error while trying to update image' }
        }
      })
      .catch((err) => {
        console.error(
          'Got an error while trying to set homepage image. err: ',
          err
        )
        if (err.response && err.response.data) {
          return { error: err.response.data.message }
        } else {
          return { error: 'Undefined error' }
        }
      })
  },
  getPreview({ commit, state }, { url }) {
    return axios.get(`${state.baseURL}api/preview?url=${url}`)
  },
  setScrolledStores({ commit }, storesCount) {
    commit('updateScrolledStores', storesCount)
  },
  async getAnnouncements({ commit, state }) {
    const {
      data: {
        data: { announcements },
      },
    } = await axios.get(`${state.baseURL}api/announcement`)
    commit('updateAnnouncements', announcements)
  },
}

export default actions
