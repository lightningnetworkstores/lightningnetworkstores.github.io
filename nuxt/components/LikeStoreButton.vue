<template>
  <div class="likes" @click.stop="handleLike(store.id)">
    <v-icon small :color="storeIsLiked ? `red` : `gray`">fa-heart</v-icon>
    {{ store.likes }}
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['store', 'likes'],
  computed: {
    storeIsLiked() {
      if (this.likedStores) {
        return this.likedStores.some((id) => id === this.store.id)
      }

      return false
    },
    ...mapState(['likedStores']),
  },
  methods: {
    handleLike(storeId) {
      if (this.storeIsLiked) {
        this.$store.dispatch(`likeStore`, { storeId, remove: true })
        this.$store.dispatch(`popStoreLike`, storeId)
      } else {
        this.$store.dispatch(`likeStore`, { storeId, remove: false })
        this.$store.dispatch(`pushStoreLike`, storeId)
      }

      this.$emit('likeStore', { isLiked: this.storeIsLiked, storeId })
    },
  },
}
</script>

<style lang="scss" scoped>
.likes {
  cursor: pointer;
  display: inline;
}
</style>
