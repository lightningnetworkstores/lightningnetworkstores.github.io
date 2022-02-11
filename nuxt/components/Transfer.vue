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
  }
}
</script>