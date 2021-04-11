import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Fuse from "fuse.js";
import { Store } from "./interfaces/Store";
import { Score } from "./interfaces/Score";

Vue.use(Vuex);

const isTestEnv = false;
const announcement = "Votes evaporate with a 270 day half-life. Read the FAQ.";
const announcementType = "info";
const announcementLink = "https://lightningnetworkstores.com/about";

const baseUrl = isTestEnv ? "https://lightningnetworkstores.com:8443/" : "https://lightningnetworkstores.com/";
const addStoreFee = isTestEnv ? 2 : 2000;
const replyReviewFee = isTestEnv ? 2 : 500;
const trendingThreshold = 0;

const options = {
    shouldSort: true,
    threshold: 0.5,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: ["name", "rank", "href", "description"],
};

export default new Vuex.Store({
    state: {
        stores: [],
        scores: [],
    },
    getters: {
        getStore: (state) => (id: number) => {
            return state.stores.find((store: Store) => store.id == id);
        },
        getStoreCount: (state) => () => {
            return state.stores.length;
        },
        getStores: (state) => ({ sector, digitalGoods }: any, sort: string, search: string, safeMode: string = "false"): Store[] => {
            //filter
            let isFiltered = true;
            let stores: Store[] = [];
            let stateStores: any = state.stores.slice(0);
            if ((!sector || sector == "undefined") && (!digitalGoods || digitalGoods == "undefined")) {
                stores = stateStores;
                isFiltered = false;
            } else if (!digitalGoods || digitalGoods == "undefined") {
                stores = sector !== "all" ? stateStores.filter((store: any) => store.sector == sector) : stateStores;
            } else if (!sector || sector == "undefined") {
                stores = digitalGoods !== "all" ? stateStores.filter((store: Store) => store.digital_goods == digitalGoods) : stateStores;
            } else {
                let filteredBySector = sector !== "all" ? stateStores.filter((store: Store) => store.sector == sector) : stateStores;
                stores = digitalGoods !== "all" ? filteredBySector.filter((store: Store) => store.digital_goods == digitalGoods) : filteredBySector;
            }

            if (safeMode === "true" && stores) {
                let safeStores: Store[] = stores.filter((store: Store) => {
                    return +new Date(store.added * 1000) < Date.now() + -3 * 24 * 3600 * 1000;
                });
                stores = safeStores;
            }

            if (digitalGoods == "all" || sector == "all") {
                isFiltered = false;
            }

            //Search
            if (search && search !== "undefined") {
                let fuse = new Fuse(stores, options);
                stores = fuse.search(search);
            } else {
                // Sort
                switch (sort) {
                    case "trending":
                        stores = stores
                            .filter((store: Store) => (state.scores[store.id] || [0, 0, 0])[2] > trendingThreshold)
                            .sort((a: Store, b: Store) => {
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
                    case "lifetime":
                        stores.sort((a: Store, b: Store) => {
                            return (state.scores[b.id] || [0, 0, 0, 0, 0, 0])[5] - (state.scores[a.id] || [0, 0, 0, 0, 0, 0])[5];
                        });
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
                        // Add most treding tore to top
                        if (!isFiltered) {
                            var mostTrendingStore = stores.slice().sort((a: Store, b: Store) => {
                                return (state.scores[b.id] || [0, 0, 0])[2] - (state.scores[a.id] || [0, 0, 0])[2];
                            })[0];
                            // Is above trending threshold?
                            if (state.scores[mostTrendingStore.id][2] >= 10) {
                                stores.splice(stores.indexOf(mostTrendingStore), 1);
                                stores.unshift(mostTrendingStore);
                            }
                        }
                        break;
                }
            }

            return stores;
        },
        getScore: (state) => (id: number): Score => {
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
            return { upvotes: score[0], downvotes: score[1], trending: score[2], lastCommented: score[3], rank: rank, commentCount: score[4] ? score[4] : 0, lifetime: score[5] ? score[5] : 0 };
        },
        getBaseUrl: (state) => () => {
            return baseUrl;
        },
        getAnnouncement: (state) => () => {
            return announcement;
        },
        getAnnouncementType: (state) => () => {
            return announcementType;
        },
        getAnnouncementLink: (state) => () => {
            return announcementLink;
        },
        getAddStoreFee: (state) => () => {
            return addStoreFee;
        },
        getReplyReviewFee: (state) => () => {
            return replyReviewFee;
        },
    },
    actions: {
        addStore({}, { name: name, description: description, url: url, uri: uri, sector: sector, digitalGoods: digitalGoods, contributor: contributor, recaptcha: recaptcha }) {
            return axios
                .get(
                    `${baseUrl}addStore?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&URL=${encodeURIComponent(url)}&URI=${encodeURIComponent(
                        uri
                    )}&sector=${encodeURIComponent(sector)}&digitalGoods=${encodeURIComponent(digitalGoods)}&contributor=${contributor}&g-recaptcha-response=${recaptcha}`
                )
                .then((response) => {
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },
        getStore({}, { id: id }) {
            return axios
                .get(`${baseUrl}storeinfo?id=${id}`)
                .then((response) => {
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },
        fetchStores({ commit }) {
            axios
                .get(`${baseUrl}stores`)
                .then((response) => {
                    commit("setStores", response.data.data.stores);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        fetchScores({ commit }) {
            axios
                .get(`${baseUrl}storeScores.json`)
                .then((response) => {
                    commit("setScores", response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getStores({ commit }) {
            return axios
                .get(`${baseUrl}stores`)
                .then((response) => {
                    commit("setStores", response.data.data.stores);
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    console.log(error);
                    return Promise.reject(error);
                });
        },
        getScores({ commit }) {
            return axios
                .get(`${baseUrl}storeScores.json`)
                .then((response) => {
                    commit("setScores", response.data);
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    console.log(error);
                    return Promise.reject(error);
                });
        },
        getWallets({}) {
            return axios
                .get(`${baseUrl}wallets.json`)
                .then((response) => {
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },
        getServices({}) {
            return axios
                .get(`${baseUrl}services.json`)
                .then((response) => {
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },
        getDonations({}) {
            return axios
                .get(`${baseUrl}donationAdresses.json`)
                .then((response) => {
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },
        getCoinmapData({}) {
            return axios
                .get(`${baseUrl}coinmap.json`)
                .then((response) => {
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },
        getStoreVotePaymentRequest({}, { id, amount, isUpvote, comment, parent }) {
            return axios
                .get(`${baseUrl}get_invoice?amount=${amount}&storeID=${id}&direction=${isUpvote ? "Upvote" : "Downvote"}${comment ? "&comment=" + comment : ""}${parent ? "&parent=" + parent : ""}`)
                .then((response) => {
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },
        checkPayment({}, { id: id }) {
            return axios
                .get(`${baseUrl}check_payment?id=${id}`)
                .then((response) => {
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },
        addStoreUpdate({}, { id: id, field: field, value: value, askOwner: askOwner }) {
            return axios
                .get(`${baseUrl}addUpdate?storeID=${id}&field=${encodeURIComponent(field)}&newValue=${encodeURIComponent(value)}&requestOwner=${askOwner}`)
                .then((response) => {
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },
        suggestBan({}, { id: id, name: name, message: message }) {
            return axios
                .get(`${baseUrl}suggestBan?id=${id}&name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`)
                .then((response) => {
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },
        suggestTag({}, { storeId: storeId, tag: tag }) {
            const object = { taginfo: { storeID: storeId, add: [tag] } };
            return axios
                .post(`${baseUrl}tag`, object)
                .then((response) => {
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },
        suggestTags({}, { storeId: storeId, tag: tags }) {
            const object = { taginfo: { storeID: storeId, add: tags } };
            return axios
                .post(`${baseUrl}tag`, object)
                .then((response) => {
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },
        removeTag({}, { storeId: storeId, tag: tag }) {
            const object = { taginfo: { storeID: storeId, remove: [tag] } };
            return axios
                .post(`${baseUrl}tag`, object)
                .then((response) => {
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },
    },
    mutations: {
        setStores(state, stores) {
            state.stores = stores;
        },
        setScores(state, scores) {
            state.scores = scores;
        },
    },
});
