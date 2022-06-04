<template>
  <v-text-field
    v-model="imageUrl"
    class="mt-3 py-0"
    label="Enter an image URL or select an image file"
    v-debounce:1000ms.lock="onTextChange"
    :loading="imageType === IMAGE_TYPE_URL && isLoadingImage"
    outlined
  >
    <template v-slot:prepend-inner>
      <v-file-input
        v-model="attachment"
        @input="onFileChange"
        @change="onFileChange"
        hide-input
        solo
        class="attachment"
        accept="image/*"
        placeholder="Select an image file">
      </v-file-input>
    </template>
    <template v-slot:append>
      <div>
        <v-btn v-if="imageType === IMAGE_TYPE_FILE_UPLOAD"
          icon
          class="cancel-file"
          color="red"
          @click="cancelFile"
        >
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
        <v-progress-circular v-if="imageType === IMAGE_TYPE_URL && isLoadingImage"
          class="mt-1"
          indeterminate
          :size="20"
          :width="2"
          color="primary"
        >
        </v-progress-circular>
        <v-icon v-if="showCheckmark" color="green">mdi-check</v-icon>
        <v-icon v-if="showErrorAlert" color="red">mdi-alert-circle</v-icon>
      </div>
    </template>
  </v-text-field>
</template>
<script>
import regexMixin from '~/mixins/regex.js'
import { IMAGE_TYPE_FILE_UPLOAD, IMAGE_TYPE_URL } from '~/utils/constants'
export default {
  data() {
    return {
      IMAGE_TYPE_FILE_UPLOAD: IMAGE_TYPE_FILE_UPLOAD,
      IMAGE_TYPE_URL: IMAGE_TYPE_URL,
      imageUrl: null,
      attachment: null,
      isLoadingImage: false,
      isImageUrlValid: null // null means we don't know, true or false express certainty
    }
  },
  mixins: [ regexMixin ],
  methods: {
    onTextChange(text) {
      if (this.imageType === IMAGE_TYPE_FILE_UPLOAD) {
        return this.cancelFile()
      }
      this.attachment = null
      this.isImageUrlValid = null
      if (text === '') {
        return this.$emit('onImageCancelled')
      }
      if (!this.isValidUrlWithProtocol(text)) {
        this.isImageUrlValid = false
        return this.$emit('onImageCancelled')
      }
      if (text) {
        this.isLoadingImage = true
        this.$store.dispatch('discussions/getImageUrl', text)
          .then(isImage => {
            this.isImageUrlValid = isImage
            if (isImage || isImage === null)
              this.onImageSelected()
          })
          .catch(err => {
            // We got an error, but this could still be an image due to cors
            console.error('Error while trying to query image url: ', err)
            this.onImageSelected()
          })
          .finally(() => {
            this.isLoadingImage = false
          })
      }
    },
    onFileChange(e) {
      if (!e || !e.name) return
      this.imageUrl = e.name
      this.onImageSelected()
    },
    cancelFile(e) {
      this.attachment = null
      this.imageUrl = null
      this.$emit('onImageCancelled')
    },
    onImageSelected() {
      let payload = {
        type: this.imageType
      }
      if (this.imageType === this.IMAGE_TYPE_URL) {
        payload.value = this.imageUrl
      } else if (this.imageType === this.IMAGE_TYPE_FILE_UPLOAD) {
        payload.value = this.attachment
      }
      this.$emit('onImageSelected', payload)
    }
  },
  computed: {
    imageType() {
      return this.attachment === null ? this.IMAGE_TYPE_URL : this.IMAGE_TYPE_FILE_UPLOAD
    },
    urlRules() {
      return [
        v => this.isValidUrlWithProtocol(v) || !v || 'Invalid URL',
        v => this.isValidImageFile(v) || !v || 'Not an image URL'
      ]
    },
    showCheckmark() {
      return this.isImageUrlValid === true
    },
    showErrorAlert() {
      return this.isImageUrlValid === false && this.imageUrl !== ''
    }
  }
}
</script>
<style scoped>
.attachment {
  margin-top: -10px;
}
.cancel-file {
  margin-top: -5px;
}
</style>