<template>
  <v-dialog
    v-model="isOpen"
    @click:outside="$emit('update:isOpen', false)"
    @keydown.esc="$emit('update:isOpen', false)"
    max-width="500px"
  >
    <v-card>
      <v-card-title>Blocked Voting</v-card-title>
      <v-card-text>
        This account cannot vote because our system thinks you might be a throwaway account or not a real person.
      </v-card-text>
      <v-card-text>
        If you think that this is a mistake, please contact our admins at
        <a href="https://twitter.com/bitcoinLNS" target="_blank" rel="noreferrer noopener">Twitter</a> or
        <a href="https://t.me/LNstores" target="_blank" rel="noreferrer noopener">Telegram</a>.  
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close()">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  emits: ['update:isOpen'],
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close(){
      this.amount = null
      this.$emit('update:isOpen', false)
    },
  }
}
</script>