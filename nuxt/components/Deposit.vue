<template>
  <div class="ma-2" style="min-height: 15em">
    <v-text-field
      v-model="amount"
      label="Amount (sats)"
      outlined
      type="number"
    >
    </v-text-field>
    <v-btn color="primary">Generate Invoice</v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {
      amount: null
    }
  }
}
</script>