<template>
  <div class="edit-store-modal">
    <v-btn text icon color="grey darken-2" @click.stop="showEditDialog = true">
      <v-icon>fa-edit</v-icon>
    </v-btn>
    <!-- Edit store modal -->
    <v-dialog v-model="showEditDialog" max-width="500" persistent>
      <v-form @submit.prevent="submitEdit" ref="editform">
        <v-card>
          <v-card-title class="headline">
            Edit&nbsp;{{ store.name }}
            <v-flex class="corner-loading" v-if="isLoading"
              ><v-progress-circular
                indeterminate
                size="20"
                color="green"
              ></v-progress-circular
            ></v-flex>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitEdit" ref="editform">
              <v-layout row>
                <v-flex pl-3 pr-3>
                  <v-text-field
                    v-model="value"
                    :label="editAttribute.label"
                  >{{ value }}</v-text-field>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="closeDialog">
              Cancel
            </v-btn>
            <v-btn color="green darken-1" text type="submit"> Submit </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['store', 'editAttribute'],
  data() {
    return {
      editAlert: { message: '', success: true },
      showEditDialog: false,
      isLoading: false,
      property: this.editAttribute.key,
      value: this.editAttribute.value,
    }
  },
  methods: {
    closeDialog() {
      this.$refs.editform.reset()
      this.showEditDialog = false
    },

    submitEdit() {
      this.$refs.editform.validate()
      if (
        this.store.id &&
        this.property &&
        this.value
      ) {
        this.isLoading = false
        const body = {};
        body[this.property] = this.value;
        this.$store
          .dispatch('addStoreUpdate', {
            id: this.store.id,
            body: body
          })
          .then(
            (response) => {
              this.editAlert.message = response
              if (response.includes('The request was successfully recorded')) {
                this.editAlert.success = 'success'
                this.editDialogForm = { property: '' }
                this.$refs.editform.reset()
              } else {
                this.editAlert.success = 'error'
              }
              this.isLoading = false
              this.showEditDialog = false;
            },
            (error) => {
              console.error(error)
              this.isLoading = false
            }
          )
      }
    },
  },
}
</script>

<style scoped lang="scss">
.corner-loading {
  position: absolute;
  right: 10px;
  top: 4px;
}
</style>
