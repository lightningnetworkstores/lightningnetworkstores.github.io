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
                  <v-combobox
                    v-model="editDialogForm.property"
                    item-text="name"
                    item-value="prop"
                    label="Property"
                    :items="editDialogProperties"
                    return-object
                  ></v-combobox>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex pl-3 pr-3>
                  <v-text-field
                    :value="
                      editDialogForm.property && editDialogForm.property.prop
                        ? store[editDialogForm.property.prop]
                        : ''
                    "
                    label="Current value"
                    disabled
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex pl-3 pr-3>
                  <v-text-field
                    v-model="editDialogForm.value"
                    label="Value"
                    :hint="
                      editDialogForm.property && editDialogForm.property.prop
                        ? hints[editDialogForm.property.prop]
                        : ''
                    "
                    :rules="[(v) => !!v || 'Value is required']"
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex pl-3 pr-3>
                  <v-checkbox
                    v-model="editDialogForm.askOwner"
                    label="Ask store owner for approval (email will be sent to store owner)"
                  ></v-checkbox>
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
  props: ['store'],
  data() {
    return {
      editAlert: { message: '', success: true },

      showEditDialog: false,
      isLoading: false,
      editDialogProperties: [
        { name: 'Name', prop: 'name' },
        { name: 'Description', prop: 'description' },
        { name: 'URL', prop: 'href' },
        { name: 'Node URI', prop: 'uri' },
        { name: 'Sector', prop: 'sector' },
        { name: 'Digital goods', prop: 'digital_goods' },
        { name: 'Reddit URL', prop: 'reddit' },
        { name: 'Facebook URL', prop: 'facebook' },
        { name: 'Twitter URL', prop: 'twitter' },
      ],
      editDialogForm: { property: '', askOwner: true },

      hints: {
        digital_goods:
          '"No, goods only in-store" or "No, goods shipped" or "yes"',
        uri:
          'e.g. 03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f@34.239.230.56:9735',
        href: 'e.g. https://example.com',
        sector:
          'Lower case and without spaces around the &: e.g. vps&web hosting',
        name: 'Some new name no longer than 50 characters.',
        description: 'Some new description not longer than 150 characters.',
        reddit: 'e.g. https://reddit.com/user/someuser',
        facebook: 'e.g. https://facebook.com/somebody',
        twitter: 'e.g. https://twitter.com/somebody',
      },
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
        this.editDialogForm.property.prop &&
        this.editDialogForm.value
      ) {
        this.isLoading = false
        this.$store
          .dispatch('addStoreUpdate', {
            id: this.store.id,
            field: this.editDialogForm.property.prop,
            value: this.editDialogForm.value,
            askOwner: this.editDialogForm.askOwner,
          })
          .then(
            (response) => {
              this.editAlert.message = response
              if (response.includes('The request was successfully recorded')) {
                this.editAlert.success = 'success'
                this.editDialogForm = { property: '', askOwner: true }
                this.$refs.editform.reset()
              } else {
                this.editAlert.success = 'error'
              }
              this.isLoading = false
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
