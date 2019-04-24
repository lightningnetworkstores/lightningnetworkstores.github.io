import Vue from "vue";
import Vuex from "vuex";
import { Store } from "./interfaces/Store";

const stores: Store[] = require("../data/sites.json");
const scores: any = require("../data/storeScores.json");

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        stores: stores,
        scores: scores
    },
    getters: {
        getStore: state => (id: number) => {
            return state.stores.find(store => store.id == id);
        },
        getStores: state => ({ sector, digitalGoods }: any, sort: string) => {
            //filter
            let stores: Store[] = [];
            if ((!sector || sector == "undefined") && (!digitalGoods || digitalGoods == "undefined")) {
                stores = state.stores;
            } else if (!digitalGoods || digitalGoods == "undefined") {
                stores = sector !== "all" ? state.stores.filter(store => store.sector == sector) : state.stores;
            } else if (!sector || sector == "undefined") {
                stores = digitalGoods !== "all" ? state.stores.filter(store => store.digital_goods == digitalGoods) : state.stores;
            } else {
                let filteredBySector = sector !== "all" ? state.stores.filter(store => store.sector == sector) : state.stores;
                stores = digitalGoods !== "all" ? filteredBySector.filter(store => store.digital_goods == digitalGoods) : filteredBySector;
            }
            //sort
            switch (sort) {
                case "best":
                    stores.sort((a: Store, b: Store) => {
                        return (state.scores[b.id.toString()] || [0])[0] - (state.scores[a.id.toString()] || [0])[0];
                    });
                    break;
                case "trending":
                    stores.sort((a: Store, b: Store) => {
                        return (state.scores[b.id.toString()] || [0])[0] - (state.scores[a.id.toString()] || [0])[0];
                    });
                    break;
                case "newest":
                    stores.sort((a: Store, b: Store) => {
                        return (state.scores[b.id.toString()] || [0])[0] - (state.scores[a.id.toString()] || [0])[0];
                    });
                    break;
                case "controversial":
                    stores.sort((a: Store, b: Store) => {
                        return (state.scores[b.id.toString()] || [0])[0] - (state.scores[a.id.toString()] || [0])[0];
                    });
                    break;
                default:
                    stores.sort((a: Store, b: Store) => {
                        return (state.scores[b.id.toString()] || [0])[0] - (state.scores[a.id.toString()] || [0])[0];
                    });
                    break;
            }

            return stores;
        },
        getScore: state => (id: number) => {
            return state.scores[id.toString()] || [0, 0, 0];
        },
        getImage: state => (id: number) => {
            try {
                return require(`@/assets/images/stores/${id}_override.png`);
            } catch (error) {
                try {
                    return require(`@/assets/images/stores/${id}.png`);
                } catch (error) {
                    return "";
                }
            }
        },
        getImageUrl: state => (id: number) => {
            return "https://www.luckythunder.com/img/ogimage.png";
        }
    },
    mutations: {},
    actions: {}
});
