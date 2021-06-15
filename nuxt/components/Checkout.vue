<template>
  <div class="text-center">
    <v-row class="justify-center mt-3" v-show="warningMessage">
      <v-alert border="left" colored-border type="warning" elevation="2">{{
        warningMessage
      }}</v-alert>
    </v-row>
    <v-layout row class="ma-0">
      <v-flex pa-3 class="text-center"
        ><h3>{{ satoshi }} sat</h3></v-flex
      >
    </v-layout>
    <v-layout row class="ma-0">
      <v-flex pl-3 pr-3 class="text-center"
        ><qrcode-vue
          class="qrcode"
          size="300"
          :value="paymentRequest"
        ></qrcode-vue
      ></v-flex>
    </v-layout>

    <v-layout row class="ma-0">
      <v-flex pl-3 pr-3>
        <v-text-field
          :value="paymentRequest"
          label="Invoice"
          hint=""
          append-icon="fa-copy"
          type="text"
          id="paymentrequest"
          ref="paymentrequestfield"
          @click:append="copy"
        ></v-text-field
      ></v-flex>
    </v-layout>
    <v-layout row class="ma-0">
      <v-flex pl-3 pr-3 class="text-center">
        <a :href="'lightning:' + paymentRequest" class="link-button"
          >Open in wallet</a
        >
      </v-flex>
    </v-layout>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="green darken-1" text @click="closeModal"> Cancel </v-btn>
    </v-card-actions>
  </div>
</template>
<script>
export default {
  name: 'Checkout',
  props: {
    paymentRequest: {
      type: String,
      default: '',
    },
    warningMessage: {
      type: String,
      default: '',
    },
    satoshi: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    copy() {
      // let input = document.getElementById('paymentrequest')!.focus()
      this.$refs.paymentrequestfield.focus()
      document.execCommand('SelectAll')
      document.execCommand('copy')
    },
    closeModal() {
      this.$emit('cancel')
    },
  },
}
</script>
