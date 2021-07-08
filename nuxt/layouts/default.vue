<template>
  <v-app app>
    <Header />

    <v-main>
      <v-overlay :value="loading">
        <v-progress-circular
          indeterminate
          size="64"
          color="#fdb919"
        ></v-progress-circular>
      </v-overlay>

      <transition name="fade">
        <Nuxt />
      </transition>
      <announcement-modal />
    </v-main>
    <v-footer class="pa-3 mt-8" color="rgb(56, 56, 56)" dark>
      <v-row class="justify-center">
        <v-col class="text-center">
          Copyright &copy;
          {{ new Date().getFullYear() }} LightningNetworkStores.</v-col
        >
      </v-row>
    </v-footer>
  </v-app>
</template>
<script>
import Header from '@/components/Header'
import AnnouncementModal from '@/components/AnnouncementModal'

export default {
  components: { AnnouncementModal, Header },

  fetch() {},

  data() {
    return {}
  },
  beforeCreate() {
    if (this.$cookies.get('darkMode') !== undefined) {
      this.$vuetify.theme.dark = this.$cookies.get('darkMode')
      this.$vuetify.theme.dark = false // turn it off always for now
    } else this.$vuetify.theme.dark = false
  },
  mounted() {},
  computed: {
    loading() {
      return this.$store.state.loading
    },
  },
}
</script>
<style>
#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #fafafa !important;
}

.theme--dark.v-application {
  background: #303030;
  color: #fff;
}

.break-word {
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
}
.v-image__image {
  background-position: top center !important;
}
.datatable-layout {
  display: inline-block;
  width: 100%;
}
.v-dialog {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.noscroll {
  position: fixed;
  overflow-x: hidden;
  overflow-y: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
