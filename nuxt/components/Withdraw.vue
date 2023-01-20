<template>
  <div class="d-flex flex-column justify-space-between">
    <v-btn-toggle v-model="mode" class="mb-2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="blue">fa-solid fa-qrcode</v-icon>
            </v-btn>
          </template>
          <span>Invoice</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="blue">fa-at</v-icon>
            </v-btn>
          </template>
          <span>Lightning Address</span>
        </v-tooltip>
      </v-btn-toggle>
      <invoice-input v-if="mode === 0"/>
      <lightning-address-input v-if="mode === 1"/>
  </div>
</template>
<script>
import InvoiceInput from '@/components/InvoiceInput.vue'
import LightningAddressInput from '@/components/LightningAddressInput.vue'

export default {
  components: {
    InvoiceInput,
    LightningAddressInput
  },
  data() {
    return {
      mode: 0,
    }
  }
}
</script>