<template>
  <div>
    <div class="text-center">
      <v-icon x-large color="orange">mdi-crown</v-icon>
    </div>
    <div class="text-subtitle-1 text-center">
      Winner with {{ votes.length }} vote{{ isPlural ? 's' : '' }}
    </div>
    <v-card width="350px" hover>
      <discussion-image
        :url="winner.link"
      />
      <div class="text-subtitle-1 text-center">
        <span>Payout: +0%</span>
        <contest-result-dialog :contest="contest" />
      </div>
      <div class="px-5 py-2">
        <v-divider class="mb-0" />
        <div class="py-0 text-left" style="min-height: 73px">
          <span class="text-caption text--secondary">Voted by</span>
          <vote-summary :votes="votes"/>
        </div>
        <v-divider class="mb-0" />
        <div class="py-0 text-left" style="min-height: 73px">
          <span class="text-caption text--secondary">Bets</span>
          <bet-summary :bets="bets"/>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
import DiscussionImage from '~/components/discussions/DiscussionImage.vue'
export default {
  components: {
    DiscussionImage
  },
  props: {
    contest: {
      type: Object,
      required: true
    },
    winner: {
      type: Object,
      required: true
    },
    bets: {
      type: Array,
      default: []
    },
    votes: {
      type: Array,
      default: []
    }
  },
  computed: {
    isPlural() {
      return this.votes.length > 1
    }
  }
}
</script>