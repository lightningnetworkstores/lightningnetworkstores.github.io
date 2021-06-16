<template>
  <v-app-bar app color="rgb(56, 56, 56)" dark>
    <v-toolbar-title>
      <nuxt-link to="/">
        <img src="@/assets/images/LightningNetworkStores.svg" class="nav-logo"
      /></nuxt-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn text v-for="route in routes" :key="route.text" :to="route.url">
        {{ route.text }}
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
        <v-app-bar-nav-icon
          class="hidden-md-and-up"
          v-bind="attrs"
          v-on="on"
        ></v-app-bar-nav-icon>
      </template>
      <v-list>
        <v-list-item v-for="route in routes" :key="route.text" :to="route.url">
          <v-list-item>
            <v-list-item-title>{{ route.text }}</v-list-item-title>
          </v-list-item>
        </v-list-item>
        <v-list-item href="https://twitter.com/bitcoinLNS">
          <v-list-item>
            <v-list-item-title>Twitter</v-list-item-title>
          </v-list-item>
        </v-list-item>
      </v-list>
    </v-menu>
    <!--  <v-btn icon @click="toggleDarkmode" class="btndarkmode">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        focusable="false"
        width="1em"
        height="1em"
        style="
          -ms-transform: rotate(360deg);
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        "
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path
          d="M10 2c-1.82 0-3.53.5-5 1.35C8 5.08 10 8.3 10 12s-2 6.92-5 8.65C6.47 21.5 8.18 22 10 22a10 10 0 0 0 10-10A10 10 0 0 0 10 2z"
          fill="white"
        />
      </svg>
    </v-btn> -->
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      routes: [
        //{ url: '/faucet', text: 'Faucet' },
        { url: '/discuss', text: 'Discuss' },
        { url: '/stats', text: 'Statistics' },
        { url: '/wallets', text: 'Wallets' },
        { url: '/donations', text: 'Donations' },
        { url: '/about', text: 'About' },
      ],
    }
  },
  mounted() {},

  methods: {
    toggleDarkmode() {
      this.$cookies.set('darkMode', !this.$vuetify.theme.dark, '3y')
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
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
