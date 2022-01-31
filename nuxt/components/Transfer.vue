<template>
  <div class="ma-2">
    <v-text-field
      v-model="amount"
      outlined
      label="Amount (sats)"
    >
    </v-text-field>
    <v-text-field
      v-model="recipient"
      outlined
      label="Enter user handle or name"
    >
    </v-text-field>
    <v-btn color="primary">Transfer</v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {
      amount: null,
      recipient: ''
    }
  }
}
</script>