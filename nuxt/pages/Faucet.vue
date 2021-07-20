<template>
  <div class="faucet">
    <v-layout justify-center>
      <v-flex xs12 md12 lg10 xl8 class="pa-6">
        <v-container>
          <v-row>
            <v-col cols="12" md="4" offset-md="4">
              <h1 class="text-center">Top donors</h1>
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
              :items="topDonors.slice(0, 5)"
              :items-per-page="20"
              :hide-default-footer="true"
              class="elevation-1"
            >
              <template v-slot:item="{ item }">
                <tr
                  :class="{ [$style.clickable]: !!item.url }"
                  @click="handleDonorClick(item)"
                >
                  <td>
                    <span>{{ item.name }}</span
                    ><v-icon
                      v-if="item.url"
                      color="black"
                      small
                      class="ml-2 mb-1"
                      >fa-external-link-alt</v-icon
                    >
                  </td>
                  <td>{{ item.message }}</td>
                  <td>
                    {{ Number(item.total_donated).toLocaleString() }}
                  </td>
                  <td>{{ item.sats_per_claim }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-layout>
          <div v-if="!successfulClaim">
            <v-layout v-if="message" ma-4 justify-center
              ><h3>{{ message }}</h3></v-layout
            >
            <v-layout row pa-3 justify-center>
              <vue-hcaptcha
                ref="invisibleHcaptcha"
                sitekey="327adc75-957d-4063-9cf3-c4999bead7dd"
                size="invisible"
                theme="dark"
                @verify="onVerify"
              />
              <v-btn
                class="mt-4"
                depressed
                color="orange"
                x-large
                elevation="10"
                @click="runCaptcha"
              >
                Get {{ claimAmount }} sat
              </v-btn>
            </v-layout>
            <v-layout justify-center ma-3>
              <FaucetExplainerModal />
            </v-layout>
          </div>
          <div v-if="successfulClaim">
            <v-row>
              <v-col cols="12" md="6" sm="12">
                <v-layout ma-4 justify-center
                  ><h2>Stack more sats</h2>
                </v-layout>
                <v-row ma-2 v-for="store in stackSatsStores" :key="store.id">
                  <v-col cols="12" sm="12">
                    <v-layout justify-center>
                      <StoreCard :class="$style['store-card']" :store="store" />
                    </v-layout>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6" sm="12">
                <v-layout ma-2 pa-2 justify-center
                  ><h2>Spend some sats</h2>
                </v-layout>
                <v-row
                  ma-4
                  pa-2
                  v-for="store in spendSatsStores"
                  :key="store.id"
                >
                  <v-col cols="12" sm="12">
                    <v-layout justify-center>
                      <StoreCard :class="$style['store-card']" :store="store" />
                    </v-layout>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-flex>
    </v-layout>
    <v-dialog persistent v-model="donorDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Donate to Faucet</v-card-title>
        <v-card-text>
          <FaucetDonationModal
            :maximumDonationTimeoutDays="
              this.configuration.maximum_donation_timeout_days
            "
            :minDonationAmount="this.configuration.minimum_donation"
            @closeDialog="closeDonationDialog"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="showDialog" max-width="500">
      <v-card>
        <v-card-title v-if="showCheckoutModal" class="text-h5"
          >Get sats via LNURL</v-card-title
        >
        <v-card-title v-else class="text-h5">You got sats!</v-card-title>

        <v-card-text>
          <Checkout
            v-if="showCheckoutModal"
            :satoshi="claimAmount"
            :paymentRequest="paymentRequest"
            @cancel="handleCancel"
          />
          <Success v-if="showSuccessModal" @cancel="handleCancel" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import VueHcaptcha from '@hcaptcha/vue-hcaptcha'
import Checkout from '@/components/Checkout.vue'
import Success from '@/components/Success.vue'
import FaucetExplainerModal from '@/components/FaucetExplainerModal.vue'
import FaucetDonationModal from '@/components/FaucetDonationModal.vue'

export default {
  name: 'Faucet',
  components: {
    VueHcaptcha,
    Checkout,
    Success,
    FaucetExplainerModal,
    FaucetDonationModal,
  },
  head() {
    return {
      title: 'Lightning Network faucet',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Get bitcoin/satoshis with a click of a button in our faucet.',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lightning Network faucet',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            'Get bitcoin/satoshis with a click of a button in our faucet',
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: 'Lightning Network faucet',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Get bitcoin/satoshis with a click of a button in our faucet',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: '/faucet_ogimage.png',
        },
        {
          hid: 'twitter:image:src',
          property: 'twitter:image:src',
          content: '/faucet_ogimage.png',
        },
      ],
    }
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
    throttle: 0,
    donorDialog: false,
    hCaptchaToken: null,
    recaptchaToken: null,
    showCheckoutModal: false,
    showSuccessModal: false,
    successfulClaim: false,
    paymentRequest: '',
    stackSatsStores: [],
    spendSatsStores: [],
    interval: null,
    configuration: {
      maximum_donation_timeout_days: 50,
      minimum_donation: 5000,
    },
  }),
  created() {},
  mounted() {
    this.$store
      .dispatch('getFaucetDonors')
      .then(({ configuration, top_donors, claim, throttle, message }) => {
        this.topDonors = top_donors
          .map((e) => {
            return {
              ...e,
              sats_per_claim: Math.round(e['sats_per_claim'] * 100) / 100,
            }
          })
          .sort((d1, d2) => d2['sats_per_claim'] - d1['sats_per_claim'])

        this.claimAmount = claim
        this.throttle = throttle
        if (message) {
          this.message = message
        }

        this.configuration = configuration

        if (this.throttle <= 0.1) {
          this.$recaptcha.init()
        }
      })
  },
  computed: {
    showDialog() {
      return this.showCheckoutModal || this.showSuccessModal
    },
  },
  methods: {
    onVerify(hCaptchaToken, ekey) {
      this.hCaptchaToken = hCaptchaToken
      this.$store
        .dispatch('faucetClaim', { hCaptchaToken: this.hCaptchaToken })
        .then((resp) => {
          this.processFaucetClaim(resp)
        })
    },
    processFaucetClaim(response) {
      this.showCheckoutModal = true
      this.paymentRequest = response.data.data['lnurl-withdraw']
      this.checkClaimMethod(response.data.data.claimID)
    },
    checkClaimMethod(claimID) {
      this.interval = setInterval(() => {
        this.$store.dispatch('checkClaimRequest', { id: claimID }).then(
          (response) => {
            if (response.data.claim_status == 'PAID') {
              clearInterval(this.interval)
              this.successfulClaim = true
              this.showSuccessModal = true
              this.showCheckoutModal = false
              this.paymentRequest = ''
              this.stackSatsStores = response.data.stack_sats
              this.spendSatsStores = response.data.spend_sats
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }, 5000)
    },
    async runCaptcha() {
      if (this.throttle >= 0.1) {
        this.$refs.invisibleHcaptcha.execute()
      } else {
        this.recaptchaToken = await this.$recaptcha.execute('faucet_claim')
        this.$store
          .dispatch('faucetClaim', {
            recaptchaToken: this.recaptchaToken,
          })
          .then((resp) => {
            this.processFaucetClaim(resp)
          })
      }
    },
    handleCancel() {
      this.showCheckoutModal = false
      this.showSuccessModal = false
      if (this.interval != null) clearInterval(this.interval)
    },
    handleDonorClick(item) {
      if (item.url) {
        window.open(item.url, '_blank')
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

.store-card {
  max-width: 600px;
  width: 100%;
}
</style>
