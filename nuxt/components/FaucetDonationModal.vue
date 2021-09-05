<template>
  <v-dialog persistent v-model="isOpen" max-width="500">
    <v-card>
      <v-layout v-if="addAlert.message.length">
        <v-flex>
          <v-alert
            :type="addAlert.success ? 'success' : 'error'"
            transition="scale-transition"
            class="mb-0"
          >
            {{ addAlert.message }}
          </v-alert>
        </v-flex>
      </v-layout>
      <v-card-title class="text-h5">Donate to Faucet</v-card-title>
      <v-card-text>
        <div class="FaucetDonationModal">
          <form
            v-if="!pendingDonation && !donationPaid"
            @submit.prevent="submit"
            ref="donationForm"
          >
<<<<<<< HEAD
          <v-subheader>If you like to donate to a specif country, &nbsp <a href='https://twitter.com/bitcoinLNS/status/1428773000980148229'> let us know </a>.</v-subheader>
=======
>>>>>>> 1778ce12da4614cbb12f95b5935450194cf79869
            <v-text-field
              v-model="amount"
              type="number"
              label="Amount"
              required
              :rules="[
                (a) =>
                  a >= minDonationAmount ||
                  `amount can't be less than ${minDonationAmount}`,
              ]"
            ></v-text-field>
            <v-subheader>Distribution period (weeks)</v-subheader>
            <v-slider
              v-model="distributionPeriodWeeks"
              min="1"
              :max="maximumDonationTimeoutDays / 7"
              :thumb-label="true"
              step="1"
              class="align-center"
            ></v-slider>

            <!-- <v-text-field
				v-model="distributionPeriodWeeks"
        type="number"
				label="Distribute in the next days"
        min="1"
        max="99"
				required
				></v-text-field> -->

            <v-combobox
              :items="donorsNames"
              :label="nameInputLabel"
              v-model="name"
              :required="isNameRequired"
              append-icon=""
              autofocus
              auto-select-first
              @change="nameInputChange"
              :search-input.sync="nameQuery"
              hide-no-data
              @blur="checkRegisteredName(nameQuery)"
            />

            <!-- <v-text-field
        v-model="name"
        :label="nameInputLabel"
        :required="isNameRequired"
      ></v-text-field> -->

            <v-text-field
              v-model="message"
              label="Message (optional)"
              :disabled="isMessageInputDisabled"
            ></v-text-field>
            <v-text-field
              v-model="url"
              type="url"
              label="URL (optional)"
              :disabled="isUrlInputDisabled"
            ></v-text-field>

            <v-flex pl-3 pr-3>
              <h4 v-if="this.donorRankPreview <= 5">
                You will be shown as a top donor!
              </h4>
              <h4 v-else>You won't be shown as top donor (only top 5).</h4>
              <v-subheader
                >Donor rank: {{ donorRankPreview }} ({{
                  satsPerClaimPreview
                }}
                sats/claim)</v-subheader
              >
            </v-flex>

            <v-btn class="mr-4" type="submit">submit</v-btn>
            <v-btn @click="cancel">Close</v-btn>
          </form>
          <Checkout
            v-if="pendingDonation"
            :satoshi="satoshi"
            :paymentRequest="paymentRequest"
            @cancel="cancel"
          />
          <Success v-if="donationPaid" @cancel="cancel" />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex'

import Checkout from '@/components/Checkout.vue'
import Success from '@/components/Success.vue'

export default {
  name: 'FaucetDonationModal',
  props: [
    'maximumDonationTimeoutDays',
    'minDonationAmount',
    'dailyClaimRate',
    'isOpen',
  ],
  components: {
    Checkout,
    Success,
  },

  data: () => ({
    addAlert: {
      message: '',
      success: true,
    },
    amount: 1000,
    distributionPeriodWeeks: null,
    excludedNames: ['anonymous'],
    name: '',
    nameQuery: '',
    message: '',
    url: '',
    selectedDonorSatsPerClaim: 0,
    pendingDonation: false,
    donationPaid: false,
    paymentRequest: '',
    satoshi: '',
    interval: null,
    isMessageInputDisabled: false,
    isUrlInputDisabled: false,
  }),
  computed: {
    ...mapState(['faucetDonors']),
    ...mapState({
      donorsNames(state) {
        return state.faucetDonors
          .map((donor) => donor.name)
          .filter((name) => !this.excludedNames.includes(name))
      },
    }),
    satsPerClaimPreview() {
      let unrounded =
        this.amount / (this.distributionPeriodWeeks * 7 * this.dailyClaimRate)
      unrounded += this.selectedDonorSatsPerClaim
      return Math.round(unrounded * 100) / 100
    },
    donorRankPreview() {
      return (
        this.faucetDonors
          .slice(0)
          .filter((d) => d.name != 'anonymous')
          .map((d) => d.sats_per_claim)
          .filter((e) => e > this.satsPerClaimPreview).length + 1
      )
    },
    isNameRequired() {
      return !!this.message || !!this.url
    },
    nameInputLabel() {
      return this.isNameRequired ? 'Name' : 'Name (optional)'
    },
  },
  mounted() {
    this.amount = this.minDonationAmount
  },
  methods: {
    async submit() {
      try {
        this.addAlert.message = ''
        this.checkRegisteredName(this.nameQuery)

        const requestObj = {
          timeout_days: this.distributionPeriodWeeks * 7,
          amount: this.amount,
        }

        let recaptchaToken = await this.$recaptcha.execute('faucet_donation')

        if (this.name || this.nameQuery) {
          requestObj['name'] = this.nameQuery
        }
        if (this.message) {
          requestObj['message'] = this.message
        }
        if (this.url) {
          requestObj['url'] = this.url
        }

        const response = await this.$store.dispatch('doFaucetDonation', {
          data: requestObj,
          recaptchaToken,
        })

        if(response.status!='success'){
            this.addAlert.success = false
            this.addAlert.message = response.message
            return;
        }
        
        let data = response.data
        this.paymentRequest = data.invoice
        this.satoshi = data.amount
        this.pendingDonation = true
        this.checkInvoice(data.id)
      } catch (error) {
        console.log(error)
        this.addAlert.success = false
        this.addAlert.message = error.message
      }
    },

    checkInvoice(invoiceId) {
      this.interval = setInterval(() => {
        this.$store.dispatch('verifyInvoiceRequest', { id: invoiceId }).then(
          (response) => {
            if (response.data.paid) {
              clearInterval(this.interval)
              this.donationPaid = true
              this.pendingDonation = false
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }, 5000)
    },

    cancel() {
      //this.amount = ''
      //this.distributionPeriodWeeks = ''
      //this.name = ''
      //this.message = ''
      //this.url = ''
      this.$emit('closeDialog')
    },

    nameInputChange(value) {
      const donorData = this.faucetDonors.find((donor) => donor.name === value)

      if (donorData) {
        this.message = donorData.message
        this.url = donorData.url
        this.selectedDonorSatsPerClaim = donorData.sats_per_claim
        this.toggleDisabledFormStatus(true)
      } else {
        this.selectedDonorSatsPerClaim = 0
        this.toggleDisabledFormStatus(false)
      }
    },

    toggleDisabledFormStatus(isDisabled) {
      this.isMessageInputDisabled = isDisabled
      this.isUrlInputDisabled = isDisabled
    },

    checkRegisteredName(name) {
      const donorData = this.faucetDonors.find(
        (donor) => donor.name?.toLowerCase() === name?.toLowerCase()
      )

      if (donorData) {
        this.nameQuery = donorData.name
      }
    },
  },
}
</script>
