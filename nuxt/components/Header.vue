<template>
  <v-app-bar app color="rgb(56, 56, 56)" dark>
    <v-toolbar-title>
      <div class="d-flex justify-space-between align-center">
        <nuxt-link to="/">
          <img
            src="@/assets/images/LightningNetworkStores.svg"
            class="nav-logo"
          />
        </nuxt-link>
        <v-menu v-if="sisterSites.length" v-model="showMenu" offset-y bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon large color="grey lighten-1" v-bind="attrs" v-on="on">
              mdi-chevron-down
            </v-icon>
          </template>
          <v-list id="networkWebSite" color="#383838">
            <v-list-item v-for="site in sisterSites" :key="site.url">
              <v-list-item-title>
                <a :href="site.url">
                  <img :src="site.svgPath" class="nav-logo" />
                </a>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn text v-for="route in routes" :key="route.text" :to="route.url">
        <v-badge
          v-if="isDiscussionNotificationShowed && route.text === 'Discuss'"
          color="orange"
          dot
          inline
          left
        >
          {{ route.text }}
        </v-badge>
        <div v-else>
          {{ route.text }}
        </div>
      </v-btn>
      <v-btn
        icon
        href="https://twitter.com/bitcoinLNS"
        class="hidden-sm-and-down"
      >
        <v-icon>fab fa-twitter</v-icon>
      </v-btn>
    </v-toolbar-items>
    <v-menu class="hidden-md-and-up">
      <template v-slot:activator="{ on, attrs }">
        <v-app-bar-nav-icon class="hidden-md-and-up" v-bind="attrs" v-on="on">
          <template #default>
            <v-badge
              v-if="isDiscussionNotificationShowed"
              color="orange"
              dot
              overlap
            >
              <v-icon>mdi-menu</v-icon>
            </v-badge>
            <v-icon v-else>mdi-menu</v-icon>
          </template>
        </v-app-bar-nav-icon>
      </template>
      <v-list>
        <v-list-item v-for="route in routes" :key="route.text" :to="route.url">
          <v-list-item>
            <v-list-item-title>
              <v-badge
                v-if="
                  isDiscussionNotificationShowed && route.text === 'Discuss'
                "
                color="orange"
                dot
              >
                {{ route.text }}
              </v-badge>
              <div v-else>
                {{ route.text }}
              </div>
            </v-list-item-title>
          </v-list-item>
        </v-list-item>
        <v-list-item href="https://twitter.com/bitcoinLNS">
          <v-list-item>
            <v-list-item-title>Twitter</v-list-item-title>
          </v-list-item>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      routes: [
        { url: '/discuss', text: 'Discuss' },
        { url: '/faucet', text: 'Faucet' },
        { url: '/stats', text: 'Statistics' },
        //{ url: '/wallets', text: 'Wallets' },
        //{ url: '/donations', text: 'Donations' },
        { url: '/about', text: 'About' },
      ],
      sisterSites: [
        {
          url: 'https://bitcoin-stores.com',
          svgPath: 'https://bitcoin-stores.com/bitcoin-stores.com.svg',
        },
        {
          url: 'nostr.bitcoin-stores.com',
          svgPath: 'https://bitcoin-stores.com/nostr.bitcoin-stores.com.svg',
        },
        {
          url: 'yp.bitcoin-stores.com',
          svgPath: 'https://bitcoin-stores.com/yp.bitcoin-stores.com.svg',
        },
      ],
      showMenu: false,
    }
  },
  computed: {
    ...mapState({
      isDiscussionNotificationShowed(state) {
        return state.lastActivity - 500 > state.lastCommentSeenTimestamp
      },
    }),
  },
  methods: {
    toggleDarkmode() {
      this.$cookies.set('darkMode', !this.$vuetify.theme.dark, '3y')
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      this.$vuetify.theme.dark = false // turn it off always
    },
  },
}
</script>
<style>
.v-toolbar__content {
  height: 64px !important;
}
.nav-logo {
  height: 55px;
}
.btndarkmode .v-btn__content {
  font-size: 2em !important;
}
</style>
