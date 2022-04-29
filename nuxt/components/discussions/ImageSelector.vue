<template>
  <div>
    <v-layout row>
      <v-flex pl-3 pr-3>
        <v-switch v-model="uploadImage" inset :label="imageLabel" :append-icon="uploadImage ? 'mdi-attachment' : 'mdi-link-variant'"></v-switch>
      </v-flex>
    </v-layout>
    <v-layout row v-if="uploadImage">
      <v-flex pl-3 pr-3>
        <v-file-input
          chips outlined show-size placeholder="Select an image file" :prepend-icon="null">
        </v-file-input>
      </v-flex>
    </v-layout>
    <v-layout row v-if="!uploadImage">
      <v-flex pl-3 pr-3>
        <v-text-field v-model="imageUrl" label="Enter an image URL" outlined/>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      uploadImage: null,
      imageUrl: null
    }
  },
  computed: {
    imageLabel() {
      return this.uploadImage ? 'Upload Image' : 'Enter URL'
    }
  }
}
</script>