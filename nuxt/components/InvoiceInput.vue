<template>
  <div>
    <div class="d-flex flex-column justify-space-between">
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
      <div v-if="value && !hasError" class="text-caption font-weight-light">
        Value: {{ value }} <i class="fak fa-satoshisymbol-solidtilt"/> , Fee: {{ expectedWithdrawalFee }} <i class="fak fa-satoshisymbol-solidtilt"/>
      </div>
      <div v-if="memo && !hasError" class="text-caption font-weight-light">
        Memo: {{ memo }}
      </div>
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
import { WithdrawalState } from '~/store/wallet'

const MIN_INVOICE_CHECK_LENGTH = 10

// Interval at which the server will be polled in
// order to check for the state of a withdrawal
const POLL_INTERVAL = 3e3

const MAX_POLLING_ATTEMPTS = 20

export default {
  data() {
    return {
      mode: 0,
      isValid: false,
      invoice: null,
      hint: 'Routing fees will be deducted from your balance',
      value: null,
      memo: null,
      timerTask: null,
      timerCount: 0,
      snackbar: {
        show: false,
        message: null,
        isError: false
      }
    }
  },
  beforeUnmount() {
    this.stopTimer()
  },
  methods: {
    async sendPayment() {
      const { state, message, withdrawalID } = await this.$store.dispatch('wallet/sendPayment', {
        feeAmount: this.expectedWithdrawalFee,
        invoice: this.invoice
      })
      if (state === WithdrawalState.FAILED) {
        this.reset()
        this.snackbar.show = true
        this.snackbar.message = message
        this.snackbar.isError = true
      } else {
        // Updates dashboard info
        this.$store.dispatch('wallet/getDashboardInfo')
        // Starts timer & polling
        this.startTimer(withdrawalID)
      }
    },
    reset(hadError, message) {
      this.invoice = null
      this.value = null
      this.memo = null
      this.snackbar.show = false
      this.$store.dispatch('wallet/resetWithdrawalState')
      if (hadError) {
        this.snackbar.show = true
        this.snackbar.message = message
        this.snackbar.isError = true
      } else {
        this.snackbar.show = true
        this.snackbar.message = 'Withdrawal was successful!'
        this.snackbar.isError = false
      }
      this.$store.dispatch('wallet/getDashboardInfo')
    },
    onInput(e) {
      this.value = null
      this.memo = null
    },
    startTimer(withdrawalID) {
      this.timerTask = setInterval(async () => {
        const isPaid = await this.$store.dispatch('wallet/checkWithdrawal', withdrawalID)
        if (isPaid) {
          this.stopTimer()
          this.reset(false)
        } else if (this.timerCount > MAX_POLLING_ATTEMPTS) {
          this.stopTimer()
          this.reset(true, 'Could not verify payment')
        }
        this.timerCount++
      }, POLL_INTERVAL)
    },
    stopTimer() {
      if (this.timerTask) {
        clearInterval(this.timerTask)
        this.timerTask = null
      }
    }
  },
  computed: {
    isProcessing() {
      return this.withdrawal.state === WithdrawalState.PROCESSING
    },
    isSuccess() {
      return this.withdrawal.state === WithdrawalState.SUCCESS
    },
    hasError() {
      return this.withdrawal.state === WithdrawalState.FAILED
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
            const maxWithdrawble = this.balance.available * (1 - this.percentFactor)
            if (this.value > maxWithdrawble) return 'Insufficient balance'
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
    expectedWithdrawalFee() {
      return Math.ceil(this.value * this.percentFactor)
    },
    percentFactor() {
      return this.balance.withdrawal_fee_per_cent / 100
    },
    ...mapState('wallet', ['balance', 'withdrawal'])
  }
}
</script>