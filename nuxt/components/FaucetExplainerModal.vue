<template>
  <div class="">
    <v-btn color="secondary" fab x-small dark class="mt-2">
      <v-icon class="float-left" @click.stop="showFaucetDialog = true"
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
            >How to get free bitcoin/satoshis</v-card-title
          >

         <p>
            You need a wallet/app that supports the bitcoin lightning network and a payment protocol called LNURL-withdraw. 
            <a href="/?tags=lnurl-withdraw">Here you can find a list of these wallets</a>. Then you just need your wallet to
            open the "LNURL code" we provide: either scan the QR code, click the link or paste it into your wallet. 
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
