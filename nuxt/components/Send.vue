<template>
  <div>
    <v-btn icon large color='blue' dark class="ma-4" @click="showDialog = true">
      <v-icon>mdi-arrow-up</v-icon>
      Send
    </v-btn>
    <v-dialog
      v-model="showDialog"
      max-width="500"
      persistent
      style="overflow-x: hidden"
      scrollable
    >
      <v-card>
        <v-card-title>
          Send
        </v-card-title>
        <v-textarea
          v-model="recipientData"
          class="ma-4"
          outlined
          :rows="rowsCount"
          hint="Internal transfers are free"
          label="Enter invoice or user handle"
        >
        </v-textarea>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="showDialog = false">
            Close
          </v-btn>
          <v-btn color="green darken-1" text type="submit">
            Send
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
      recipientData: '',
      showDialog: false
    }
  },
  methods: {
    handleChange(e) {
      console.log('handleChange.e: ', e)
    }
  },
  computed: {
    rowsCount() {
      return parseInt(this.recipientData.length / 50)
    }
  }
}
</script>