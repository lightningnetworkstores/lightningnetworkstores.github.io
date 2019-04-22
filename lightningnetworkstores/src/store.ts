import Vue from "vue";
import Vuex from "vuex";
import { Store } from "./interfaces/Store";

const stores: Store[] = require("../data/sites.json");

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        stores: stores
    },
    getters: {
        getStore: state => (id: number) => {
            return state.stores.find(store => store.id == id);
        },
        getStores: state => (sector?: string, digitalGoods?: string) => {
            if ((!sector || sector == "undefined") && (!digitalGoods || digitalGoods == "undefined")) {
                return state.stores;
            } else if (!digitalGoods || digitalGoods == "undefined") {
                return sector !== "all" ? state.stores.filter(store => store.sector == sector) : state.stores;
            } else if (!sector || sector == "undefined") {
                return digitalGoods !== "all" ? state.stores.filter(store => store.digital_goods == digitalGoods) : state.stores;
            } else {
                let filteredBySector = sector !== "all" ? state.stores.filter(store => store.sector == sector) : state.stores;
                return digitalGoods !== "all" ? filteredBySector.filter(store => store.digital_goods == digitalGoods) : filteredBySector;
            }
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
