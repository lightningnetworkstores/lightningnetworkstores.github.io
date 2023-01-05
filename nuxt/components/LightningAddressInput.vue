<template>
  <div>
    <v-form>
      <v-text-field
        v-model="address"
        outlined
        dense
        type="email"
        label="Lightning Address"
        hint="Any lightning address. Ex: some-user@lntxbot.com"
        :disabled="isProcessing"
        :rules="addressRules"
      />
      <v-text-field
        v-model="amount"
        outlined
        dense
        type="number"
        label="Amount (sats)"
        hint="Enter an amount in sats"
        :disabled="isProcessing"
        :rules="amountRules"
      />
      <v-text-field
        v-model="comment"
        outlined
        dense
        type="text"
        label="Comment"
        hint="Any comment (optional)"
        :rules="commentRules"
        :disabled="isProcessing"
      />
    </v-form>
    <div class="text-caption font-weight-light">
      Fee: {{ withdrawalFee }} sats
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
import { WithdrawalState } from '~/store/wallet'

const MIN_ADDRESS_LENGTH = 3

export default {
  data() {
    return {
      address: '',
      amount: undefined,
      comment: ''
    }
  },
  mixins: [ regexMixin ],
  methods: {
    async sendPayment() {
      await this.$store.dispatch('wallet/sendPayment', {
        address: this.address,
        amount: parseInt(this.amount),
        comment: this.comment,
        feeAmount: this.withdrawalFee
      })
      await this.$store.dispatch('wallet/getDashboardInfo')
      this.reset()
    },
    reset() {
      this.address = ''
      this.amount = undefined
      this.comment = ''
    }
  },
  computed: {
    withdrawalFee() {
      return Math.ceil(this.amount*0.01)
    },
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
        v => Number.parseInt(v) > 0 || v === undefined || 'Must be a positive number',
        v =>  v <= this.withdrawable || v === undefined || 'Amount is too high'
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
    commentRules() {
      return [
        v =>  v.length <= 32 || v === undefined || 'Description is too long.'
      ]
    },
    ...mapState({
      isProcessing: state => state.wallet.withdrawal.state === WithdrawalState.PROCESSING,
      withdrawable: (state) => {
                const { wallet } = state
                if (!wallet.balance) return 0
                const { balance } = wallet
                return (
                    balance.available -
                    Math.ceil(
                        balance.available *
                            (balance.withdrawal_fee_per_cent / 100)
                    )
                )
            },
    }),
  }
}
</script>