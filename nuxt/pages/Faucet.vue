<template>
  <div class="faucet">
    <v-layout justify-center>
      <v-flex xs12 md12 lg10 xl8 class="pa-6">
        <v-container>
          <v-row>
            <v-col cols="12" md="4" offset-md="4">
              <h1 class="text-center">Lightning faucet</h1>
            </v-col>
            <v-col cols="12" md="4">
              <v-layout justify-end>
                <v-btn depressed color="orange" @click="donorDialog = true"
                  >Donate</v-btn
                >
              </v-layout>
            </v-col>
          </v-row>

          <v-layout row pt-3 justify-center class="datatable-layout">
            <v-data-table
              :headers="headers"
              :items="topDonors"
              :items-per-page="20"
              :hide-default-footer="true"
              class="elevation-1"
            >
              <template v-slot:item="{ item }">
                <tr
                  :class="{ [$style.clickable]: !!item.url }"
                  @click="handleDonorClick(item)"
                >
                  <td>{{ item.name }}</td>
                  <td>{{ item.message }}</td>
                  <td>{{ item.total_donated }}</td>
                  <td>{{ item.sats_per_claim }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-layout>
          <v-layout v-if="message"
            ><h3>{{ message }}</h3></v-layout
          >
          <v-layout row pt-3 justify-center>
            <vue-hcaptcha
              ref="invisibleHcaptcha"
              sitekey="327adc75-957d-4063-9cf3-c4999bead7dd"
              size="invisible"
              theme="dark"
              @verify="onVerify"
            />
            <v-btn depressed color="orange" @click="runCaptcha">
              Get {{ claimAmount }} sat
            </v-btn>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <v-dialog persistent v-model="donorDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Donate to Faucet</v-card-title>
        <v-card-text>
          <faucet-donation-modal @closeDialog="closeDonationDialog" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="showDialog" max-width="500">
      <v-card>
        <v-card-title v-if="openClaim" class="text-h5"
          >Get sats via LNURL</v-card-title
        >
        <v-card-title v-else class="text-h5">You got sats!</v-card-title>

        <v-card-text>
          <Checkout
            v-if="openClaim"
            :satoshi="claimAmount"
            :paymentRequest="paymentRequest"
            @cancel="handleCancel"
          />
          <Success v-if="successfulClaim" @cancel="handleCancel" />
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
    Success,
  },
  data: () => ({
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Message', value: 'message' },
      { text: 'Total donated', value: 'total_donated' },
      { text: 'Sats/claim', value: 'sats_per_claim' },
    ],
    message: '',
    topDonors: [],
    claimAmount: null,
    donorDialog: false,
    token: null,
    openClaim: false,
    successfulClaim: false,
    paymentRequest: '',
    interval: null,
  }),
  created() {},
  mounted() {
    this.$store.dispatch('getFaucetDonors').then((response) => {
      this.topDonors = response.data.data.top_donors
      this.topDonors.map(
        (e) =>
          (e['sats_per_claim'] = Math.round(e['sats_per_claim'] * 100) / 100)
      )
      this.topDonors.sort(
        (d1, d2) => d2['sats_per_claim'] - d1['sats_per_claim']
      )

      this.claimAmount = response.data.data.claim
      if (response.data.message) this.message = response.data.message
    })
  },
  computed: {
    showDialog() {
      return this.openClaim || this.successfulClaim
    },
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
    checkClaimMethod(claimID) {
      this.interval = setInterval(() => {
        this.$store.dispatch('checkClaimRequest', { id: claimID }).then(
          (response) => {
            if (response.data.claim_status == 'PAID') {
              clearInterval(this.interval)
              this.successfulClaim = true
              this.openClaim = false
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }, 5000)
    },
    runCaptcha() {
      this.$refs.invisibleHcaptcha.execute()
    },
    handleCancel() {
      this.successfulClaim = false
      this.openClaim = false
      this.paymentRequest = ''
      if (this.interval != null) clearInterval(this.interval)
    },
    handleDonorClick(item) {
      if (item.url) {
        location.href = item.url
      }
    },
    closeDonationDialog() {
      this.donorDialog = false
    },
  },
}
</script>
<style module lang="scss">
tr.clickable {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
