<template>
  <div class="ma-2">
    <v-textarea
      v-model="invoice"
      outlined
      :rows="7"
      hint="Routing fees will be deducted from your balance"
      label="Enter LN invoice"
    />
    <v-btn color="primary">Withdraw</v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {
      invoice: null
    }
  }
}
</script>