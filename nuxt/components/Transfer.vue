<template>
  <div class="ma-2">
    <v-text-field
      v-model="amount"
      outlined
      type="number"
      label="Amount (sats)"
    >
    </v-text-field>
    <v-autocomplete
      v-model="recipient"
      outlined
      :items="suggestions"
      :loading="isLoading"
      :search-input.sync="search"
      hide-no-data
      hide-selected
      return-object
      @keydown="handleKeydown"
      label="Enter user handle or name"
    >
    </v-autocomplete>
    <v-btn color="primary">Transfer</v-btn>
  </div>
</template>
<script>
const MIN_LENGTH = 4
export default {
  data() {
    return {
      amount: null,
      recipient: '',
      suggestions: [],
      search: null,
      isLoading: false
    }
  },
  methods: {
    handleKeydown(e) {
      this.suggestions = []
      this.recipient = null
    },
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
            value: suggestion.id
          }))
        } catch(err) {
          console.error('Error form component while fetching suggestions: ', err)
        } finally {
          this.isLoading = false
        }
      }
    }
  }
}
</script>