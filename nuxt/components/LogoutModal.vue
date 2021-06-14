<template>
  <v-row justify="center">
    <v-dialog
      v-model="enabled"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title>Confirm</v-card-title>
        <v-card-text>Please confirm you want to log out</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="onConfirm"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: ['enabled','onConfirm', 'onCancel']
}
</script>