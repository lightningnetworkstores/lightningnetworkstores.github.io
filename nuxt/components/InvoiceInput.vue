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
        <v-text-field
          v-if="invoice && invoiceWithoutAmount"
          v-model="amount"
          outlined
          dense
          type="number"
          label="Amount (sats)"
          hint="Enter an amount in sats"
          :rules="amountRules"
        />
      </v-form>
      <div v-if="amount && !hasError" class="text-caption font-weight-light">
        Amount: {{ amount }} <i class="fak fa-satoshisymbol-solidtilt"/> , Fee: {{ withdrawalFee }} <i class="fak fa-satoshisymbol-solidtilt"/>
      </div>
      <div v-if="memo && !hasError" class="text-caption font-weight-light">
        Memo: {{ memo }}
      </div>
      <v-btn
        width="200"
        @click="sendPayment"
        :disabled="isButtonDisabled"
        color="primary"
      >
        Withdraw
      </v-btn>
      <div class="pb-2">
        <v-progress-linear v-if="isProcessing" color="primary" indeterminate/>
      </div>
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
import { WithdrawalState, WithdrawalType } from '~/store/wallet'
import { requestProvider } from 'webln';
import { calculateWithdrawFee } from '../utils/calculateWithdrawFee'

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
      amount: null,
      invoiceWithoutAmount: false,
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
        type: WithdrawalType.BOLT11_INVOICE,
        feeAmount: this.withdrawalFee,
        invoice: this.invoice,
        amount: parseInt(this.amount)
      })
      if (state === WithdrawalState.FAILED) {
        this.reset()
        this.snackbar.show = true
        this.snackbar.message = message
        this.snackbar.isError = true
      } else {
        // Updates dashboard info
        this.$store.dispatch('wallet/updateBalance')
        // Starts timer & polling
        this.startTimer(withdrawalID)
      }
    },
    reset(hadError, message) {
      this.invoice = null
      this.amount = null
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
      this.$store.dispatch('wallet/updateBalance')
    },
    onInput(e) {
      this.amount = null
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
     amountRules() {
      return [
        v => !!v || v === undefined || 'Enter any amount',
        v => Number.parseInt(v) !== NaN || v === undefined || 'Please enter a number',
        v => Number.parseInt(v) > 0 || v === undefined || 'Must be a positive number',
        v => v <= this.withdrawable || 'Insufficient balance' 
      ]
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
            this.amount = details.satoshis
            this.invoiceWithoutAmount = !this.amount
            this.memo = details.tags.find(tag => tag.tagName === 'description').data
            if (this.amount && this.amount > this.withdrawable) return 'Insufficient balance'
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
    withdrawable() {
      return this.balance.available - this.withdrawalFee
    },
    withdrawalFee() {
      return calculateWithdrawFee(this.amount)
    },
    ...mapState('wallet', ['balance', 'withdrawal'])
  }
}
</script>
