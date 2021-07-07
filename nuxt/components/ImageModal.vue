<template>
  <div class="image-modal">
    <div v-if="mediaArray.length > 1">
      <v-carousel v-model="liveImage" hide-delimiters height="auto">
        <v-carousel-item v-for="(media, i) in mediaArray" :key="i">
          <v-img
            v-if="media.type === 'IMAGE'"
            :src="`${baseURL}thumbnails/${media.link}`"
            height="100%"
            contain
          >
          </v-img>
          <iframe
            v-if="media.type === 'VIDEO'"
            class="video-iframe"
            :src="media.link"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
          </iframe>
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
  props: ['id', 'mediaArray', 'baseURL', 'selectedMedia'],
  computed: {
    liveImage: {
      get() {
        return this.selectedMedia
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
.video-iframe {
  width: 100%;
  height: 495px;
}
</style>
