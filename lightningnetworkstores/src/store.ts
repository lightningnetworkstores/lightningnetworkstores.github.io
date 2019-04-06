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
        }
    },
    mutations: {},
    actions: {}
});
