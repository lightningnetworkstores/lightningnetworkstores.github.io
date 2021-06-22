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
  data() {
    return {
      isProcessing: false,
    }
  },
  computed: {
    storeIsLiked() {
      return this.likedStores[this.store.id]
    },
    ...mapState(['likedStores']),
  },
  methods: {
    async handleLike(storeId) {
      if (this.isProcessing) return
      this.isProcessing = true
      if (this.storeIsLiked) {
        await this.$store.dispatch(`likeStore`, { storeId, remove: true })
      } else {
        await this.$store.dispatch(`likeStore`, { storeId, remove: false })
      }

      this.$emit('likeStore', { isLiked: this.storeIsLiked, storeId })
      this.isProcessing = false
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
