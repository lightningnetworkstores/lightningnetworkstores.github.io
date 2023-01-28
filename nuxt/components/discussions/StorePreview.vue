<template>
  <v-sheet rounded outlined class="mr-1" height="100">
    <div class="d-flex">
      <v-img
        @click="() => handleInternalLink(store.rooturl)"
        :src="`${baseURL}thumbnails/${store.id}.jpg`"
        height="99"
        max-width="100"
      />
      <div @click="() => handleInternalLink(store.rooturl)">
        <div class="text-subtitle-2 mx-2 my-1">
          <a :href="`${store.href}`" open="_blank" rel="noreferrer noopener">
          {{ store.name }}
          </a>
        </div>
        <div
          class="mx-2 my-0 text-caption description line-clamp"
          :style="{
            maxHeight: minText
          }"
        >
          {{ store.description }}
        </div>
      </div>
    </div>
  </v-sheet>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    store: {
      type: Object,
      required: true,
    },
    minText: {
      type: String,
      required: false,
      default: '50%',
    },
  },
  methods: {
    handleInternalLink(rootUrl) {
      this.$router.push(`/store/${rootUrl}`)
    },
  },
  computed: {
    ...mapState({
      baseURL(state) {
        return state.baseURL
      },
    }),
  },
}
</script>
<style scoped>
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
.description {
  line-height: 1.1em;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
