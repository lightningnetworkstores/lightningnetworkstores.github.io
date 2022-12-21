<template>
  <v-autocomplete
    v-model="recipient"
    outlined
    :items="suggestions"
    :loading="isLoading"
    :disabled="isSending"
    :search-input.sync="search"
    hide-no-data
    hide-selected
    return-object
    @change="handleChange"
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
        <v-row>
          <v-col>
            <v-list-item-title>{{data.item.text}}</v-list-item-title>
            <v-list-item-subtitle v-html="data.item.name"></v-list-item-subtitle>
          </v-col>
          <v-col class="d-flex justify-end">
            <v-chip
              v-if="!data.item.registered"
              color="orange"
              text-color="white"
              x-small
            >
              unregistered
            </v-chip>
          </v-col>
        </v-row>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>
<script>
const MIN_LENGTH = 4
// If less than this suggestions are obtained from registered users, we
// re-query with the flag 'force' equal to true
const MIN_RESULTS = 1
export default {
  data() {
    return {
      suggestions: [],
      search: null,
      recipient: null,
      search: null,
      isLoading: false,
      isSending: false,
      isSuccess: true,
    }
  },
  methods: {
    handleKeydown(e) {
      this.suggestions = []
      this.recipient = null
    },
    async getUserSuggestions(query, force = false) {
      try {
        let url = `/api/transferpreview?query=${query}&force=${force}`
        let resp = await this.$axios.$get(url)
        return resp.data.results
      } catch (err) {
        console.error('Error from action while fetching suggestions. err: ', err)
        return []
      }
    },
    handleChange(e) {
      this.$emit('userSelected', this.recipient)
    }
  },
  watch: {
    async search(newVal, oldVal) {
      if (this.suggestions.length > 0) return
      if (this.isLoading) return
      if (this.search && this.search.length >= MIN_LENGTH) {
        this.isLoading = true
        try {
          const suggestions = await this.getUserSuggestions(this.search, false)
          this.suggestions = suggestions.map(suggestion => ({
            text: suggestion.handle,
            name: suggestion.name,
            value: suggestion.id,
            image: suggestion.image,
            registered: suggestion.is_registered
          }))
          if (suggestions.length < MIN_RESULTS) {
            this.getUserSuggestions(this.search, true)
              .then(nonRegistered => {
                const updatedSuggestions = [...this.suggestions]
                updatedSuggestions.push(...nonRegistered.map(suggestion => ({
                  text: suggestion.handle,
                  name: suggestion.name,
                  value: suggestion.id,
                  image: suggestion.image,
                  registered: suggestion.is_registered
                })))
                this.suggestions = updatedSuggestions
              })
          }
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
