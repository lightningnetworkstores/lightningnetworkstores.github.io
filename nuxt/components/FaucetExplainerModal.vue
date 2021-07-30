<template>
  <div class="">
    <v-btn color="secondary" fab x-small dark class="mt-2" @click.stop="showFaucetDialog = true">
      <v-icon class="float-left"
        >fa-question</v-icon
      >
    </v-btn>

    <v-dialog
      v-model="showFaucetDialog"
      max-width="800"
      :dark="$vuetify.theme.dark"
    >
      <template v-if="showFaucetDialog">
        <v-card class="pa-2">
          <v-card-title class="headline justify-center"
            >About this faucet and how to use it</v-card-title
          >
        <p>
           This faucet is meant to introduce new users to the bitcoin lightning network or provide occasional help when someone runs out of satoshis.
           Creating a new review/discussion on this website will cost one satoshi (replying is free), so you can use it for that too.
         </p>

         <p>
            You need a wallet/app that supports the bitcoin lightning network and LNURL-withdraw (payment protocol most wallets support). 
            <a href="/?tags=wallet">Here you can find a list of these wallets</a>. Then you just need your wallet to
            open the "LNURL code" we provide: either scan the QR code, click the link or paste it into your wallet. 
         </p>

         <p>
              We have had a few abusers. Don't try to abuse this faucet by trying to get money every day, use proxies or other tricks. 
              Our anti-abuse measures are good and you will waste a lot of time. If you manage to temporarily fool us, you will mostly harm other 
              users, who will get less satoshis, especially the ones in your area/network. In extreme cases, we may even limit the faucet in your country temporarily.
         </p>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              text
              @click="showFaucetDialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: 'FaucetExplainerModal',
  components: {},
  data() {
    return {
      showFaucetDialog: false,
      baseUrl: '',
    }
  },

  mounted() {
    this.baseUrl = this.$nuxt.baseURL;
  },
}
</script>

<style scoped></style>
