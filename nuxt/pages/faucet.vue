<template>
  <div class="faucet">
    <v-layout justify-center>
      <v-flex xs12 md12 lg10 xl8 class="pa-6">
        <v-container>
          <v-layout row class="donor-head">
            <h1>Faucet</h1>
            <v-btn depressed color="primary" @click="donarDialog = true"
              >Donate</v-btn
            >
          </v-layout>
          <v-layout row pt-3 justify-center class="datatable-layout">
            <v-data-table
              :headers="headers"
              :items="topDonors"
              :items-per-page="20"
              :hide-default-footer="true"
              class="elevation-1"
            ></v-data-table>
          </v-layout>
          <v-layout row pt-3 justify-center>
            <vue-hcaptcha
              ref="invisibleHcaptcha"
              sitekey="327adc75-957d-4063-9cf3-c4999bead7dd"
              size="invisible"
              theme="dark"
              @verify="onVerify"
            />
            <v-btn depressed color="primary" @click="runCaptcha">
              Get Sats
            </v-btn>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <v-dialog persistent v-model="donarDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Donate to Faucet</v-card-title>
        <v-card-text>
          <faucets-donate-modal v-on:closeDialog="donarDialog = false" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import VueHcaptcha from '@hcaptcha/vue-hcaptcha'
export default {
  name: 'Faucet',
  components: { VueHcaptcha },
  data: () => ({
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Total Sats Donated', value: 'total_donated' },
      { text: 'Sats/Claim', value: 'sats_per_claim' },
    ],
    topDonors: [],
    totalClaims: null,
    donarDialog: false,
    token: null,
  }),
  created() {
    this.$store.dispatch('getFaucetDonars').then(
      (response) => {
        console.log('response', response.data.data)
        this.topDonors = response.data.data.top_donors
        this.totalClaims = response.data.data.claim
      }
    )
  },
  mounted() {},
  methods: {
    onVerify(token, ekey) {
      this.token = token
      this.$store
        .dispatch('faucetClaim', { token: this.token })
        .then((resp) => {
          console.log(resp.data.data['lnurl-withdraw'])
        })
    },
    runCaptcha() {
      this.$refs.invisibleHcaptcha.execute()
    },
  },
}
</script>
<style scoped>
.donor-head {
  justify-content: space-between;
}
</style>
