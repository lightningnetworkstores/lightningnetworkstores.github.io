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
        getStores: state => (sector: string) => {
            return sector !== "undefined" ? state.stores.filter(store => store.sector == sector) : state.stores;
        },
        getImage: state => (id: number) => {
            try {
                return require(`@/assets/images/stores/${id}_override.png`);
            } catch (error) {
                return require(`@/assets/images/stores/${id}.png`);
            }
        },
        getImageUrl: state => (id: number) => {
            return "https://www.luckythunder.com/img/ogimage.png";
        }
    },
    mutations: {},
    actions: {}
});
