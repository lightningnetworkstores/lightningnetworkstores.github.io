<template>
  <div class="d-flex flex-column justify-space-between flex-grow-1">
    <v-btn-toggle v-model="mode" class="mb-2">
       <v-tooltip v-if="hasWebLn" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="blue">fa-brands fa-chrome</v-icon>
            </v-btn>
          </template>
          <span>Browser Wallet</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="blue">fa-at</v-icon>
            </v-btn>
          </template>
          <span>Lightning Address</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="blue">fa-solid fa-qrcode</v-icon>
            </v-btn>
          </template>
          <span>Invoice</span>
        </v-tooltip>
      </v-btn-toggle>
      <web-l-n-withdraw v-if="mode === hasWebLn - 1"/>
      <lightning-address-input v-if="mode === hasWebLn+0"/>
      <invoice-input v-if="mode === hasWebLn+1"/>
  </div>
</template>
<script>
import InvoiceInput from '@/components/InvoiceInput.vue'
import LightningAddressInput from '@/components/LightningAddressInput.vue'
import WebLNWithdraw from '@/components/WebLNWithdraw.vue'

export default {
  components: {
    InvoiceInput,
    LightningAddressInput,
    WebLNWithdraw,
  },
  data() {
    return {
      mode: 0,
    }
  },
  computed: {
    hasWebLn() {
      try {
        return window.webln ? true : false
      } catch {
        // this should never happen in a browser but better than crash
        return false
      }
    }
  }
}
</script>