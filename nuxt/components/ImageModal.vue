<template>
  <div class="image-modal">
    <div v-if="images.length > 1">
      <v-carousel v-model="liveImage" hide-delimiters height="auto">
        <v-carousel-item v-for="(imageName, i) in images" :key="imageName">
          <v-img
            :src="`${baseURL}thumbnails/${imageName}`"
            height="100%"
            contain
          >
          </v-img>
        </v-carousel-item>
      </v-carousel>
    </div>
    <div v-else>
      <v-img
        max-height="80vh"
        contain
        :src="`${baseURL}thumbnails/${id}.png`"
      ></v-img>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id', 'images', 'baseURL', 'currentImage'],
  computed: {
    liveImage: {
      get() {
        return this.currentImage
      },
      set(newImage) {
        return newImage
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.image-modal {
  background: white;
}
.image-modal-list {
  height: 80vh;
}
</style>
