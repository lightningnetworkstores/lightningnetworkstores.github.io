<template>
  <v-text-field
    v-model="imageUrl"
    class="mt-3 py-0"
    label="Enter an image URL"
    @input="onTextChange"
    :rules="urlRules"
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
    <template v-slot:append v-if="imageType === IMAGE_TYPE_FILE_UPLOAD">
      <v-btn icon class="cancel-file" color="red" @click="cancelFile">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
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
      attachment: null
    }
  },
  mixins: [ regexMixin ],
  methods: {
    onTextChange(e) {
      this.attachment = null
      if (this.isValidImageFile(this.imageUrl)) {
        this.onImageSelected()
      }
    },
    onFileChange(e) {
      if (!e.name) return
      this.imageUrl = e.name
      this.onImageSelected()
    },
    cancelFile(e) {
      this.attachment = null
      this.imageUrl = null
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
        v => this.isValidUrl(v) || !v || 'Invalid URL',
        v => this.isValidImageFile(v) || !v || 'Not an image URL'
      ]
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