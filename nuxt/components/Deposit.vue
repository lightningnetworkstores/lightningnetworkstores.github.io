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
      <div class="mt-2 d-flex flex-column justify-center align-center">
        <div class="text-overline">Time left</div>
        <v-icon color="grey">mdi-timer</v-icon>
        <v-progress-linear
          class="mt-1"
          :value="remainingTimePercent"
          rounded
          height="5"
          color="primary"
        />
        {{ remainingTimeText }}
      </div>
      <div class="d-flex">
        <v-btn icon class="mt-3" @click="onCopyClicked">
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
        <InvoiceModal :invoice="invoice"/>
      </div>
    </div>
    <v-form v-if="!hasInvoice" v-model="isValid">
      <v-text-field
        v-model="amount"
        label="Amount (sats)"
        outlined
        type="number"
        :rules="rules"
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
  </div>
</template>
<script>
import { Duration } from 'luxon'
import { mapState } from 'vuex'
import lightningPayReq from 'bolt11'

const INITIAL_TIMER_DATA = {
  lifetime: -1,
  remaining: -1
}
export default {
  data() {
    return {
      isRequesting: false,
      isValid: false,
      amount: null,
      timerTask: null,
      timerData: INITIAL_TIMER_DATA
    }
  },
  beforeUnmount() {
    console.log('beforeUnmount')
    this.stopTimer()
  },
  methods: {
    async requestInvoice() {
      this.isRequesting = true
      const invoice = await this.$store.dispatch('wallet/getInvoice', this.amount)
      const decoded = lightningPayReq.decode(invoice)
      this.timerData.lifetime = parseInt(decoded.timeExpireDate - decoded.timestamp)
      this.timerData.remaining = parseInt(decoded.timeExpireDate - decoded.timestamp)
      this.isRequesting = false
      this.startTimer()
    },
    onCopyClicked(e) {
      navigator.clipboard.writeText(this.invoice)
    },
    startTimer() {
      this.timerTask = setInterval(() => {
        if (this.timerData.remaining > 0) {
          this.timerData.remaining -= 1
        } else {
          this.stopTimer()
        }
      }, 1e3)
    },
    stopTimer() {
      if (this.timerTask) {
        clearInterval(this.timerTask)
        this.timerTask = null
        this.timerData = INITIAL_TIMER_DATA
        this.$store.dispatch('wallet/cancelInvoice')
      }
    }
  },
  computed: {
    rules() {
      return [
        v => v !== null || 'Needs a value',
        v => parseInt(v) > 0 || 'Invalid amount'
      ]
    },
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