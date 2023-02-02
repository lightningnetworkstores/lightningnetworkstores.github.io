<template>
  <v-footer
    class="px-3 py-1"
    color="rgb(56, 56, 56)"
    dark
    :class="{ 'indexpage-footer': $route.name == 'index' }"
  >
    <v-col>
      <v-row justify="center">
        <v-btn
          icon
          href="https://twitter.com/bitcoinLNS"
          target="_blank"
          rel="noopener noreferrer"
          class="mx-2"
          aria-label="Lightning Network Stores Twitter Page"
        >
          <v-icon small>fab fa-twitter</v-icon>
        </v-btn>

        <v-btn
          icon
          href="https://t.me/LNstores"
          class="mx-2"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Lightning Network Stores Telegram Group"
        >
          <v-icon small>fab fa-telegram-plane</v-icon>
        </v-btn>

        <v-btn
          icon
          href="https://medium.com/@BitcoinLNS"
          class="mx-2"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Lightning Network Stores Medium Page"
        >
          <v-icon small>fab fa-medium</v-icon>
        </v-btn>
      </v-row>
    </v-col>
  </v-footer>
</template>

<script>
export default {}
</script>

<style>
.indexpage-footer {
  position: sticky !important;
  bottom: 0;
  inset-inline: 0;
  z-index: 10;
}
</style>
