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
              <v-layout v-for="field in fields" :key="field.name" row>
                <v-flex pl-3 pr-3>
                  <v-text-field
                    v-model="field.value"
                    :label="field.label"
                  >
                  {{ field.value }}
                  </v-text-field>
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
    let fields = [];
    if (Array.isArray(this.editAttribute)) {
      fields = [...this.editAttribute];
    } else {
      fields.push(this.editAttribute)
    }
    return {
      editAlert: { message: '', success: true },
      showEditDialog: false,
      isLoading: false,
      fields: fields
    }
  },
  methods: {
    closeDialog() {
      this.$refs.editform.reset()
      this.showEditDialog = false
    },

    submitEdit() {
      this.$refs.editform.validate()
      const body = {};
      this.fields.forEach(field => {
        body[field.key] = field.value
      });

      if (this.store.id) {
        this.isLoading = false
        this.$store
          .dispatch('addStoreUpdate', {
            id: this.store.id,
            body: body
          })
          .then(
            (response) => {
              this.$refs.editform.reset()
              this.isLoading = false
              this.showEditDialog = false;
              this.closeDialog();
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
