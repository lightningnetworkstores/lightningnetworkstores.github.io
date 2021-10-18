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
                :sitekey="hcaptchaSiteKey"
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
            <v-row style="justify-content: center">
              <FaucetExplainerModal />
              <share-faucet :maxClaim="max_claim" />
            </v-row>
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
    <FaucetDonationModal
      :isOpen="donorDialog"
      :maximumDonationTimeoutDays="
        this.configuration.maximum_donation_timeout_days
      "
      :minDonationAmount="this.configuration.minimum_donation"
      :dailyClaimRate="this.daily_claim_rate"
      @closeDialog="closeDonationDialog"
    />
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
            :warningMessage="checkoutWarning"
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
import UrlUtmSource from '~/mixins/UrlUtmSource'

export default {
  name: 'Faucet',
  mixins: [UrlUtmSource],
  components: {
    VueHcaptcha,
    Checkout,
    Success,
    FaucetExplainerModal,
    FaucetDonationModal,
  },
  head() {
    return {
      title: 'Bitcoin lightning faucet',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Get free bitcoin/satoshis with the click of a button in our lightning network faucet.',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Bitcoin lightning faucet',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            'Get free bitcoin/satoshis with the click of a button in our lightning network faucet.',
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: 'Bitcoin lightning faucet',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Get free bitcoin/satoshis with the click of a button in our lightning network faucet.',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: process.env.BASE_URL + '/faucet_ogimage.png',
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: process.env.BASE_URL + '/faucet_ogimage.png',
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
    daily_claim_rate: 2,
    topDonors: [],
    claimAmount: null,
    max_claim: 1,
    throttle: 0,
    donorDialog: false,
    use_hcaptcha: true,
    hCaptchaToken: null,
    recaptchaToken: null,
    claimID: null,
    expiryTime: new Date(),
    interval: null,
    showCheckoutModal: false,
    showSuccessModal: false,
    successfulClaim: false,
    paymentRequest: '',
    checkoutWarning: '',
    stackSatsStores: [],
    spendSatsStores: [],
    configuration: {
      maximum_donation_timeout_days: 50,
      minimum_donation: 5000,
    },
  }),
  created() {},
  async mounted() {
    this.$store
      .dispatch('getFaucetDonors')
      .then(
        ({
          configuration,
          top_donors,
          claim,
          throttle,
          message,
          daily_claim_rate,
          use_hcaptcha,
          max_claim,
        }) => {
          this.topDonors = top_donors
            .map((e) => {
              return {
                ...e,
                sats_per_claim: Math.round(e['sats_per_claim'] * 100) / 100,
              }
            })
            .filter((e) => e.name != 'anonymous')
            .sort((d1, d2) => d2['sats_per_claim'] - d1['sats_per_claim'])

          this.claimAmount = claim
          this.max_claim = max_claim
          this.throttle = throttle
          if (message) {
            this.message = message
          }

          this.use_hcaptcha = use_hcaptcha
          this.daily_claim_rate = daily_claim_rate
          this.configuration = configuration

          if (!this.use_hcaptcha) {
            this.$recaptcha.init()
            setInterval(() => this.$recaptcha.init(), 2 * 60 * 1000)
          }
        }
      )
  },
  computed: {
    showDialog() {
      return this.showCheckoutModal || this.showSuccessModal
    },
    hcaptchaSiteKey() {
      if (this.throttle <= 0.65) {
        // simple hcaptcha
        return '327adc75-957d-4063-9cf3-c4999bead7dd'
      } else {
        // 'hardcore' hcaptcha
        return '11f90dcf-80e1-480e-94c8-054cefc3eae1'
      }
    },
  },
  methods: {
    onVerify(hCaptchaToken, ekey) {
      this.hCaptchaToken = hCaptchaToken
      this.$store
        .dispatch('faucetClaim', {
          hCaptchaToken: this.hCaptchaToken,
        })
        .then((resp) => {
          this.processFaucetClaim(resp)
        })
    },
    processFaucetClaim(response) {
      this.showCheckoutModal = true
      this.paymentRequest = response.data.data['lnurl-withdraw']
      this.claimAmount = response.data.data.amount
      this.checkClaimMethod(response.data.data.claimID)
      if (response.data.message) this.checkoutWarning = response.data.message
    },
    checkClaimMethod(claimID) {
      this.claimID = claimID
      let date = new Date()
      this.expiryTime = new Date(date.setSeconds(date.getSeconds() + 3600))
      this.interval = setInterval(() => {
        this.checkClaim()
      }, 5000)
    },
    checkClaim() {
      if (this.expiryTime <= new Date()) {
        clearInterval(this.inverval)
        return
      }

      this.$store.dispatch('checkClaimRequest', { id: this.claimID }).then(
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
    },
    async runCaptcha() {
      if (this.use_hcaptcha) {
        this.$refs.invisibleHcaptcha.execute()
      } else {
        this.recaptchaToken = await this.$recaptcha.execute('faucet_claim')
        this.$store
          .dispatch('faucetClaim', {
            recaptchaToken: this.recaptchaToken,
          })
          .then((resp) => {
            if (resp.use_hcaptcha === false) {
              this.$refs.invisibleHcaptcha.execute()
            } else {
              this.processFaucetClaim(resp)
            }
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
        const url = this.getUtmSourceLink(item.url)
        window.open(url, '_blank')
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
