<template>
  <v-app-bar app color="rgb(56, 56, 56)" dark>
    <v-toolbar-title>
      <nuxt-link to="/">
        <img
          src="@/assets/images/LightningNetworkStores.svg"
          class="nav-logo" /></nuxt-link
    ></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn text to="/stats">Statistics</v-btn>
      <v-btn text to="/wallets">Wallets</v-btn>
      <v-btn text to="/services">Services</v-btn>
      <v-btn text to="/donations">Donations</v-btn>
      <v-btn text to="/about">About</v-btn> </v-toolbar-items
    ><v-menu class="hidden-md-and-up">
      <!-- <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon> -->
      <v-list>
        <v-list-tile to="/stats">
          <v-list-tile-content>
            <v-list-tile-title>Statistics</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/wallets">
          <v-list-tile-content>
            <v-list-tile-title>Wallets</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/services">
          <v-list-tile-content>
            <v-list-tile-title>Services</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/donations">
          <v-list-tile-content>
            <v-list-tile-title>Donations</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/about">
          <v-list-tile-content>
            <v-list-tile-title>About</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="https://twitter.com/bitcoinLNS">
          <v-list-tile-content>
            <v-list-tile-title>Twitter</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>

    <v-btn
      icon
      href="https://twitter.com/bitcoinLNS"
      class="hidden-sm-and-down"
    >
      <!-- <font-awesome-icon icon="fa-twitter" /> -->
      <v-icon>fab fa-twitter</v-icon>
    </v-btn>
    <v-btn icon @click="toggleDarkmode" class="btndarkmode">
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
      <!-- <v-icon>brightness_2</v-icon> -->
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {}
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