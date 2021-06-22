<template>
  <div>
    <v-btn
      color="gray"
      dark
      class="edit-image-icon"
      @click="openDialog"
    >
      <v-icon>fa-edit</v-icon>
    </v-btn>
    <v-dialog v-model="showDialog" width="500">
      <v-card>
        <v-card-title class="headline">
          Update Image
        </v-card-title>
        <v-card-subtitle class="mt-2">
          Accepted resources:
        </v-card-subtitle>
        <v-card-text>
          <ul>
            <li><b>Website URL:</b> introduce a webpage of your own website. We will take a printscreen of it.</li>
            <li><b>External image URL:</b> link to a .jpg or .png image</li>
            <li><b>Youtube video:</b> youtube link to the video</li>
          </ul>
        </v-card-text>
        <v-layout row class="mx-3 my-3" justify-center>
          <v-progress-circular
            v-if="isLoading"
            indeterminate
            size="30"
          />
        </v-layout>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    label="Image Url"
                    required
                    :rules="urlRules"
                    v-model="imagePath"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <v-row justify="center">
              <v-col cols="5" sm="5" md="5">
                <v-btn
                  class="ma-2"
                  color="success"
                  @click="updateImage('replace')"
                  >Replace Image</v-btn
                >
              </v-col>
              <v-col cols="5" sm="5" md="5">
                <v-btn
                  class="ma-2"
                  color="success"
                  @click="updateImage('capture')"
                  >Take ScreenShot</v-btn
                >
              </v-col>
            </v-row>
            <v-row justify="center" class="mt-0" v-if="showDelete">
              <v-col cols="5" sm="5" md="5" class="d-flex justify-center">
                <v-btn class="" color="red" @click="updateImage('delete')"
                  >Delete Image</v-btn
                >
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
            Close
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
    storeId: {
      type: Number,
      required: true
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isLoading: false,
      showDialog: false,
      imagePath: '',
      successMessage: '',
      errorMessage: '',
      valid: true,
      urlRules: [(v) => !!v || 'Url is required']
    }
  },
  methods: {
    openDialog() {
      this.showDialog = true
      this.errorMessage = ''
      this.successMessage = ''
      this.imagePath = ''
    },
    updateImage(e) {
      console.log(e, this.imagePath)
      this.successMessage = ''
      this.errorMessage = ''
      let valid = true
      let data = { storeID: this.storeId, position: this.position }
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

</style>