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
      <div class="d-flex">
        <v-btn icon class="ma-3" @click="onCopyClicked">
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
      <v-btn
        :disabled="!isValid"
        @click="getInvoice"
        color="primary"
      >
        Generate Invoice
      </v-btn>
    </v-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isValid: false,
      amount: null
    }
  },
  methods: {
    getInvoice() {
      this.$store.dispatch('wallet/getInvoice', this.amount)
    },
    onCopyClicked(e) {
      navigator.clipboard.writeText(this.invoice)
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
      return this.$vuetify.breakpoint.name === 'xs' ? '11em' : '8em'
    },
    hasInvoice() {
      return this.invoice !== null
    },
    ...mapState('wallet',['invoice'])
  }
}
</script>