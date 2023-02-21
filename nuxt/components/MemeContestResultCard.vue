<template>
  <v-card class="d-flex flex-column justify-space-between" width="350px">
    <discussion-image
      :url="meme.link"
    />
    <div class="px-5 py-2">
      <v-divider class="mb-0" />
      <div class="py-0 text-left" style="min-height: 73px">
        <span class="text-caption text--secondary">Voted by</span>
        <div class="d-flex align-center">
          <div v-for="n in votesLength" :key="`votes-${n}`">
            <v-btn icon x-large class="avatar-container">
              <v-avatar size="32" class="dark-border-circle">
                <img :src="getVoteProfilePicture(n - 1)" />
              </v-avatar>
            </v-btn>
          </div>
        </div>
      </div>
      <v-divider class="mb-0" />
      <div class="py-0 text-left" style="min-height: 73px">
        <span class="text-caption text--secondary">Bets</span>
        <div class="d-flex align-center">
          <div v-for="n in betsLength" :key="`bets-${n}`">
            <v-btn icon x-large class="avatar-container">
              <v-avatar size="32" class="dark-border-circle">
                <img :src="getBetProfilePicture(n - 1)" />
              </v-avatar>
            </v-btn>
          </div>
        </div>
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
    getVoteProfilePicture(n) {
      return this.votes[n].profile.image
    },
    getBetProfilePicture(n) {
      return this.bets[n].profile.image
    }
  },
  computed: {
    votesLength() {
      return Math.min(8, this.votes.length)
    },
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