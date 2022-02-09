<template>
  <div class="ma-2">
    <v-form v-model="isValid">
      <v-textarea
        v-model="invoice"
        outlined
        :disabled="isProcessing || hasError"
        :rows="7"
        :rules="invoiceRules"
        :error-messages="errorMsg"
        hint="Routing fees will be deducted from your balance"
        label="Enter LN invoice"
      />
    </v-form>
    <div v-if="isProcessing" class="pb-2">
      <v-progress-linear color="primary" indeterminate/>
    </div>
    <v-btn v-if="!hasError"
      @click="sendPayment"
      :disabled="isButtonDisabled"
      color="primary"
    >
      Withdraw
    </v-btn>
    <v-btn v-else
      @click="reset"
      color="primary"
    >
      Reset
    </v-btn>
  </div>
</template>
<script>
import lightningPayReq from 'bolt11'
import { mapState } from 'vuex'

const MIN_INVOICE_CHECK_LENGTH = 10

export default {
  data() {
    return {
      isValid: false,
      invoice: null
    }
  },
  methods: {
    async sendPayment() {
      const result = await this.$store.dispatch('wallet/sendPayment', this.invoice)
      if (result === 2) {
        this.reset()
      }
    },
    reset() {
      this.isValid = false
      this.invoice = null
      this.$store.dispatch('wallet/resetWithdrawalState')
    }
  },
  computed: {
    isProcessing() {
      return this.wallet.withdrawal.state === 1
    },
    isSuccess() {
      return this.wallet.withdrawal.state === 2
    },
    hasError() {
      return this.wallet.withdrawal.state === 3
    },
    errorMsg() {
      return this.wallet.withdrawal.errorMsg
    },
    isButtonDisabled() {
      return this.invoice === null ||
        this.invoice.length < MIN_INVOICE_CHECK_LENGTH ||
        this.isProcessing ||
        !this.isValid
    },
    invoiceRules() {
      return [
        v => !!v || 'Enter a LN invoice',
        v => {
          if (!v) return 'Must enter an invoice'
          if (v.length < MIN_INVOICE_CHECK_LENGTH) return true
          try {
            const details = lightningPayReq.decode(v)
            if (details.timeExpireDate < parseInt(Date.now() / 1e3)) return 'This invoice is expired'
            if (details.network.bech32 === 'tb') return 'This is a testnet invoice'
            if (details.network.bech32 !== 'bc') return 'This is not a bitcoin invoice'
            return true
          } catch(err) {
            if (err.message && err.message.startsWith('Invalid checksum'))
              err.message = 'Invalid checksum'
            if (err.message && err.message === 'ExpectedLnPrefix')
              err.message = 'Not a valid invoice'
            return err.message ? err.message : false
          }
        }
      ]
    },
    ...mapState(['wallet'])
  }
}
</script>