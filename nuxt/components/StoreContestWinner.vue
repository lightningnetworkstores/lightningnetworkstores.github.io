<template>
  <div>
    <div class="text-subtitle-1 text-center">
      Winner with {{ votes.length }} vote{{ isPlural ? 's' : '' }}
    </div>
    <div class="text-center">
      <v-icon x-large color="orange">mdi-crown</v-icon>
    </div>
    <v-card width="350px" raised hover>
      <v-img
        :aspect-ratio="4 / 3"
        max-height="200px"
        :src="`${baseURL}thumbnails/${winner.id}.jpg`"
        class="text-right"
        @click.native="goToStore(winner)"
      />
      <v-card-text>
        <div class="px-5 py-2">
          <div @click="goToStore(winner)">
            <div class="mb-2 text-center">
              <a :href="getStoreLink(winner.href)" class="font-weight-regular text-h5">
                {{ winner.name }}
                <v-icon class="ml-1" color="blue darken-2">mdi-open-in-new</v-icon>
              </a>
            </div>
            <div class="description">{{ winner.description }}</div>
          </div>
          <v-divider class="mb-1" />
        </div>
      </v-card-text>
      <div class="text-subtitle-1 text-center">
        <span>Payout: +0%</span>
        <contest-result-dialog :contest="contest" />
      </div>
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
              <v-btn icon x-large class="icon">
                <v-avatar size="32" class="dark-border-circle">
                  <img :src="getBetProfilePicture(n - 1)" />
                </v-avatar>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
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
  methods: {
    getStoreLink(link) {
      const url = new URL(link);
      const baseUrl = new URL(this.baseURL);
      url.searchParams.append("utm_source", baseUrl.host);
      return url.toString();
    },
    goToStore(store) {
      const { id, rootUrl } = store;
      this.$route.meta.storeId = id;
      this.$router.push("/store/" + rootUrl);
    },
    getVoteProfilePicture(n) {
      return this.votes[n].profile.image
    },
    getBetProfilePicture(n) {
      return this.bets[n].profile.image
    }
  },
  computed: {
    ...mapState(['baseURL']),
    isPlural() {
      return this.votes.length > 1
    },
    votesLength() {
      return Math.min(8, this.votes.length)
    },
    betsLength() {
      return Math.min(8, this.bets.length)
    }
  }
}
</script>
<style scoped>
.avatar-container {
  margin-right: -30px;
}
.dark-border-circle {
  border: 0.8px solid black;
}
</style>