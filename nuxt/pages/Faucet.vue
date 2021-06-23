<template>
  <div class="faucet">
    <v-layout justify-center>
      <v-flex xs12 md12 lg10 xl8 class="pa-6">
        <v-container>
          <v-layout row class="donor-head">
            <h1>Faucet</h1>
            <v-btn depressed color="primary" @click="donorDialog = true"
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
    <v-dialog persistent v-model="donorDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Donate to Faucet</v-card-title>
        <v-card-text>
          <faucets-donate-modal v-on:closeDialog="donorDialog = false" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="showDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Get Sats</v-card-title>
        <v-card-text>
          <Checkout
            v-if="openClaim"
            :satoshi="totalClaims"
            :paymentRequest="paymentRequest"
            @cancel="handleCancel"
          />
          <Success
            v-if="successfulClaim"
            confirm_title="You got sats!"
            @cancel="handleCancel"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import VueHcaptcha from '@hcaptcha/vue-hcaptcha'
import Checkout from '@/components/Checkout.vue'
import Success from '@/components/Success.vue'
export default {
  name: 'Faucet',
  components: {
    VueHcaptcha,
    Checkout,
    Success
  },
  data: () => ({
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Total Sats Donated', value: 'total_donated' },
      { text: 'Sats/Claim', value: 'sats_per_claim' },
    ],
    topDonors: [],
    totalClaims: null,
    donorDialog: false,
    token: null,
    openClaim: false,
    successfulClaim: false,
    paymentRequest: '',
    interval: null
  }),
  created() {
    this.$store.dispatch('getFaucetDonors').then(
      (response) => {
        this.topDonors = response.data.data.top_donors
        this.totalClaims = response.data.data.claim
      }
    )
  },
  computed: {
      showDialog(){return this.openClaim || this.successfulClaim}
  },
  methods: {
    onVerify(token, ekey) {
      this.token = token
      this.$store
        .dispatch('faucetClaim', { token: this.token })
        .then((resp) => {
          this.openClaim = true
          this.paymentRequest = resp.data.data['lnurl-withdraw']
          this.checkClaimMethod(resp.data.data.claimID)
          console.log(resp.data.data['lnurl-withdraw'])
        })
    },
    checkClaimMethod (claimID) {
      this.interval = setInterval(() => {
        this.$store.dispatch('checkClaimRequest', { id: claimID } ).then((response) => {
          if (response.data.claim_status=='PAID') {
            clearInterval(this.interval);
            this.successfulClaim = true;
            this.openClaim = false
          }
          
        }, (error) => {
          console.log(error);
        });
      }, 5000);
    },
    runCaptcha() {
      this.$refs.invisibleHcaptcha.execute()
    },
    handleCancel(){
        this.successfulClaim = false;
        this.openClaim = false
        this.paymentRequest = ''
        if(this.interval!=null) clearInterval(this.interval)
}
  },
}
</script>
<style scoped>
.donor-head {
  justify-content: space-between;
}
</style>
