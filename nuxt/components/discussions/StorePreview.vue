<template>
  <v-sheet rounded outlined class="mr-4">
    <div class="d-flex">
      <v-img
        @click="() => handleInternalLink(store.rooturl)"
        :src="`https://bitcoin-stores.com/thumbnails/${store.id}.jpg`"
        max-height="100"
        max-width="100"
      />
      <div @click="() => handleInternalLink(store.rooturl)">
        <div class="text-subtitle-2 mx-2 my-1">
          <a :href="`${store.href}`" open="_blank" rel="noreferrer noopener">{{ store.name }}</a>
        </div>
        <div class="text-body-2 mx-2 my-1">
          {{ store.description }}
        </div>
      </div>
    </div>
  </v-sheet>
</template>
<script>
export default {
  props: {
    store: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleInternalLink(rootUrl) {
      this.$router.push(`/store/${rootUrl}`)
    }
  }
}
</script>