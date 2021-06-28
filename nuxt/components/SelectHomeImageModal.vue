<template>
  <div>
    <v-btn
      color="rgba(0,0,0,0.80)"
      dark
      class="edit-image-icon"
      @click.stop="openDialog()"
    >
      <v-icon>fa-home</v-icon>
    </v-btn>
    <!-- Confirm set store image as home modal -->
    <v-dialog v-model="showDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline">
          Please confirm
        </v-card-title>
        <v-layout row class="mx-3 my-3" justify-center>
          <v-progress-circular
            v-if="isLoading"
            indeterminate
            color="primary"
            size="30"
          />
        </v-layout>
        <v-alert v-if="error" type="error" class="mx-3">
          {{ error }}
        </v-alert>
        <v-card-text>
          Please confirm you want to set this image as home.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="confirm">
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
    position: {
      type: Number,
      required: true
    },
    store: {
      type: Object,
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
    openDialog() {
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
      this.error = null
    },
    async confirm() {
      this.error = null
      const data = {
        position: this.position,
        storeID: this.store.id
      }
      this.isLoading = true
      const resp = await this.$store.dispatch('setHomeImage', data)
      if (resp.message) {
        this.showDialog = false
      }
      if (resp.error) {
        this.error = resp.error
      }
      this.isLoading = false
    }
  }
}
</script>
<style scoped>
.edit-image-icon {
  float: right;
  position: absolute;
  margin: 0 11.5em 0;
  z-index: 101;
  bottom: 4px;
  right: 0;
}
.preview-button {
  width: 12em;
}
</style>