<template>
  <div class="ma-2">
    <user-search @userSelected="handleUserSelected"/>
    <v-text-field
      v-model="amount"
      outlined
      type="number"
      label="Amount (sats)"
      :rules="amountRules"
    >
    </v-text-field>
    <!-- <v-progress-linear v-if="isSending" class="my-2"></v-progress-linear> -->
    <v-btn
      :disabled="disableTransfer"
      color="primary"
      @click="onTransfer"
    >
      Transfer
    </v-btn>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      amount: null,
      recipient: null,
      amountRules: [
        v => {
          if (v === null) return true
          return parseInt(v) > 0 || 'Value must be positive'
        },
        v => {
          if (v === null) return true
          if (this.balance && this.balance.available) {
            return this.balance.available >= parseInt(this.amount) || 'Not enough balance'
          }
          return true
        }
      ]
    }
  },
  methods: {
    async onTransfer() {
      const result = await this.$store.dispatch('wallet/transfer', {
        to: this.recipient.value,
        amount: +this.amount
      })
      if (result) {
        this.$store.dispatch('updateBalance', -1 * parseInt(this.amount))
        this.amount = null
      }
    },
    handleUserSelected(recipient) {
      this.recipient = recipient
    }
  },
  computed: {
    disableTransfer() {
      return (+this.amount) <= 0 ||
        (+this.amount) > this.balance.available ||
        !this.recipient
    },
    ...mapState('wallet', ['balance'])
  }
}
</script>