<template>
  <div>
    <v-btn icon fab @click="openDialog">
      <v-icon>mdi-cog</v-icon>
    </v-btn>
    <v-dialog v-model="isOpen" max-width="500" persistent>
      <v-card>
        <v-card-title>Settings</v-card-title>
        <v-divider></v-divider>
        <v-alert v-if="serverError" type="error" class="mx-3 my-2">
          {{ serverError }}
        </v-alert>
        <v-layout row class="mx-3 my-3" justify-center>
          <v-progress-circular
            v-if="isProcessing"
            color="orange"
            indeterminate
            size="30"
          />
        </v-layout>
        <v-layout row class="mx-3 mt-3">
          <v-col>
            <div class="mx-1 h5">Email</div>
            <v-text-field v-model="form.email" type="email"/>
            <div class="mx-1 h5">Notifications</div>
            <!-- <v-checkbox
              v-model="form.notifications.features"
              label="New Features">
            </v-checkbox> -->
            <v-checkbox
              v-model="form.notifications.reviews"
              label="New Reviews">
            </v-checkbox>
            <!-- <v-divider></v-divider>
            <div class="mx-1 mt-2 h5">Accepted</div>
            <v-checkbox
              v-model="form.accepted.BTC"
              label="BTC">
            </v-checkbox>
            <v-checkbox
              v-model="form.accepted.BTCLN"
              label="BTC-LN">
            </v-checkbox> -->
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
  props: {
    store: {
      type: Object,
      required: true
    }
  },
  data() {
    const {
      notifications,
      isFirstTime
    } = this.$store.state.selectedStoreSettings
    return {
      isOpen: isFirstTime,
      isProcessing: false,
      form: {
        email: this.store.email,
        notifications: {
          features: false,
          reviews: notifications.new_reviews
        },
        accepted: {
          BTC: false,
          BTCLN: true
        }
      },
      serverError: null
    }
  },
  methods: {
    openDialog() {
      this.isOpen = true
    },
    closeDialog() {
      this.isOpen = false
      this.serverError = null
    },
    onSaveClicked() {
      const payload = {...this.form, storeId: this.store.id }
      this.isProcessing = true
      this.$store.dispatch('updateSettings', payload)
        .then(result => {
          if (result.error) {
            this.serverError = result.error
          }
          if (result === 'success') {
            this.closeDialog()
          }
        })
        .finally(() => this.isProcessing = false)
    }
  },
}
</script>