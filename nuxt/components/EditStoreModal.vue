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
          </v-card-title>
          <v-layout row class="mx-3 my-3" justify-center>
            <v-progress-circular v-if="isLoading" indeterminate size="30" />
          </v-layout>
          <v-card-text>
            <v-form @submit.prevent="submitEdit" ref="editform">
              <v-layout v-for="field in fields" :key="field.name" row>
                <v-flex pl-3 pr-3>
                  <v-textarea v-model="field.value" :label="field.label" :rows="rows" auto-grow>
                  </v-textarea>
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
  props: {
    store: {
      type: Object,
      required: true
    },
    editAttribute: {
      type: [ Object, Array ],
      required: true
    },
    rows: {
      type: Number,
      default: 1
    }
  },
  data() {
    let fields = []
    if (Array.isArray(this.editAttribute)) {
      fields = [...this.editAttribute]
    } else {
      fields.push(this.editAttribute)
    }
    return {
      editAlert: { message: '', success: true },
      showEditDialog: false,
      isLoading: false,
      fields: fields,
    }
  },
  methods: {
    closeDialog() {
      this.$refs.editform.reset()
      this.showEditDialog = false
    },

    submitEdit() {
      this.isLoading = true
      this.$refs.editform.validate()
      const body = {}
      this.fields.forEach((field) => {
        body[field.key] = field.value
      })

      if (this.store.id) {
        this.$store
          .dispatch('addStoreUpdate', {
            id: this.store.id,
            body: body,
          })
          .then(
            (response) => {
              this.$refs.editform.reset()
              this.isLoading = false
              this.showEditDialog = false
              this.closeDialog()
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
