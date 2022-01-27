<template>
  <v-footer
    class="pa-3"
    color="rgb(56, 56, 56)"
    dark
    :class="{ 'indexpage-footer': $route.name == 'index' }"
  >
    <v-col>
      <v-row justify="center">
        <v-btn icon href="https://twitter.com/bitcoinLNS" class="mx-4">
          <v-icon>fab fa-twitter</v-icon>
        </v-btn>

        <v-btn icon href="https://t.me/LNstores" class="mx-4">
          <v-icon>fab fa-telegram-plane</v-icon>
        </v-btn>

        <v-btn icon href="https://medium.com/@BitcoinLNS" class="mx-4">
          <v-icon>fab fa-medium</v-icon>
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
