import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import numeral from "numeral";
//@ts-ignore
import VueAnalytics from "vue-analytics";

Vue.filter("number", (value: any) => {
    return numeral(value).format("0,0");
});

Vue.use(VueAnalytics, {
    id: "UA-74119866-1",
    router
});

Vue.use(Vuetify);
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
