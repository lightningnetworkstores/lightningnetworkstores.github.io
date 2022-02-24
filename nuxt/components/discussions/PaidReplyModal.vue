<template>
  <v-dialog v-model="show" max-width="500">
    <v-card>
      <v-card-title>Reply</v-card-title>
      <v-sheet class="d-flex mx-5" color="#F7F7F7" rounded>
        <v-icon class="mx-2" color="orange">mdi-alert</v-icon>
        <v-card-subtitle>
          {{ message ? message : defaultMessage }}
        </v-card-subtitle>
      </v-sheet>
      <v-card-text class="text-center font-weight-black">{{ amount }} sat</v-card-text>
      <div class="d-flex">
        <v-spacer></v-spacer>
        <qrcode-vue
          :value="invoice"
          :size="$vuetify.breakpoint.name === 'xs' ? 240 : 300"
        />
        <v-spacer></v-spacer>
      </div>
      <v-card-text class="text-center pb-0">
        <a :href="`lightning:${invoice}`" class="link-button">
          Open in Wallet
        </a>
      </v-card-text>
      <v-sheet color="#F7F7F7" class="d-flex justify-center mx-5">
        <InvoiceTimer v-if="timerData" style="width: 200px;"
          :lifetime="timerData.lifetime"
          :remaining="timerData.remaining"
        />
      </v-sheet>
      <v-card-text class="text-caption mt-3">
        {{ invoice }}
      </v-card-text>
      <div class="d-flex justify-center">
        <v-btn icon @click="handleCopy">
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          @click="handleClose"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="showSnackbar"
      timeout="1000"
      transition="scale-transition"
      color="green"
    >
      <div class="text-center text-body-1">Invoice copied to clipboard!</div>
    </v-snackbar>
  </v-dialog>
</template>
<script>
import lightningPayReq from 'bolt11'
import { Duration } from 'luxon'

const INITIAL_TIMER_DATA = {
  lifetime: -1,
  remaining: -1
}
// Interval at which the server will be polled in 
// order to check for the state of a deposit
const POLL_INTERVAL_SECONDS = 3
const CLOCK_INTERVAL = 1e3

export default {
  props: {
    invoice: {
      type: String,
      required: true
    },
    message: {
      type: String,
    },
    paymentId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      timerTask: null,
      timerData: INITIAL_TIMER_DATA,
      isPaid: true,
      showSnackbar: false
    }
  },
  mounted() {
    this.startTimer()
  },
  beforeUnmount() {
    this.stopTimer()
  },
  methods: {
    handleClose() {
      this.stopTimer()
      this.$emit('cancel-reply')
    },
    startTimer() {
      const decoded = lightningPayReq.decode(this.invoice)
      this.timerData.lifetime = parseInt(decoded.timeExpireDate - decoded.timestamp)
      this.timerData.remaining = parseInt(decoded.timeExpireDate - decoded.timestamp)
      this.timerTask = setInterval(async () => {
        if (this.timerData.remaining > 0) {
          this.timerData.remaining -= 1
          if (this.timerData.remaining % POLL_INTERVAL_SECONDS === 0) {
            const isPaid = await this.$store.dispatch('discussions/checkPayment', this.paymentId)
            if (isPaid) {
              this.isPaid = true
              this.stopTimer()
              this.$emit('reply-payment-confirmed')
            }
          }
        } else {
          this.stopTimer()
        }
      }, CLOCK_INTERVAL)
    },
    stopTimer() {
      if (this.timerTask) {
        clearInterval(this.timerTask)
        this.timerTask = null
        this.timerData = INITIAL_TIMER_DATA
        // TODO: Update the local state and display a failure? 
      }
    },
    handleCopy() {
      navigator.clipboard.writeText(this.invoice)
        .then(() => this.showSnackbar = true)
        .catch(err => console.error('Error while copying to clipboard! Err: ', err))
    }
  },
  computed: {
    show() {
      return this.invoice !== null
    },
    amount() {
      try {
        const decoded = lightningPayReq.decode(this.invoice)
        return parseInt(decoded.millisatoshis / 1e3)
      } catch(err) {
        console.error('Error while trying to decode invoice. err: ', err)
      }
    },
    defaultMessage() {
      return `You are doing that too often. Please wait a few seconds or pay ${this.amount} sats instead.`
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
    }
  }
}
</script>