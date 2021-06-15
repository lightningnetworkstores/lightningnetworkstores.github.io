<template>
  <div>
    <v-btn text icon @click.stop="openDialog()">
      <v-icon>fa-trash</v-icon>
    </v-btn>
    <!-- Confirm delete store modal -->
    <v-dialog v-model="showDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline">
          Please confirm
        </v-card-title>
        <v-flex class="corner-loading" v-if="isLoading">
          <v-progress-circular
            indeterminate
            size="20"
            color="green"
          ></v-progress-circular
        ></v-flex>
        <v-card-text>
          Please confirm you want to remove this external link.
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
  props: ["store", "field"],
  data() {
    return {
      showDialog: false,
      isLoading: false
    } 
  },
  methods: {
    async confirm() {
      const data = {
        id: this.store.id,
        field: this.field
      };
      this.isLoading = true;
      await this.$store.dispatch('deleteStoreField', data)
      this.isLoading = false;
      this.closeDialog();
    },
    openDialog(){
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
    }
  }
}
</script>
<style scoped>
</style>