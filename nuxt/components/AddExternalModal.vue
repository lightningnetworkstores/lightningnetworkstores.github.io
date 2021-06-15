<template>
  <div>
    <v-btn icon @click.stop="openDialog()" :disabled="availableOptions.length === 0">
      <v-icon>fa-plus-circle</v-icon>
    </v-btn>
    <v-dialog v-model="showDialog" max-width="500" persistent>
      <v-card>
        <v-card-title>Add External Link</v-card-title>
        <v-alert v-if="serverError" type="error" class="mx-3">
          {{ serverError }}
        </v-alert>
        <v-alert v-if="changed === false" type="warning" class="mx-3">
          External link could not be updated
        </v-alert>
        <v-layout row class="mx-3 my-3" justify-center>
          <v-progress-circular
            v-if="isProcessing"
            indeterminate
            size="30"
          />
        </v-layout>
        <v-layout row class="mx-3 mt-3">
          <v-combobox
            :items="availableOptions"
            :rules="rules"
            v-model="selected"
            label="Property"
            outlined
          />
        </v-layout>
        <v-layout row class="mx-3 mt-3">
          <v-text-field
            label="Field Value"
            v-model="value"
          />
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
            @click="onAddClicked"
            :disabled="formError || isProcessing"
            text
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: ["store"],
  data() {
    return {
      showDialog: false,
      isProcessing: false,
      selected: null,
      options: [
        'git', 'android', 'iphone', 'producthunt', 'trustpilot', 'steam', 'chrome'
      ],
      value: null,
      formError: false,
      serverError: null,
      changed: null
    } 
  },
  methods: {
    openDialog() {
      this.showDialog = true;
    },
    closeDialog() {
      this.serverError = null;
      this.showDialog = false;
      this.formError = false;
    },
    async onAddClicked() {
      const payload = {
        id: this.store.id,
        name: this.selected,
        value: this.value
      }
      this.isProcessing = true;
      const resp = await this.$store.dispatch('addExternalAttribute', payload);
      if (resp.result) {
        this.selected = null;
        this.value = null;
        this.closeDialog();
      } else if (resp.error) {
        this.serverError = resp.error;
      } else {
        this.changed = false;
      }
      this.isProcessing = false;
    }
  },
  computed: {
    rules() {
      return this.options.map(() => {
        return (value) => {
          if (value === null) return true;
          const index = this.options.findIndex(item => item === value)
          if (index !== -1) {
            this.formError = false;
            return true;
          } else {
            this.formError = true;
            return 'Invalid attribute';
          }
        }
      })
    },
    availableOptions() {
      const presentLinks = Object.keys(this.store.external);
      return this.options.filter(item => {
        const index = presentLinks.findIndex(present => present === item);
        return index === -1;
      })
    }
  }
}
</script>