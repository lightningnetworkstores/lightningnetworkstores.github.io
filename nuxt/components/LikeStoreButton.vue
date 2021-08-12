<template>
  <div
    :class="{ likes: true, 'sm-btn-actions': $vuetify.breakpoint.mobile }"
    @click.stop="handleLike(store.id)"
  >
    <div class="d-flex icon-section">
      <like-icon
        :filled="storeIsLiked"
        class="mr-1 text-red"
        :key="Date.now()"
      />
      {{ store.likes }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import LikeIcon from '~/assets/icons/Heart.vue'

export default {
  components: { LikeIcon },
  props: {
    store: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      isProcessing: false,
    }
  },
  computed: {
    ...mapState({
      likedStores: 'likedStores',

      storeIsLiked() {
        return this.likedStores[this.store.id]
      },
    }),
  },
  methods: {
    async handleLike(storeId) {
      if (this.isProcessing) {
        return
      }

      try {
        this.$recaptcha.init()
        this.isProcessing = true

        if (this.storeIsLiked) {
          await this.$store.dispatch(`likeStore`, { storeId, remove: true })
        } else {
          const recaptchaToken = await this.$recaptcha.execute('like_store')

          await this.$store.dispatch(`likeStore`, {
            recaptchaToken,
            remove: false,
            storeId,
          })
        }

        this.$emit('likeStore', { isLiked: this.storeIsLiked, storeId })
        this.isProcessing = false
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.likes {
  cursor: pointer;
  display: inline;
}
.icon-section {
  line-height: 1;
  font-size: 22px;
}
.sm-btn-actions {
  font-size: 24px !important;
  .v-icon {
    font-size: 24px !important;
  }
}
</style>
