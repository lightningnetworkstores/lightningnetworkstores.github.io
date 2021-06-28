<template>
  <v-carousel
    height="auto"
  >
    <v-carousel-item
      v-for="(media, i) in selectedStore.media.main"
      :key="media.link"
      class="carousel-style lns-carousel"
    >
      <v-sheet height="100%" tile>
        <v-img
          v-if="media.type === 'IMAGE'"
          :src="`${baseURL}thumbnails/${media.link}`"
          @click="handleImageClick(i)"
          class="text-right"
        >
          <v-chip
            v-if="media.homepage && selectedStore.logged"
            color="orange"
            text-color="white"
            class="ma-2"
            :x-large="true"
          >
            <b>Homepage image</b>
          </v-chip>
          <v-chip
            v-if="isNewStore()"
            color="green"
            text-color="white"
            class="ma-2"
          >
            New
          </v-chip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-chip
                v-if="selectedStore.trending > 0"
                color="purple"
                text-color="white"
                v-on="on"
              >
                {{ selectedStore.trending }}%
                <v-icon v-on="on" pr-2 small right>fa-fire</v-icon>
              </v-chip>
            </template>
            <span>Trending score</span>
          </v-tooltip>

          <v-chip
            v-if="hasNewComment"
            color="blue"
            text-color="white"
            class="ma-2"
          >
            New comment
          </v-chip>
        </v-img>
        <iframe
          v-if="media.type === 'VIDEO'"
          class="video-iframe"
          :src="media.link"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
        </iframe>
        <select-home-image-modal
          v-if="logged && media.homepage !== true"
          :store="selectedStore"
          :position="i"
        />
        <edit-store-image
          v-if="logged"
          :store="selectedStore"
          :position="i"
        />
        <delete-image-modal
          v-if="showDelete"
          :store="selectedStore"
          :position="i"
        />
      </v-sheet>
    </v-carousel-item>
    <v-carousel-item
      v-if="logged"
      key="last"
      class="carousel-style lns-carousel"
    >
      <v-sheet height="100%" tile>
        <v-img
          :src="`${baseURL}noimage.png`"
          class="text-right"
        >
        </v-img>
        <edit-store-image
          v-if="selectedStore.logged"
          :store="selectedStore"
          :position="selectedStore.images.number + 1"
        />
      </v-sheet>
    </v-carousel-item>
  </v-carousel>

</template>
<script>
import DeleteImageModal from '~/components/DeleteImageModal'
import EditStoreImage from '~/components/EditStoreImage'
import SelectHomeImageModal from '~/components/SelectHomeImageModal.vue'
export default {
  components: { DeleteImageModal, EditStoreImage, SelectHomeImageModal },
  props: {
    selectedStore: {
      type: Object,
      required: true
    },
    logged: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    handleImageClick(index) {
      this.$emit('imageClicked', index)
    },
    isNewStore() {
      return (
        new Date(this.selectedStore.added * 1000 + 1000 * 60 * 60 * 24 * 8) >
        new Date()
      )
    }
  },
  computed: {
    baseURL() {
      return this.$store.state.baseURL
    },
    hasNewComment() {
      return (
        new Date(this.selectedStore.last_commented + 1000 * 60 * 60 * 24 * 8) >
        new Date()
      )
    },
    showDelete() {
      return this.logged && this.selectedStore.media.main.length > 1
    }
  }
}
</script>
<style scoped lang="scss">
.lns-carousel {
  .v-sheet {
    position: relative;
    max-height: 500px;
  }
  .v-image__image {
    max-height: 500px;
    background-size: 100% 500px;
  }
}
.video-iframe {
  width: 100%;
  height: 495px;
}
@media only screen and (max-width: 600px) {
  .video-iframe {
    height: 310px;
  }
}
</style>