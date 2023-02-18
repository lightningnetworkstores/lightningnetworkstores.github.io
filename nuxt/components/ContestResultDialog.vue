<template>
  <div class="text-center">
    <v-dialog
      v-model="showDialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon large v-bind="attrs" v-on="on">
          <v-icon>mdi-help-circle</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5 lighten-2">
          Contest Result
        </v-card-title>
        <v-card-text>
          Contest result explanation comes here
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="showDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    //TODO: Decide what's needed here
  },
  data() {
    return {
      showDialog: false
    }
  }
}
</script>