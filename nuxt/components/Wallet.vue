<template>
  <div class="d-flex flex-column justify-space-between">
    <v-tabs
      v-model="tabs"
      fixed-tabs
      icons-and-text
    >
      <v-tab>
        Deposit
        <v-icon>mdi-arrow-down</v-icon>
      </v-tab>
      <v-tab>
        Transfer
        <v-icon>mdi-transfer</v-icon>
      </v-tab>
      <v-tab>
        Withdraw
        <v-icon>mdi-arrow-up</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item style="min-height: 20em">
        <Deposit class="pt-1"/>
        <iframe src="https://widget.fixedfloat.com/?to=BTCLN&amp;lockReceive=true&amp;lockType=true&amp;hideType=true&amp;lockAmount=true&amp;toAmount=0.001" allowtransparency="true" style="min-height: 600px; width: 100%; border: none;"></iframe>
      </v-tab-item>
      <v-tab-item style="min-height: 20em">
        <Transfer class="pt-1"/>
      </v-tab-item>
      <v-tab-item style="min-height: 20em">
        <Withdraw class="pt-1"/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabs: null
    }
  }
}
</script>