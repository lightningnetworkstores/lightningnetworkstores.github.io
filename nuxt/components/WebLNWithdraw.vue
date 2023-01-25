<template>
  <div class="d-flex flex-grow-1">
    <div
      v-if="hasInvoice"
      class="text-caption ma-2 d-flex flex-column align-center justify-center flex-grow-1"
    >
    <div class="d-flex flex-column justify-space-between">
      <div v-if="value && !hasError" class="text-caption text-center">
        Value: {{ value }} <i class="fak fa-satoshisymbol-solidtilt"/> , Fee: {{ expectedWithdrawalFee }} <i class="fak fa-satoshisymbol-solidtilt"/>
      </div>
      <div v-if="memo && !hasError" class="text-caption text-center">
        Memo: {{ memo }}
      </div>
      <div v-if="isProcessing" class="pb-2">
        <v-progress-linear color="primary" indeterminate/>
      </div>
      <v-btn
        class="mt-5 align-self-center"
        width="200"
        @click="sendPayment"
        color="primary"
      >
        Confirm
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
    <div v-else
      class="text-caption ma-2 d-flex flex-column align-center justify-center justify-content-center flex-grow-1"
      >
      Use your browser wallet to withdraw!
      <v-btn
        class="mt-5"
        width="200"
        @click="makeWebLN"
        color="primary"
      >
      Open Wallet 
      </v-btn>
    </div>
  </div>
</template>
<script>
import lightningPayReq from 'bolt11'
import { mapState } from 'vuex'
import { WithdrawalState, WithdrawalType } from '~/store/wallet'
import { requestProvider } from 'webln';

// Interval at which the server will be polled in
// order to check for the state of a withdrawal
const POLL_INTERVAL = 3e3

const MAX_POLLING_ATTEMPTS = 20

export default {
  data() {
    return {
      mode: 0,
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
        type: WithdrawalType.BOLT11_INVOICE,
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
        this.$store.dispatch('wallet/updateBalance')
        // Starts timer & polling
        this.startTimer(withdrawalID)
      }
    },
    async makeWebLN() {
      try {
        const webln = await requestProvider();
      await webln.makeInvoice().then(async (request_invoice) => {
            const invoiceObject = lightningPayReq.decode(request_invoice.paymentRequest)
            this.invoice = invoiceObject.paymentRequest
            this.memo = invoiceObject.tags.find(tag => tag.tagName === 'description').data
            this.value = invoiceObject.satoshis
        })
      } catch(err) {
        alert(err.message)
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
      this.$store.dispatch('wallet/updateBalance')
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
    hasInvoice() {
      return this.invoice !== null
    },
    isProcessing() {
      return this.withdrawal.state === WithdrawalState.PROCESSING
    },
    isSuccess() {
      return this.withdrawal.state === WithdrawalState.SUCCESS
    },
    hasError() {
      return this.withdrawal.state === WithdrawalState.FAILED
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