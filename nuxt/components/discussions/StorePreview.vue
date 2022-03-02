<template>
  <v-sheet rounded outlined class="mr-1" height="100">
    <div class="d-flex">
      <v-img
        @click="() => handleInternalLink(store.rooturl)"
        :src="`https://bitcoin-stores.com/thumbnails/${store.id}.jpg`"
        height="99"
        max-width="100"
      />
      <div @click="() => handleInternalLink(store.rooturl)">
        <div class="text-subtitle-2 mx-2 my-1">
          <a :href="`${store.href}`" open="_blank" rel="noreferrer noopener">{{ store.name }}</a>
        </div>
        <div class="text-body-2 mx-2 my-0" style="max-height: 60%; overflow: hidden">
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