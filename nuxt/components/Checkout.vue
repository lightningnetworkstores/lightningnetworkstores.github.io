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
          :size="$vuetify.breakpoint.name === 'xs' ? 240 : 300"
          :value="paymentRequest"
        ></qrcode-vue
      ></v-flex>
    </v-layout>

    <v-layout row class="ma-0">
      <v-card-text @click="copy" class="text-caption mt-3" ref="paymentrequestfield">
        {{ paymentRequest }}
      </v-card-text>
    </v-layout>
    <v-layout row justify-center align-center class="mb-3">
      <v-btn icon @click="copy">
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
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
      navigator.clipboard.writeText(this.paymentRequest)
        .catch(err => console.error('Error while copying to clipboard! Err: ', err))
    },
    closeModal() {
      this.$emit('cancel')
    },
  },
}
</script>
