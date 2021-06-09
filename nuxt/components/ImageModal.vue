<template>
  <div class="image-modal">
    <div v-for="(img, i) in images" :key="i" class="image-modal-list">
      <v-img
        :src="`${baseURL}thumbnails/${i > 0 ? `${id}_${i + 1}` : `${id}`}.png`"
      ></v-img>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id', 'images', 'baseURL'],
}
</script>

<style lang="scss" scoped>
.image-modal {
  background: white;
  padding: 1rem;
}
.image-modal-list {
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
