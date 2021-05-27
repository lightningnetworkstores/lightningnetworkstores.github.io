const actions = {
  async nuxtServerInit({
    commit
  }) {
    process.env.NODE_ENV == "development" ? this.commit('setIsDev', true) : this.commit('setIsDev', false);
  },
  getDonations({
    state
  }) {
    return fetch(`${state.baseURL}donationAdresses.json`)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },

  getStores({
    state,
    commit
  }) {
    return fetch(`${state.baseURL}api/stores`)
      .then((response) => {

        return response.json();
      })
      .then(response => {
        commit("setStores", response.data.stores);

        commit("setConfiguration", response.data.configuration);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },
  getStore({
    state,
    commit
  }, data) {
    return fetch(`${state.baseURL}api/storeinfo?id=` + data.id)
      .then((response) => {

        return response.json();
      })
      .then((response) => {
        commit("setConfiguration", response.configuration);
        return response
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },
  addStore({
    state
  }, {
    name: name,
    description: description,
    url: url,
    uri: uri,
    sector: sector,
    digitalGoods: digitalGoods,
    contributor: contributor,
    recaptcha: recaptcha
  }) {
    return fetch(
        `${state.baseURL}api/addStore?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&URL=${encodeURIComponent(url)}&URI=${encodeURIComponent(
                  uri
              )}&sector=${encodeURIComponent(sector)}&digitalGoods=${encodeURIComponent(digitalGoods)}&contributor=${contributor}&g-recaptcha-response=${recaptcha}`
      )
      .then((response) => {
        return response.text();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },
  addStoreUpdate({
    state
  }, {
    id: id,
    field: field,
    value: value,
    askOwner: askOwner
  }) {
    return fetch(`${state.baseURL}api/addUpdate?storeID=${id}&field=${encodeURIComponent(field)}&newValue=${encodeURIComponent(value)}&requestOwner=${askOwner}`)
      .then((response) => {

        return response.text();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },
  suggestBan({
    state
  }, {
    id: id,
    name: name,
    message: message
  }) {
    return fetch(`${state.baseURL}api/suggestBan?id=${id}&name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`)
      .then((response) => {

        return response.text();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },
  getStoreVotePaymentRequest({
    state
  }, {
    id,
    amount,
    isUpvote,
    comment,
    parent
  }) {
    return fetch(`${state.baseURL}api/get_invoice?amount=${amount}&storeID=${id}&direction=${isUpvote ? "Upvote" : "Downvote"}${comment ? "&comment=" + comment : ""}${parent ? "&parent=" + parent : ""}`)
      .then((response) => {

        return response.json();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },
  checkPayment({
    state
  }, {
    id: id
  }) {
    return fetch(`${state.baseURL}api/check_payment?id=${id}`)
      .then((response) => {

        return response.text();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },
  getCoinmapData({
    state
  }) {
    return fetch(`${state.baseURL}coinmap.json`)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },

  suggestTags({
    state
  }, {
    storeId,
    tags
  }) {
    const object = {
      taginfo: {
        storeID: storeId,
        add: tags
      }
    };
    return fetch(`${state.baseURL}api/tag`, {
        method: 'POST',
        body: JSON.stringify(object)
      })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },
  suggestTag({
    state
  }, {
    storeId,
    tag
  }) {
    const object = {
      taginfo: {
        storeID: storeId,
        add: [tag]
      }
    };
    return fetch(`${state.baseURL}api/tag`, {
        method: 'POST',
        body: JSON.stringify(object)
      })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },
  removeTag({
    state
  }, {
    storeId: storeId,
    tag: tag
  }) {
    const object = {
      taginfo: {
        storeID: storeId,
        remove: [tag]
      }
    };
    return fetch(`${state.baseURL}api/tag`, {
        method: 'POST',
        body: JSON.stringify(object)
      })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  },
  getWallets({
    state,
    commit
  }) {
    return fetch(`${state.baseURL}wallets.json`)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        commit("setWallets", response);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  },
}


export default actions;
