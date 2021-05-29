import colors from 'vuetify/es5/util/colors'
import axios from 'axios'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'server',
  server: {
    port: 3000, host: '0'
  },
  axios: {
    proxy: true,
    proxyHeaders: true
  },
  proxy: {
    '/api/': {
      target: 'https://bitcoin-stores.com', changeOrigin: false
    },
    '/thumbnails/': {
      target: 'https://bitcoin-stores.com', changeOrigin: false
    },
    '/api2/': {
        target: 'https://bitcoin-stores.com', changeOrigin: false
      },
    '/api3/': {
        target: 'https://bitcoin-stores.com', changeOrigin: false
      },
  },
  generate: {
    interval: 100,
    routes() {
      return axios
        .get(`https://LightningNetworkStores.com/stores`)
        .then((response) => {
          return response.data.data.stores.map((store) => {
            return `/store/${store.id}`
          })
        })
    },
    exlude: [],
    crawler: true
  }, // ['/stats', '/donations', '/about', '/About', '/Stats', 'Donations', '/']

  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - lightningnetworkstores',
    title: "Lightning Network Stores directory",
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: "description",
        name: "description",
        content: "The most comprehensive directory of stores/games/venues/shops that accept bitcoin through the lightning network."
      },
      {
        hid: "og:title",
        property: "og:title",
        content: "Lightning Network Stores directory"
      },
      {
        hid: "og:description",
        property: "og:description",
        content: "The most comprehensive directory of stores/games/venues/shops that accept bitcoin through the lightning network."
      },
      {
        hid: "twitter:title",
        property: "twitter:title",
        content: "Lightning Network Stores directory"
      },
      {
        hid: "twitter:description",
        property: "twitter:description",
        content: "The most comprehensive directory of stores/games/venues/shops that accept bitcoin through the lightning network."
      }
    ],
    link: [{
        hid: 'icon',
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon-16x16.png',
        sizes: '16x16',
      },
      {
        hid: 'icon',
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon-32x32.png',
        sizes: '32x32',
      },
      {
        hid: 'icon',
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon-48x48.png',
        sizes: '48x48',
      },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.0.13/css/all.css',
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/css/main.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [{
    src: '~/plugins/qrcode.js',
    ssr: false
  }, {
    src: '~/plugins/vue-google-charts.js',
    ssr: false
  }, {
    src: '~/plugins/filters.js',
    ssr: false
  }],

  recaptcha: {
    /* reCAPTCHA options */
    siteKey: "6LddfGMUAAAAAG75Ke0N_iVtWh1QwwGFlByKpoMj", // Site key for requests
    version: 2
  },

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    // '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/recaptcha',
    'cookie-universal-nuxt',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          background: '#303030',
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {

  }
}
