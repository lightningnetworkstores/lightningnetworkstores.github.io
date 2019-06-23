import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Store from "./views/Store.vue";
import Stats from "./views/Stats.vue";
import About from "./views/About.vue";
import Wallets from "./views/Wallets.vue";
import Services from "./views/Services.vue";
import Donations from "./views/Donations.vue";

import $ from "jquery";

Vue.use(Router);

let router: Router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            component: Home,
            props: route => ({ sector: route.query.sector, digitalGoods: route.query.digital_goods, sort: route.query.sort, search: route.query.search, safeMode: route.query.safemode }),
            meta: {
                title: "Lightning Network Stores directory",
                metaTags: [
                    {
                        name: "description",
                        content: "The most comprehensive directory of stores/games/venues/shops that accept bitcoin through the lightning network."
                    },
                    {
                        property: "og:title",
                        content: "Lightning Network Stores directory"
                    },
                    {
                        property: "og:description",
                        content: "The most comprehensive directory of stores/games/venues/shops that accept bitcoin through the lightning network."
                    },
                    {
                        property: "twitter:title",
                        content: "Lightning Network Stores directory"
                    },
                    {
                        property: "twitter:description",
                        content: "The most comprehensive directory of stores/games/venues/shops that accept bitcoin through the lightning network."
                    }
                ]
            }
        },
        {
            path: "/store/:storeId",
            name: "store",
            component: Store,
            props: true
        },
        {
            path: "/about",
            name: "about",
            component: About,
            meta: {
                title: "Lightning Network Stores About Page",
                metaTags: [
                    {
                        name: "description",
                        content: "Learn more about the website: goal, contact information, FAQ, Acknowledgements."
                    },
                    {
                        property: "og:title",
                        content: "Lightning Network Stores About Page"
                    },
                    {
                        property: "og:description",
                        content: "Learn more about the website: goal, contact information, FAQ, Acknowledgements."
                    },
                    {
                        property: "twitter:title",
                        content: "Lightning Network Stores About Page"
                    },
                    {
                        property: "twitter:description",
                        content: "Learn more about the website: goal, contact information, FAQ, Acknowledgements."
                    }
                ]
            }
        },
        {
            path: "/wallets",
            name: "wallets",
            component: Wallets,
            meta: {
                title: "Lightning Network Mobile Wallets",
                metaTags: [
                    {
                        name: "description",
                        content: "The most comprehensive list of wallets that support lightning network bitcoin payments."
                    },
                    {
                        property: "og:title",
                        content: "Lightning Network Mobile Wallets"
                    },
                    {
                        property: "og:description",
                        content: "The most comprehensive list of wallets that support lightning network bitcoin payments."
                    },
                    {
                        property: "twitter:title",
                        content: "Lightning Network Mobile Wallets"
                    },
                    {
                        property: "twitter:description",
                        content: "The most comprehensive list of wallets that support lightning network bitcoin payments."
                    }
                ]
            }
        },
        {
            path: "/services",
            name: "services",
            component: Services,
            meta: {
                title: "Lightning Network Services",
                metaTags: [
                    {
                        name: "description",
                        content: "Selection of services around the bitcoin lightning network."
                    },
                    {
                        property: "og:title",
                        content: "Lightning Network Services"
                    },
                    {
                        property: "og:description",
                        content: "Selection of services around the bitcoin lightning network."
                    },
                    {
                        property: "twitter:title",
                        content: "Lightning Network Services"
                    },
                    {
                        property: "twitter:description",
                        content: "Selection of services around the bitcoin lightning network."
                    }
                ]
            }
        },
        {
            path: "/donations",
            name: "donations",
            component: Donations,
            meta: {
                title: "Bitcoin/Lightning donation addresses",
                metaTags: [
                    {
                        name: "description",
                        content: "List of people/entities that accept bitcoin/lightning donations."
                    },
                    {
                        property: "og:title",
                        content: "Bitcoin/Lightning donation addresses"
                    },
                    {
                        property: "og:description",
                        content: "List of people/entities that accept bitcoin/lightning donations."
                    },
                    {
                        property: "twitter:title",
                        content: "Bitcoin/Lightning donation addresses"
                    },
                    {
                        property: "twitter:description",
                        content: "List of people/entities that accept bitcoin/lightning donations."
                    }
                ]
            }
        },
        {
            path: "/stats",
            name: "stats",
            component: Stats,
            meta: {
                title: "Lightning Network Merchant Adoption Statistics",
                metaTags: [
                    {
                        name: "description",
                        content: "Check the adoption of lightning payments by merchants as well as the latest and trending merchants."
                    },
                    {
                        property: "og:title",
                        content: "Lightning Network Merchant Adoption Statistics"
                    },
                    {
                        property: "og:description",
                        content: "Check the adoption of lightning payments by merchants as well as the latest and trending merchants."
                    },
                    {
                        property: "twitter:title",
                        content: "Lightning Network Merchant Adoption Statistics"
                    },
                    {
                        property: "twitter:description",
                        content: "Check the adoption of lightning payments by merchants as well as the latest and trending merchants."
                    }
                ]
            }
        }
    ]
});

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
    // This goes through the matched routes from last to first, finding the closest route with a title.
    // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
    const nearestWithTitle = to.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.title);

    // Find the nearest route element with meta tags.
    const nearestWithMeta = to.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.metaTags);
    const previousNearestWithMeta = from.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.metaTags);

    // If a route with a title was found, set the document (page) title to that value.
    if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

    // Remove any stale meta tags from the document using the key attribute we set below.
    //@ts-ignore
    Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(el => el.parentNode.removeChild(el));

    // Skip rendering meta tags if there are none.
    if (!nearestWithMeta) return next();

    // Turn the meta tag definitions into actual elements in the head.
    nearestWithMeta.meta.metaTags.map((tagDef: { [x: string]: string }) => {
        if (tagDef.hasOwnProperty("name")) {
            document.getElementsByTagName("meta")[tagDef.name].content = tagDef.content;
        } else if (tagDef.hasOwnProperty("property")) {
            $(`meta[property="${tagDef.property}"]`).attr("content", tagDef.content);
        }
    });

    next();
});

export default router;
