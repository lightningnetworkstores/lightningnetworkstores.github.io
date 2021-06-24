<template>
  <div>
    <v-btn
      color="rgba(0,0,0,0.80)"
      dark
      class="edit-image-icon"
      @click="openDialog"
    >
      <v-icon>fa-edit</v-icon>
    </v-btn>
    <v-dialog v-model="showDialog" width="500">
      <v-card>
        <v-card-title class="headline">
          Update Media
        </v-card-title>
        <v-card-subtitle class="mt-2">
          Accepted resources:
        </v-card-subtitle>
        <v-card-text>
          <ul>
            <li><b>Website URL:</b> introduce a webpage of your own website. We will take a printscreen of it.</li>
            <li><b>External image URL:</b> link to a .jpg or .png image</li>
            <li><b>Youtube Vide:</b> youtube link to the video</li>
          </ul>
        </v-card-text>
        </v-layout>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    label="Media URL"
                    required
                    :rules="urlRules"
                    v-model="imagePath"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <v-row justify="center">
              <iframe
                v-if="mediaType === 'youtube'"
                width="560"
                height="315"
                :src="previewURL"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
              </iframe>
              <v-sheet v-else-if="mediaType === 'image'" class="d-flex justify-center">
                <v-img
                  :src="previewURL"
                  width="450"
                  min-height="300"
                />
              </v-sheet>
              <v-sheet v-else color="white" elevation="2" height="310" width="560">
              </v-sheet>
            </v-row>
            <v-row>
              <v-progress-linear
                v-if="isLoading"
                indeterminate
              />
            </v-row>
            <v-row justify="center">
              <v-col cols="5" sm="5" md="5">
                <v-btn
                  v-if="!isMediaCorrect"
                  :disabled="imagePath === ''"
                  class="ma-2 preview-button"
                  @click="loadImagePreview"
                >
                  Load Preview
                </v-btn>
                <v-btn
                  v-else
                  class="ma-2 preview-button"
                  @click="resetImagePreview"
                >
                  Clear
                </v-btn>
              </v-col>
            </v-row>
            <v-row justify="center" class="mt-0" v-if="position != null">
              <v-col cols="12" sm="12" md="12" class="d-flex justify-center">
                <v-alert type="success" v-if="successMessage">{{
                  successMessage
                }}</v-alert>
                <v-alert type="error" v-if="errorMessage">{{
                  errorMessage
                }}</v-alert>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" :disabled="!isMediaCorrect" text @click="showDialog = false">
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
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mediaType: null,
      isLoading: false,
      showDialog: false,
      imagePath: '',
      successMessage: '',
      errorMessage: '',
      valid: true,
      urlRules: [(v) => !!v || 'Url is required'],
      previewURL: null
    }
  },
  computed: {
    isMediaCorrect() {
      return this.previewURL !== null && (this.mediaType === 'youtube' || this.mediaType === 'image')
    }
  },
  methods: {
    openDialog() {
      this.showDialog = true
      this.errorMessage = ''
      this.successMessage = ''
      this.imagePath = ''
    },
    async loadImagePreview() {
      this.isLoading = true
      const data = { store: this.store, imagePath: this.imagePath }
      const preview = await this.$store.dispatch('loadImagePreview', data)
      if (!preview.error) {
        this.mediaType = preview.type
        this.previewURL = preview.url
      }
      this.isLoading = false
    },
    resetImagePreview() {
      this.mediaType = null
      this.previewURL = null
      this.imagePath = ''
    },
    updateImage(e) {
      console.log(e, this.imagePath)
      this.successMessage = ''
      this.errorMessage = ''
      let valid = true
      let data = { storeID: this.store.id, position: this.position }
      if (e == 'capture') {
        data.capture = true;
        data.source = this.imagePath
        if (this.imagePath == '') {
            valid = false
            this.$refs.form.validate()
        }
      }
      if (e == 'delete') {
        data.delete = true
      }
      if (e == 'replace') {
        data.update = true
        data.source = this.imagePath
        if (this.imagePath == '') {
          valid = false
          this.$refs.form.validate()
        }
      }
      if (valid) {
        this.isLoading = true
        this.$store
          .dispatch('updateImage', data)
          .then((response) => {
            if (response.data.status == 'success') {
              this.successMessage = response.data.message
            }
            if (response.data.status == 'fail') {
              this.errorMessage = response.data.message
            }
            this.isLoading = false
          })
          .catch((error) => {
            console.log(error)
            const { response } = error
            if (response.data.status == 'fail') {
              this.errorMessage = response.data.message
            }
            this.isLoading = false
          })
      }
    },
  }
}
</script>
<style scoped>
.edit-image-icon {
  float: right;
  position: absolute;
  margin: 0 0.5em 0;
  z-index: 101;
  bottom: 4px;
  right: 0;
}
.preview-button {
  width: 12em;
}
</style>