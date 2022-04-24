<template>
  <div>
    <v-btn icon class="ma-3" @click="showDialog = true">
      <v-icon>mdi-qrcode-scan</v-icon>
    </v-btn>
    <v-dialog
      v-model="showDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title>
          Invoice
        </v-card-title>
        <v-card-text>
          Scan this invoice with a lightning enabled wallet
        </v-card-text>
        <div class="d-flex">
          <v-spacer></v-spacer>
          <qrcode-vue
            :value="invoice"
            :size="$vuetify.breakpoint.name === 'xs' ? 240 : 300"
          />
          <v-spacer></v-spacer>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="showDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showDialog: false
    }
  },
  props: {
    invoice: {
      type: String,
      required: true
    }
  }
}
</script>