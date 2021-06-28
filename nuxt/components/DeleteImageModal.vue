<template>
  <div>
    <v-btn
      color="rgba(0,0,0,0.80)"
      dark
      class="edit-image-icon"
      @click.stop="openDialog()"
    >
      <v-icon>fa-trash</v-icon>
    </v-btn>
    <!-- Confirm delete store image modal -->
    <v-dialog v-model="showDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline">
          Please confirm
        </v-card-title>
        <v-layout row class="mx-3 my-3" justify-center>
          <v-progress-circular
            v-if="isLoading"
            indeterminate
            size="30"
          />
        </v-layout>
        <v-alert v-if="error" type="error" class="mx-3">
          {{ error }}
        </v-alert>
        <v-card-text v-if="!error">
          Please confirm you want to remove this image.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" :disabled="error !== null" text @click="confirm">
            Confirm
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
    },
    position: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      showDialog: false,
      isLoading: false,
      error: null
    }
  },
  methods: {
    async confirm() {
      const data = {
        id: this.store.id,
        position: this.position
      };
      this.isLoading = true;
      const result = await this.$store.dispatch('deleteStoreImage', data)
      this.isLoading = false;
      if (result.error) {
        this.error = result.error
      } else {
        this.closeDialog()
      }
    },
    openDialog(){
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
      this.error = null
    }
  }
}
</script>
<style scoped>
.edit-image-icon {
  float: right;
  position: absolute;
  margin: 0 6em 4em;
  z-index: 101;
  bottom: 4px;
  right: 0;
}
</style>