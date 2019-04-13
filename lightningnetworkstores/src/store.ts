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
            console.log(sector);
            return sector ? state.stores.filter(store => store.sector == sector) : state.stores;
        },
        getImageUrl: state => (id: number) => {
            return "https://www.luckythunder.com/img/ogimage.png";
        }
    },
    mutations: {},
    actions: {}
});
