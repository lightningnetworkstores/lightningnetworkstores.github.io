import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Fuse from "fuse.js";
import { Store } from "./interfaces/Store";
import { Score } from "./interfaces/Score";

// const stores: Store[] = require("../data/sites.json");
// const scores: any = require("../data/storeScores.json");

Vue.use(Vuex);

const baseUrl = "https://lightningnetworkstores.com:8443/";
const options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["name", "rank", "href", "description"]
};

export default new Vuex.Store({
    state: {
        stores: [],
        scores: []
    },
    getters: {
        getStore: state => (id: number) => {
            return state.stores.find((store: Store) => store.id == id);
        },
        getStoreCount: state => () => {
            return state.stores.length;
        },
        getStores: state => ({ sector, digitalGoods }: any, sort: string, search: string): Store[] => {
            //filter
            let stores: Store[] = [];
            let stateStores = state.stores.slice(0);
            if ((!sector || sector == "undefined") && (!digitalGoods || digitalGoods == "undefined")) {
                stores = stateStores;
            } else if (!digitalGoods || digitalGoods == "undefined") {
                stores = sector !== "all" ? stateStores.filter((store: any) => store.sector == sector) : stateStores;
            } else if (!sector || sector == "undefined") {
                stores = digitalGoods !== "all" ? stateStores.filter((store: Store) => store.digital_goods == digitalGoods) : stateStores;
            } else {
                let filteredBySector = sector !== "all" ? stateStores.filter((store: Store) => store.sector == sector) : stateStores;
                stores = digitalGoods !== "all" ? filteredBySector.filter((store: Store) => store.digital_goods == digitalGoods) : filteredBySector;
            }

            //Search
            if (search && search !== "undefined") {
                let fuse = new Fuse(stores, options);
                stores = fuse.search(search);
            } else {
                //sort
                switch (sort) {
                    case "best":
                        stores.sort((a: Store, b: Store) => {
                            let scoreB: number = (state.scores[b.id] || [0])[0] - (state.scores[b.id] || [0, 0])[1];
                            let scoreA: number = (state.scores[a.id] || [0])[0] - (state.scores[a.id] || [0, 0])[1];
                            return scoreB - scoreA;
                        });
                        break;
                    case "trending":
                        stores.sort((a: Store, b: Store) => {
                            return (state.scores[b.id] || [0, 0, 0])[2] - (state.scores[a.id] || [0, 0, 0])[2];
                        });
                        break;
                    case "newest":
                        stores
                            .sort((a: Store, b: Store) => {
                                return a.added - b.added;
                            })
                            .reverse();
                        break;
                    case "controversial":
                        stores.sort((a: Store, b: Store) => {
                            return (state.scores[b.id] || [0, 0])[1] - (state.scores[a.id] || [0, 0])[1];
                        });
                        break;
                    case "lastcommented":
                        stores.sort((a: Store, b: Store) => {
                            return (state.scores[b.id] || [0, 0, 0, 0])[3] - (state.scores[a.id] || [0, 0, 0, 0])[3];
                        });
                        break;
                    default:
                        stores.sort((a: Store, b: Store) => {
                            let scoreB: number = (state.scores[b.id] || [0])[0] - (state.scores[b.id] || [0, 0])[1];
                            let scoreA: number = (state.scores[a.id] || [0])[0] - (state.scores[a.id] || [0, 0])[1];
                            return scoreB - scoreA;
                        });
                        break;
                }
            }

            return stores;
        },
        getScore: state => (id: number): Score => {
            let score = state.scores[id] || [0, 0, 0];
            let rank: any = 1;
            if (score[0] - score[1] !== 0) {
                for (var element in state.scores) {
                    if (state.scores.hasOwnProperty(element)) {
                        if (state.scores[element][0] - state.scores[element][1] > score[0] - score[1]) {
                            rank++;
                        }
                    }
                }
                rank = "#" + rank;
            } else {
                rank = "unranked";
            }

            return { upvotes: score[0], downvotes: score[1], trending: score[2], lastCommented: score[3], rank: rank };
        },
        // getImage: state => (id: number) => {
        //     try {
        //         return require(`@/assets/images/stores/${id}_override.png`);
        //     } catch (error) {
        //         try {
        //             return require(`@/assets/images/stores/${id}.png`);
        //         } catch (error) {
        //             return "";
        //         }
        //     }
        // },
        getBaseUrl: state => () => {
            return baseUrl;
        }
    },
    actions: {
        addStore({}, { name: name, description: description, url: url, uri: uri, sector: sector, digitalGoods: digitalGoods, contributor: contributor, recaptcha: recaptcha }) {
            return axios
                .get(
                    `${baseUrl}addStore?name=${encodeURI(name)}&description=${encodeURI(
                        description
                    )}&URL=${url}&URI=${uri}&sector=${sector}&digitalGoods=${digitalGoods}&contributor=${contributor}&g-recaptcha-response=${recaptcha}`
                )
                .then(response => {
                    return Promise.resolve(response);
                })
                .catch(error => {
                    return Promise.reject(error);
                });
        },
        getStore({}, { id: id }) {
            return axios
                .get(`${baseUrl}storeinfo?id=${id}`)
                .then(response => {
                    return Promise.resolve(response);
                })
                .catch(error => {
                    return Promise.reject(error);
                });
        },
        fetchStores({ commit }) {
            axios
                .get(`${baseUrl}sites.json`)
                .then(response => {
                    commit("setStores", response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        fetchScores({ commit }) {
            axios
                .get(`${baseUrl}storeScores.json`)
                .then(response => {
                    commit("setScores", response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        getStores({ commit }) {
            return axios
                .get(`${baseUrl}sites.json`)
                .then(response => {
                    commit("setStores", response.data);
                    return Promise.resolve(response);
                })
                .catch(error => {
                    console.log(error);
                    return Promise.reject(error);
                });
        },
        getScores({ commit }) {
            return axios
                .get(`${baseUrl}storeScores.json`)
                .then(response => {
                    commit("setScores", response.data);
                    return Promise.resolve(response);
                })
                .catch(error => {
                    console.log(error);
                    return Promise.reject(error);
                });
        },
        getWallets({}) {
            return axios
                .get(`${baseUrl}wallets.json`)
                .then(response => {
                    return Promise.resolve(response);
                })
                .catch(error => {
                    return Promise.reject(error);
                });
        },
        getServices({}) {
            return axios
                .get(`${baseUrl}services.json`)
                .then(response => {
                    return Promise.resolve(response);
                })
                .catch(error => {
                    return Promise.reject(error);
                });
        },
        getDonations({}) {
            return axios
                .get(`${baseUrl}donationAdresses.json`)
                .then(response => {
                    return Promise.resolve(response);
                })
                .catch(error => {
                    return Promise.reject(error);
                });
        },
        getCoinmapData({}) {
            return axios
                .get(`${baseUrl}coinmap.json`)
                .then(response => {
                    return Promise.resolve(response);
                })
                .catch(error => {
                    return Promise.reject(error);
                });
        },
        getStoreVotePaymentRequest({}, { id, amount, isUpvote, comment }) {
            return axios
                .get(`${baseUrl}get_invoice?amount=${amount}&storeID=${id}&direction=${isUpvote ? "Upvote" : "Downvote"}${comment ? "&comment=" + encodeURI(comment) : ""}`)
                .then(response => {
                    return Promise.resolve(response);
                })
                .catch(error => {
                    return Promise.reject(error);
                });
        },
        checkPayment({}, { id: id }) {
            return axios
                .get(`${baseUrl}check_payment?id=${id}`)
                .then(response => {
                    return Promise.resolve(response);
                })
                .catch(error => {
                    return Promise.reject(error);
                });
        },
        addStoreUpdate({}, { id: id, field: field, value: value, askOwner: askOwner }) {
            return axios
                .get(`${baseUrl}addUpdate?storeID=${id}&field=${field}&newValue=${value}&requestOwner=${askOwner}`)
                .then(response => {
                    return Promise.resolve(response);
                })
                .catch(error => {
                    return Promise.reject(error);
                });
        },
        suggestBan({}, { id: id, name: name, message: message }) {
            return axios
                .get(`${baseUrl}suggestBan?id=${id}&name=${name}&message=${encodeURI(message)}`)
                .then(response => {
                    return Promise.resolve(response);
                })
                .catch(error => {
                    return Promise.reject(error);
                });
        }
    },
    mutations: {
        setStores(state, stores) {
            state.stores = stores;
        },
        setScores(state, scores) {
            state.scores = scores;
        }
    }
});
