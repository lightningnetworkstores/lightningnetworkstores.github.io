<template>
  <div>
    <v-btn icon fab @click="openDialog">
      <v-icon>mdi-cog</v-icon>
    </v-btn>
    <v-dialog v-model="isOpen" max-width="500" persistent>
      <v-card>
        <v-card-title>Settings</v-card-title>
        <v-divider></v-divider>
        <v-layout row class="mx-3 mt-3">
          <v-col>
            <div class="mx-1 h5">Notifications</div>
            <v-checkbox
              v-model="form.notifications.features"
              label="New Features">
            </v-checkbox>
            <v-checkbox
              v-model="form.notifications.reviews"
              label="New Reviews">
            </v-checkbox>
            <v-divider></v-divider>
            <div class="mx-1 mt-2 h5">Accepted</div>
            <v-checkbox
              v-model="form.accepted.BTC"
              label="BTC">
            </v-checkbox>
            <v-checkbox
              v-model="form.accepted.BTCLN"
              label="BTC-LN">
            </v-checkbox>
          </v-col>
        </v-layout>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green"
            @click="closeDialog"
            :disabled="isProcessing"
            text
          >
            Cancel
          </v-btn>
          <v-btn
            color="green"
            @click="onSaveClicked"
            :disabled="isProcessing"
            text
          >
            Save
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
      isOpen: false,
      isProcessing: false,
      form: {
        notifications: {
          features: true,
          reviews: false
        },
        accepted: {
          BTC: false,
          BTCLN: true
        }
      }
    }
  },
  methods: {
    openDialog() {
      this.isOpen = true
    },
    closeDialog() {
      this.isOpen = false
    },
    onSaveClicked() {
      //TODO: Implement this
    }
  }
}
</script>