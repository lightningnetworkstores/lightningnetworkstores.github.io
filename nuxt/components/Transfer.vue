<template>
  <div class="ma-2">
    <v-autocomplete
      v-model="recipient"
      outlined
      :items="suggestions"
      :loading="isLoading"
      :search-input.sync="search"
      :disabled="isSending"
      hide-no-data
      hide-selected
      return-object
      @keydown="handleKeydown"
      label="Enter user handle or name"
    >
      <template v-slot:selection="data">
        <v-chip
          v-bind="data.attrs"
          :input-value="data.selected"
        >
          <v-avatar left>
            <v-img :src="data.item.image"></v-img>
          </v-avatar>
          <div> {{ data.item.text }} </div>
        </v-chip>
      </template>
      <template v-slot:item="data">
        <v-list-item-avatar>
          <v-img :src="data.item.image"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.text"></v-list-item-title>
          <v-list-item-subtitle v-html="data.item.name"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-autocomplete>
    <v-text-field
      v-model="amount"
      outlined
      type="number"
      label="Amount (sats)"
      :rules="amountRules"
      :disabled="isSending"
    >
    </v-text-field>
    <v-progress-linear v-if="isSending" class="my-2"></v-progress-linear>
    <v-btn
      :disabled="disableTransfer"
      color="primary"
      @click="onTransfer"
    >
      Transfer
    </v-btn>
    <v-snackbar v-model="isSuccess" timeout="1e3">
      <v-icon color="green" class="mr-2 pr-2">mdi-check-circle-outline</v-icon>
      Success!
      <template v-slot:action="{ attrs }">
        <v-btn
          color="green"
          text
          v-bind="attrs"
          @click="isSuccess = null"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapState } from 'vuex'
const MIN_LENGTH = 4
export default {
  data() {
    return {
      amount: null,
      recipient: null,
      suggestions: [],
      search: null,
      isLoading: false,
      isSending: false,
      isSuccess: true,
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
    handleKeydown(e) {
      this.suggestions = []
      this.recipient = null
    },
    async onTransfer() {
      this.isSending = true
      const result = await this.$store.dispatch('wallet/transfer', {
        to: this.recipient.value,
        amount: +this.amount
      })
      this.isSending = false
      if (result) {
        this.isSuccess = true
        this.amount = null
        this.suggestions = []
        this.$store.dispatch('wallet/getDashboardInfo')
      }
    }
  },
  watch: {
    async search(newVal, oldVal) {
      if (this.suggestions.length > 0) return
      if (this.isLoading) return
      if (this.search && this.search.length >= MIN_LENGTH) {
        this.isLoading = true
        try {
          const suggestions = await this.$store
            .dispatch('wallet/getUserSuggestions', this.search)
          this.suggestions = suggestions.map(suggestion => ({
            text: suggestion.handle,
            name: suggestion.name,
            value: suggestion.id,
            image: suggestion.image
          }))
        } catch(err) {
          console.error('Error form component while fetching suggestions: ', err)
        } finally {
          this.isLoading = false
        }
      }
    }
  },
  computed: {
    disableTransfer() {
      return (+this.amount) <= 0 ||
        (+this.amount) > this.balance.available ||
        this.recipient === null ||
        this.isLoading ||
        this.isSending
    },
    ...mapState('wallet', ['balance'])
  }
}
</script>