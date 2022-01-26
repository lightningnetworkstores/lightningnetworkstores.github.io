<template>
  <v-footer class="pa-3" color="rgb(56, 56, 56)" dark>
    <v-col>
      <v-row class="justify-center">
        <v-col class="text-center">
          Copyright &copy;
          {{ new Date().getFullYear() }} LightningNetworkStores.</v-col
        >
      </v-row>
      <v-row class="mb-2">
        <v-divider></v-divider>
      </v-row>
      <v-row justify="center">
        <v-btn
          icon
          href="https://twitter.com/bitcoinLNS"
          class="hidden-sm-and-down mx-4"
        >
          <v-icon>fab fa-twitter</v-icon>
        </v-btn>

        <v-btn
          icon
          href="https://t.me/LNstores"
          class="hidden-sm-and-down mx-4"
        >
          <v-icon>fab fa-telegram-plane</v-icon>
        </v-btn>

        <v-btn
          icon
          href="https://medium.com/@BitcoinLNS"
          class="hidden-sm-and-down mx-4"
        >
          <v-icon>fab fa-medium</v-icon>
        </v-btn>
      </v-row>
    </v-col>
  </v-footer>
</template>

<script>
export default {}
</script>

<style></style>
