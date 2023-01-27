<template>
  <v-container>
    <contest-header
      v-if="contestName"
      question="What's your favorite project?"
      :name="contestName"
      :deadline="deadline"
      :stage="stage"
      :userBets="userBets"
      :pot="pot"
    />
    <v-row>
      <v-col><v-divider class="mt-8" /></v-col>
    </v-row>
    <template v-if="isContestClosed">
      <v-row>
        <v-col><h2>Contest Results</h2></v-col></v-row
      >
      <v-row>
        <v-col class="text-center">
          <div class="grid-list">
            <store-contest-votes-card
              v-for="storeVote in votes"
              :key="`store-${storeVote.store.id}`"
              :store="storeVote.store"
              :votes="storeVote.votes"
              :bets="storeVote.bets"
            /></div></v-col
      ></v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col><h2>Stores</h2></v-col></v-row
      >
      <v-row>
        <v-col>
          <div class="grid-list">
            <store-contest-card
              v-for="store in storeContest.stores"
              :data-storeId="store.id"
              :key="'store-' + store.id"
              :store="store"
              :contestId="storeContest.contest.id"
              :disabled="!isLogged || isContestClosed"
              :selected="store.id === choice"
              :minBet="minimumBet"
            /></div
        ></v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      storeContest: 'getStoreContest',
    }),
    ...mapState({
      isLogged(state) {
        if (state.loginStatus.user) return state.loginStatus.user.logged
        else return false
      },
    }),
    disableNext() {
      if (this.stage) {
        return this.stage === 'MAIN' || this.stage === 'EXTENSION'
      }
      return false
    },
    deadline() {
      return this.storeContest.contest?.end
        ? new Date(this.storeContest.contest?.end).toLocaleString()
        : '2020-01-01:00:00:00'
    },
    userBets() {
      return (
        this.storeContest?.user_bets?.map(
          ({ wager, choice, prize }) => {
            return {
              choice: this.storeContest.stores?.find(
                (store) => store.id == choice
              )?.name,
              prize: prize,
              wager: wager,
            }
          }
        ) || []
      )
    },
    pot() {
      return this.storeContest.contest?.pot
    },
    minimumBet() {
      return this.storeContest.minimum_bet
    },
    stage() {
      return this.storeContest.contest?.stage
    },
    choice() {
      return parseInt((this.storeContest.user_vote?.choice ?? 0))
    },
    contestName() {
      return this.storeContest.contest?.name
    },
    isContestRunning() {
      return ['MAIN', 'EXTENSION'].includes(this.stage)
    },
    isContestClosed() {
      return ['DISQUALIFIED', 'COMPLETE', 'CANCELLED'].includes(this.stage)
    },
    votes() {
      if (this.isContestClosed) {
        let votesInfo = this.storeContest.stores.map((store) => {
          return {
            store,
            votes:
              this.storeContest.votes?.filter(
                (vote) => parseInt(this.notIsNaN(vote.choice)) === store.id
              ) || [],
            bets:
              this.storeContest.bets?.filter(
                (bet) => parseInt(this.notIsNaN(bet.choice)) === store.id
              ) || [],
          }
        })
        
        return votesInfo
      }
      return []
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    }
  },
  watch: {
    contestName(oldName, newName) {
      if (newName) {
        history.pushState({}, null, this.$route.path + '/' + newName)
      }
    }
  },
  methods: {
    notIsNaN (number) {
      if (isNaN(number)) {
        return 0
      }
      return number
    },
    handleLoginClick() {
      this.$axios
        .get('/api/oauthlogin?platform=twitter')
        .then((res) => res.data)
        .then((data) => {
          const { request_token, authorization_url, platform } =
            data.data
          console.log({ request_token, authorization_url, platform })
          window.location.replace(authorization_url)
        })
    },
    onPrevious() {
      this.$store.dispatch('getStoreContest', {
        name: this.storeContest.contest.name,
        age: 1
      })
    },
    onNext() {
      this.$store.dispatch('getStoreContest', {
        name: this.storeContest.contest.name,
        age: -1
      })
    },
  },
  beforeMount() {
    const payload = { age: 0 }
    if (this.$route.params?.name) {
      payload.name = this.$route.params.name
    }
    this.$store.dispatch('getStoreContest', payload)
  },
}
</script>

<style scoped>
.grid-list {
  gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.user-voted-container {
  gap: 2px;
}
</style>
