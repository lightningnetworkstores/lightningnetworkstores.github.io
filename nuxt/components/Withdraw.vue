<template>
  <div>
    <div class="container d-flex flex-column justify-space-between">
      <v-form v-model="isValid">
        <v-textarea
          v-model="invoice"
          outlined
          @input="onInput"
          :disabled="isProcessing || hasError"
          :rows="6"
          :rules="invoiceRules"
          :hint="hint"
          no-resize
          label="Enter LN invoice"
        />
      </v-form>
      <div v-if="value && !hasError" class="text-caption font-weight-light"> {{ value }} sats </div>
      <div v-if="memo && !hasError" class="text-caption font-weight-light"> Memo: {{ memo }} </div>
      <div v-if="isProcessing" class="pb-2">
        <v-progress-linear color="primary" indeterminate/>
      </div>
      <v-btn
        width="200"
        @click="sendPayment"
        :disabled="isButtonDisabled"
        color="primary"
      >
        Withdraw
      </v-btn>
    </div>
    <v-snackbar v-model="snackbar.show">
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          :color="snackbar.isError ? 'red' : 'green'"
          text
          v-bind="attrs"
          @click="reset"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import lightningPayReq from 'bolt11'
import { mapState } from 'vuex'

const MIN_INVOICE_CHECK_LENGTH = 10

const WithdrawalState = {
  INITIAL: 0,
  PROCESSING: 1,
  SUCCESS: 2,
  FAILED: 3
}

export default {
  data() {
    return {
      isValid: false,
      invoice: null,
      hint: 'Routing fees will be deducted from your balance',
      value: null,
      memo: null,
      snackbar: {
        show: false,
        message: null,
        isError: false
      }
    }
  },
  methods: {
    async sendPayment() {
      const { state, message } = await this.$store.dispatch('wallet/sendPayment', this.invoice)
      if (state === WithdrawalState.SUCCESS) {
        this.reset()
        this.snackbar.show = true
        this.snackbar.message = 'Withdrawal was successful!'
        this.snackbar.isError = false
      } else {
        this.reset()
        this.snackbar.show = true
        this.snackbar.message = message
        this.snackbar.isError = true
      }
    },
    reset() {
      this.invoice = null
      this.value = null
      this.memo = null
      this.snackbar.show = false
      this.$store.dispatch('wallet/resetWithdrawalState')
    },
    onInput(e) {
      this.value = null
      this.memo = null
    }
  },
  computed: {
    isProcessing() {
      return this.wallet.withdrawal.state === WithdrawalState.PROCESSING
    },
    isSuccess() {
      return this.wallet.withdrawal.state === WithdrawalState.SUCCESS
    },
    hasError() {
      return this.wallet.withdrawal.state === WithdrawalState.FAILED
    },
    isButtonDisabled() {
      return this.invoice === null ||
        this.invoice.length < MIN_INVOICE_CHECK_LENGTH ||
        this.isProcessing ||
        !this.isValid
    },
    invoiceRules() {
      return [
        v => (!!v || v == null) || 'Enter a LN invoice',
        v => {
          if (!v) return true
          if (v.length < MIN_INVOICE_CHECK_LENGTH) return true
          try {
            const details = lightningPayReq.decode(v)
            if (details.timeExpireDate < parseInt(Date.now() / 1e3)) return 'This invoice is expired'
            if (details.network.bech32 === 'tb') return 'This is a testnet invoice'
            if (details.network.bech32 !== 'bc') return 'This is not a bitcoin invoice'
            this.hint = null
            this.value = details.satoshis
            this.memo = details.tags.find(tag => tag.tagName === 'description').data
            return true
          } catch(err) {
            console.error('Error validating input. err: ', err)
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
<style scoped>
.container {
  height: 20em;
}
</style>