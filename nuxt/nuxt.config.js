import colors from 'vuetify/es5/util/colors'

import customRoutes from './customRoutes'

const Meta = {
  title: 'Lightning Network Stores Directory',
  description:
    'The most comprehensive directory of stores/apps/services that accept bitcoin through the lightning network.',
}

export default {
  target: 'server',
  server: {
    port: 3000,
    host: '0.0.0.0',
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  router: {
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition && to.name !== 'index') {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },
    extendRoutes(routes, resolve) {
      routes.push(...customRoutes)
    },
  },
  axios: {
    proxy: true,
    proxyHeaders: true,
  },
  proxy: {
    '/api/': {
      target: process.env.BASE_URL,
      changeOrigin: true,
      onProxyRes: function (proxyRes, req, res) {
        //console.log('url=' + req.url + ', method=' + req.method)
      },
      onProxyReq: function (proxyRes, req, res) {
        console.log('url=' + req.url + ', method=' + req.method)
      },
    },
    '/thumbnails/': {
      target: process.env.BASE_URL,
      changeOrigin: false,
    },
    '/api2/': {
      target: process.env.BASE_URL,
      changeOrigin: true,
    },
  },
  render: {
    static: {
      setHeaders(res, path, stat) {
        if (path.includes('sites.json') || path.includes('storeScores.json')) {
          console.log('answering to old sites.json/storeScores.json')
          res.setHeader('Clear-Site-Data', '*')
          res.setHeader('Last-Modified', 'Sat, 19 Jun 2021 22:30:52 GMT')
        }
      },
      handlers: {
        '.md': false,
      },
    },
    fallback: {
      static: {
        handlers: {
          '.md': false,
        },
      },
    },
  },
  generate: {},
  env: {},
  head: {
    // Global page headers (https://go.nuxtjs.dev/config-head)
    title: Meta.title,
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: Meta.description,
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'LightningNetworkStores.com',
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: Meta.title,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: Meta.description,
      },
      {
        hid: 'image',
        property: 'image',
        content: process.env.BASE_URL + 'ogimage.png',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: process.env.BASE_URL + 'ogimage.png',
      },
      {
        hid: 'twitter:title',
        property: 'twitter:title',
        content: Meta.title,
      },
      {
        hid: 'twitter:description',
        property: 'twitter:description',
        content: Meta.description,
      },
      {
        hid: 'twitter:image',
        property: 'twitter:image',
        content: process.env.BASE_URL + 'ogimage.png',
      },
    ],
    link: [
      {
        rel: 'search',
        type: 'application/opensearchdescription+xml',
        title: 'Lightning Network Stores',
        href: '/opensearch.xml',
      },
      {
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
    script: [
      {
        src: 'https://kit.fontawesome.com/090ca49637.js'
      }
    ]
  },
  css: ['./assets/css/main.scss'], // Global CSS (https://go.nuxtjs.dev/config-css)
  plugins: [
    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    {
      src: '~/plugins/deviceUUID.js',
      ssr: false,
    },
    {
      src: '~/plugins/qrcode.js',
      ssr: false,
    },
    {
      src: '~/plugins/updateStoreLikes.js',
      ssr: false,
    },
    {
      src: '~/plugins/checkDiscussionNotificationShowed.js',
      ssr: false,
    },
    {
      src: '~/plugins/vue-google-charts.js',
      ssr: false,
    },
    {
      src: '~/plugins/filters.js',
      ssr: true,
    },
    {
      src: '~/plugins/utils.js',
      ssr: true,
    },
    {
      src: '~/plugins/vue-debounce.js',
      ssr: true,
    },
    {
      src: '~/plugins/axios.js',
      ssr: true,
    },
    {
      src: '~/plugins/carbon-charts.js',
      ssr: true
    }
  ],

  recaptcha: {
    /* reCAPTCHA options */
    hideBadge: true,
    siteKey: '6LdgSxsbAAAAAP4lpnFPCCyDhfyupt3lpI3sFBPi', // Site key for requests
    version: 3,
  },
  components: true, // Auto import components (https://go.nuxtjs.dev/config-components)
  buildModules: [
    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    // '@nuxt/typescript-build', // https://go.nuxtjs.dev/typescript
    '@nuxtjs/vuetify', // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/google-analytics',
  ],

  modules: [
    // Modules (https://go.nuxtjs.dev/config-modules)
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/recaptcha',
    'cookie-universal-nuxt',
    'vue-social-sharing/nuxt',
  ],
  vuetify: {
    // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
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
        },
      },
    },
  },
  //googleAnalytics: { id: 'UA-74119866-1' },

  build: {
    // Build Configuration (https://go.nuxtjs.dev/config-build)
    extend(config, { isDev, isClient }) {
      config.node = {
        fs: 'empty',
      }
    },
  },
}
