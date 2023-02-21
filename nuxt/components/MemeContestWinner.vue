<template>
  <div>
    <div class="text-subtitle-1 text-center">
      Winner with {{ votes.length }} vote{{ isPlural ? 's' : '' }}
    </div>
    <div class="text-center">
      <v-icon x-large color="orange">mdi-crown</v-icon>
    </div>
    <v-card width="350px" hover>
      <discussion-image
        :url="winner.link"
      />
    </v-card>
    <div class="text-subtitle-1 text-center">
      <span>Payout: +0%</span>
      <contest-result-dialog :contest="contest" />
    </div>
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