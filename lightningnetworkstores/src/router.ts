import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Store from "./views/Store.vue";
import Stats from "./views/Stats.vue";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            component: Home,
            props: route => ({ sector: route.query.sector, digitalGoods: route.query.digital_goods, sort: route.query.sort })
        },
        {
            path: "/store/:storeId",
            name: "store",
            component: Store,
            props: true
        },
        {
            path: "/stats",
            name: "stats",
            component: Stats
        }
    ]
});
