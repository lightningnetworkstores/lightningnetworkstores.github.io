<template>
  <v-card class="d-flex flex-column justify-space-between" width="350px">
    <discussion-image
      :url="meme.link"
    />
    <v-divider class="my-0" />
    <div class="px-5 py-2">
      <div class="py-0 text-left" style="min-height: 73px">
        <span class="text-caption text--secondary">Voted by</span>
        <vote-summary :votes="votes"/>
      </div>
    </div>
    <v-divider class="mb-0" />
    <div class="px-5 py-2">
      <div class="py-0 text-left" style="min-height: 73px">
        <span class="text-caption text--secondary">Bets</span>
        <bet-summary :bets="bets"/>
      </div>
    </div>
  </v-card>
</template>
<script>
import DiscussionImage from '~/components/discussions/DiscussionImage.vue'
export default {
  components: {
    DiscussionImage
  },
  props: {
    meme: {
      type: Object,
      required: true
    },
    votes: {
      type: Array,
      default: []
    },
    bets: {
      type: Array,
      default: []
    }
  },
  methods: {
    getBetProfilePicture(n) {
      return this.bets[n].profile.image
    }
  },
  computed: {
    betsLength() {
      return Math.min(8, this.bets.length)
    },
  }
}
</script>>
<style scoped>
.avatar-container {
  margin-right: -30px;
}
.dark-border-circle {
  border: 0.8px solid black;
}
</style>