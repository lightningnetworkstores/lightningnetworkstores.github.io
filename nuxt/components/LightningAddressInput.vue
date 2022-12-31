<template>
  <div>
    <v-form>
      <v-text-field
        v-model="address"
        outlined
        type="email"
        label="Lightning Address"
        hint="Any lightning address. Ex: some-user@lntxbot.com"
        :rules="addressRules"
      />
      <v-text-field
        v-model="amount"
        outlined
        type="number"
        label="Amount (sats)"
        hint="Enter an amount in sats"
        :rules="amountRules"
      />
    </v-form>
    <v-btn
      width="200"
      @click="sendPayment"
      :disabled="isButtonDisabled"
      color="primary"
    >
      Withdraw
    </v-btn>
  </div>
</template>
<script>
import regexMixin from '~/mixins/regex.js'
const MIN_ADDRESS_LENGTH = 3

export default {
  data() {
    return {
      address: '',
      amount: undefined
    }
  },
  mixins: [ regexMixin ],
  methods: {
    async sendPayment() {}
  },
  computed: {
    isButtonDisabled() {
      return this.amount === undefined ||
        this.amount < 0 ||
        Number.isInteger(this.amount) ||
        this.address.length >= MIN_ADDRESS_LENGTH
    },
    amountRules() {
      return [
        v => !!v || 'Enter any amount',
        v => {
          console.log(typeof v)
          return true
        },
        v => Number.parseInt(v) !== NaN || 'Please enter a number',
        v => Number.parseInt(v) > 0 || 'Must be a positive number'
      ]
    },
    addressRules() {
      return [
        v => (!!v || v == null) || 'Enter a Lightning Address',
        v => {
          if (v.length < MIN_ADDRESS_LENGTH) return true
          if (this.isValidEmail(v)) return true
          else return 'Not a valid Lightning Address'
        }
      ]
    }
  }
}
</script>