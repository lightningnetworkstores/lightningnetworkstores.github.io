<template>
  <div class="d-flex flex-column justify-end flex-grow-1">
    <v-tabs
      v-model="tabs"
      fixed-tabs
      icons-and-text
      class="flex-shrink-1"
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
    <v-tabs-items v-model="tabs" class="flex-grow-1 mx-2">
      <v-tab-item style="min-height: 20em">
        <Deposit class="pt-1"/>
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