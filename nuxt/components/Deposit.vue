<template>
  <div class="ma-2" style="min-height: 15em">
    <div
      v-if="hasInvoice"
      class="text-caption ma-2 d-flex flex-column align-center justify-center"
    >
      <v-sheet
        class="pa-2"
        color="#F0F0F0"
        :height="invoiceContainerHeight"
        :style="{maxWidth: invoiceContainerWidth }"
        rounded
        shaped
      >
        {{ invoice }}
      </v-sheet>
      <InvoiceTimer
        :lifetime="timerData.lifetime"
        :remaining="timerData.remaining"
      />
      <div class="d-flex">
        <v-btn icon class="mt-3" @click="onCopyClicked">
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
        <InvoiceModal :invoice="invoice"/>
      </div>
      <v-flex pl-3 pr-3 class="text-center">
        <a :href="'lightning:' + invoice" class="link-button"
          >Open in wallet</a
        >
      </v-flex>
    </div>
    <v-form v-if="!hasInvoice" v-model="isValid">
      <v-text-field
        v-model="amount"
        label="Amount (sats)"
        outlined
        type="number"
      >
      </v-text-field>
      <v-progress-linear
        v-if="isRequesting"
        indeterminate
        class="mb-3"
      />
      <v-btn
        :disabled="!isValid || isRequesting"
        @click="requestInvoice"
        color="primary"
      >
        Generate Invoice
      </v-btn>
    </v-form>
    <v-snackbar
      bottom
      v-model="isPaid"
    >
      Deposit confirmed!
      <template v-slot:action="{ attrs }">
        <v-btn
          color="green"
          text
          v-bind="attrs"
          @click="isPaid = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { Duration } from 'luxon'
import { mapState } from 'vuex'
import lightningPayReq from 'bolt11'
import { requestProvider } from 'webln';

const INITIAL_TIMER_DATA = {
  lifetime: -1,
  remaining: -1
}
// Interval at which the server will be polled in 
// order to check for the state of a deposit
const POLL_INTERVAL = 3

export default {
  data() {
    return {
      isRequesting: false,
      isValid: false,
      amount: null,
      timerTask: null,
      timerData: INITIAL_TIMER_DATA,
      isPaid: false
    }
  },
  beforeUnmount() {
    this.stopTimer()
  },
  methods: {
    async requestInvoice() {
      await this.getInvoice()
    },
    async payWebLN() {
      try {
        const webln = await requestProvider();
        await this.getInvoice().then((invoice) => {
          webln.sendPayment(invoice)
        })
      }
     catch(err) {
      alert(err.message);
}
    },
    onCopyClicked(e) {
      navigator.clipboard.writeText(this.invoice)
    },
    async getInvoice() {
      if (this.amount === null || parseInt(this.amount) <= 0) {
        return "Invalid amount"
      }
      this.isRequesting = true
      const invoice = await this.$store.dispatch('wallet/getInvoice', this.amount)
      const decoded = lightningPayReq.decode(invoice)
      this.timerData.lifetime = parseInt(decoded.timeExpireDate - decoded.timestamp)
      this.timerData.remaining = parseInt(decoded.timeExpireDate - decoded.timestamp)
      this.isRequesting = false
      this.startTimer()

      return invoice
    },
    startTimer() {
      this.timerTask = setInterval(async () => {
        if (this.timerData.remaining > 0) {
          this.timerData.remaining -= 1
          if (this.timerData.remaining % POLL_INTERVAL === 0) {
            const isPaid = await this.$store.dispatch('wallet/checkDeposit')
            if (isPaid) {
              this.$store.dispatch('wallet/getDashboardInfo')
              this.isPaid = true
              this.stopTimer()
            }
          }
        } else {
          this.stopTimer()
        }
      }, 1e3)
    },
    stopTimer() {
      if (this.timerTask) {
        clearInterval(this.timerTask)
        this.amount = null
        this.timerTask = null
        this.timerData = INITIAL_TIMER_DATA
        this.$store.dispatch('wallet/cancelInvoice')
      }
    }
  },
  computed: {
    invoiceContainerWidth() {
      return this.$vuetify.breakpoint.name === 'xs' ? '36em' : '47em'
    },
    invoiceContainerHeight() {
      return this.$vuetify.breakpoint.name === 'xs' ? '11em' : '9em'
    },
    hasInvoice() {
      return this.invoice !== null
    },
    remainingTimeText() {
      const { remaining } = this.timerData
      const millis = remaining * 1e3
      const duration = Duration.fromMillis(millis > 0 ? millis : 0)
      const h = parseInt(this.timerData.remaining / 60 / 60)
      const m = parseInt(this.timerData.remaining / 60)
      const s = parseInt(this.timerData.remaining % 60)
      if (h > 0) return duration.toFormat('hh:mm:ss')
      else if (m > 0) return duration.toFormat('mm:ss')
      else `${s} seconds`
    },
    remainingTimePercent() {
      const { lifetime, remaining } = this.timerData
      return remaining > 0 && lifetime > 0 ? ((remaining / lifetime) * 100) : 0
    },
    ...mapState({
      invoice: state => state.wallet.deposit.invoice
    })
  }
}
</script>