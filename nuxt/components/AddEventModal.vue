<template>
  <div class="add-store-modal">
    <v-btn large block color="white" @click="openDialog">
      <v-icon>mdi-plus</v-icon> Add Event
    </v-btn>

    <!-- Add store modal -->
    <v-dialog
      v-model="showAddDialog"
      max-width="500"
      persistent
      style="overflow-x: hidden"
      scrollable
    >
      <template v-if="showAddDialog">
        <v-card>
          <v-layout v-if="addAlert.message.length">
            <v-flex>
              <v-alert
                :type="addAlert.success ? 'success' : 'error'"
                transition="scale-transition"
                class="mb-0"
              >
                {{ addAlert.message }}
              </v-alert>
            </v-flex>
          </v-layout>
          <Success
            v-if="isSuccess"
            :confirm_title="confirm_title"
            @cancel="cancel"
          />

          <v-card-text class="pa-0 cardContent" v-else>
            <v-card-title class="headline">
              <v-flex grow>Add new event!</v-flex>
              <v-flex shrink v-if="isLoading"
                ><v-progress-circular
                  indeterminate
                  size="20"
                  color="green"
                ></v-progress-circular
              ></v-flex>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="submitAdd" ref="addform" class="mt-2">
                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-text-field
                      v-model="addDialogForm.url"
                      label="URL"
                      hint="eg. https://lightningnetworkstores.com"
                      :rules="[
                        (v) => !!v || 'URL is required',
                        (v) =>
                          /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
                            v
                          ) ||
                          'Enter a valid url eg. https://lightningnetworkstores.com',
                      ]"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-text-field
                      v-model="addDialogForm.title"
                      class="dialogform-name"
                      label="Title"
                      hint="eg. Some Title no longer than 50 characters."
                      :rules="[(v) => !!v || 'Title is required']"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-text-field
                      v-model="addDialogForm.description"
                      class="dialogform-description"
                      label="Description"
                      hint="eg. Some description no longer than 150 characters."
                      :rules="[
                        (v) => !!v || 'Description is required',
                        (v) =>
                          (v && v.length > 6 && v.split(/\b(\s)/).length > 1) ||
                          'Enter a clear description of the store',
                      ]"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-subheader class="pb-4 pl-0"> Duration </v-subheader>
                    <v-slider
                      v-model="addDialogForm.duration"
                      :thumb-size="24"
                      thumb-label="always"
                      :max="maxDuration"
                      :min="minDuration"
                      :rules="[(v) => !!v || 'Duration is required']"
                    ></v-slider>
                  </v-flex>
                </v-layout>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="green darken-1" text @click="cancel">
                    Close
                  </v-btn>

                  <v-btn color="green darken-1" text type="submit">
                    Submit
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
import Success from '@/components/Success.vue'
export default {
  name: 'AddEventModal',
  components: {
    Success,
  },
  props: {
    storeId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      showAddDialog: false,
      addDialogForm: { title: '', description: '', url: '', duration: null },
      addAlert: { message: '', success: true },
      confirm_title: 'Store successfully added.',
      isLoading: false,
      isSuccess: false,
      maxDuration: 24,
      minDuration: 0,
    }
  },
  methods: {
    openDialog() {
      this.isSuccess = false
      this.showAddDialog = true
    },
    cancel() {
      if (this.$refs.addform) {
        this.$refs.addform.reset()
      }
      this.addDialogForm = {}
      this.showAddDialog = false
      this.isSuccess = false
      this.addAlert = { message: '', success: true }
    },

    async submitAdd() {
      if (this.$refs.addform.validate(true)) {
        this.isLoading = true
        this.addAlert = { message: '', success: true }
        this.isSuccess = false
        this.$store
          .dispatch('addEvent', {
            title: this.addDialogForm.title,
            description: this.addDialogForm.description,
            url: this.addDialogForm.url,
            storeID: this.storeId,
            duration: this.addDialogForm.duration,
          })
          .then(
            async (response) => {
              if (response && response.status === 'success') {
                this.confirm_title = response.message
                this.isSuccess = true
                this.addDialogForm = {}
                this.isLoading = false
                this.$store.dispatch('getStore', { id: this.storeId })
              } else {
                this.addAlert.message = response.message
                this.addAlert.success = false
                this.isLoading = false
              }
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
.cardContent {
  max-height: 60vw;
}
</style>
