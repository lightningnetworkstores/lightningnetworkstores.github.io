<template>
  <div>
    <v-form>
      <v-text-field
        v-model="address"
        outlined
        type="email"
        label="Lightning Address"
        hint="Any lightning address. Ex: some-user@lntxbot.com"
        :disabled="isProcessing"
        :rules="addressRules"
      />
      <v-text-field
        v-model="amount"
        outlined
        type="number"
        label="Amount (sats)"
        hint="Enter an amount in sats"
        :disabled="isProcessing"
        :rules="amountRules"
      />
    </v-form>
    <div class="text-caption font-weight-light">
      Fee: {{ LIGHTNING_ADDRESS_FEE_AMOUNT }} %
    </div>
    <v-btn
      width="200"
      @click="sendPayment"
      :disabled="isButtonDisabled"
      color="primary"
    >
      Withdraw
    </v-btn>
    <div class="pt-2 mb-0">
      <v-progress-linear v-if="isProcessing" color="primary" indeterminate/>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import regexMixin from '~/mixins/regex.js'

const MIN_ADDRESS_LENGTH = 3

const LIGHTNING_ADDRESS_FEE_AMOUNT = 1

const WithdrawalState = {
  INITIAL: 0,
  PROCESSING: 1,
  SUCCESS: 2,
  FAILED: 3
}

export default {
  data() {
    return {
      address: '',
      amount: undefined,
      LIGHTNING_ADDRESS_FEE_AMOUNT
    }
  },
  mixins: [ regexMixin ],
  methods: {
    async sendPayment() {
      await this.$store.dispatch('wallet/sendPayment', {
        address: this.address,
        amount: parseInt(this.amount),
        feeAmount: LIGHTNING_ADDRESS_FEE_AMOUNT
      })
      await this.$store.dispatch('wallet/getDashboardInfo')
      this.reset()
    },
    reset() {
      this.address = ''
      this.amount = undefined
    }
  },
  computed: {
    isButtonDisabled() {
      return this.amount === undefined ||
        this.amount < 0 ||
        Number.parseInt(this.amount) === NaN ||
        this.address.length < MIN_ADDRESS_LENGTH ||
        this.isProcessing
    },
    amountRules() {
      return [
        v => !!v || v === undefined || 'Enter any amount',
        v => Number.parseInt(v) !== NaN || v === undefined || 'Please enter a number',
        v => Number.parseInt(v) > 0 || v === undefined || 'Must be a positive number'
      ]
    },
    addressRules() {
      return [
        v => !!v || v === '' || 'Enter a Lightning Address',
        v => {
          if (v.length < MIN_ADDRESS_LENGTH) return true
          if (this.isValidEmail(v)) return true
          else return 'Not a valid Lightning Address'
        }
      ]
    },
    ...mapState({
      isProcessing: state => state.wallet.withdrawal.state === WithdrawalState.PROCESSING
    })
  }
}
</script>