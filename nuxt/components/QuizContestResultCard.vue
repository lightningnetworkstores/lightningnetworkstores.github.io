<template>
  <v-card hover class="d-flex flex-column justify-space-between quizCard">
    <v-card-title>{{ option }}</v-card-title>

    <v-card-text class="px-4 py-2 text-left">
      <v-divider class="mb-0" />
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
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['option', 'votes', 'bets'],
  computed: {
    ...mapState({
      baseURL(state) {
        return state.baseURL
      },
    }),
    votesProfileImage() {
      return (n) => this.votes[n]?.profile.image ?? ""
    },
    votesProfileName() {
      return (n) => this.votes[n]?.profile.name ?? ""
    },
    votesProfileHandle() {
      return (n) => this.votes[n]?.profile.handle ?? ""
    },
    betsProfileImage() {
      return (n) => this.bets[n]?.profile.image ?? ""
    },
    betsProfileName() {
      return (n) => this.bets[n]?.profile.name ?? ""
    },
    betsProfileHandle() {
      return (n) => this.bets[n]?.profile.handle ?? ""
    },
    betsProfileWager() {
      return (n) => this.bets[n]?.wager ?? ""
    },
    votesLengthForUsers() {
      return (this.votes.length > 0) ? ((this.votes.length > 8) ? 8 : this.votes.length) : 0 
    },
    betsLengthForUsers() {
      return (this.bets.length > 0) ? ((this.bets.length > 8) ? 8 : this.bets.length) : 0
    },
  },
  methods: {
    getStoreLink(link) {
      const url = new URL(link)
      const baseUrl = new URL(this.baseURL)
      url.searchParams.append('utm_source', baseUrl.host)
      return url.toString()
    },
    gotoStore(store) {
      const { id, rootUrl } = store

      this.$route.meta.storeId = id
      this.$router.push('/store/' + rootUrl)
    },
  },
}
</script>

<style>
.user-voted-container {
  display: flex;
  row-gap: 4px;
  width: 100%;
}

.user-voted-container > * {
  margin-inline: -12px;
}

.user-vote-avatar {
  border: 2px solid white;
}

.quizCard {
  width: 100%;
}
</style>
