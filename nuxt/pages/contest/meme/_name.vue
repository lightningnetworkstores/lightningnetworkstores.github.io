<template>
  <v-container>
    <contest-header
      v-if="hasMemeContest"
      question="What's the best meme?"
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
        <v-col><h2>Contest Results</h2></v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <div class="grid-list">
            <store-contest-votes-card
              v-for="memeVote in votes"
              :key="`store-${memeVote.store.id}`"
              :store="memeVote.store"
              :votes="memeVote.votes"
              :bets="memeVote.bets"
            />
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col><h2 class="d-flex justify-center">Memes</h2></v-col>
      </v-row>
      <v-row v-if="hasMemeContest">
        <v-col>
          <div class="grid-list">
            <meme-contest-card
              v-for="meme in contestants"
              :key="meme.id"
              :url="meme.url"
              :id="meme.id"
            />
          </div>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      isLogged(state) {
        if (state.loginStatus.user) return state.loginStatus.user.logged
        else return false
      },
    }),
    ...mapState(['memeContest']),
    hasMemeContest() {
      return this.memeContest !== undefined
    },
    contestName() {
      return this.memeContest?.contest?.name
    },
    deadline() {
      return this.memeContest?.contest?.end
        ? new Date(this.memeContest.contest?.end).toLocaleString()
        : '2020-01-01:00:00:00'
    },
    stage() {
      return this.memeContest?.contest?.stage
    },
    choice() {
      return parseInt((this.memeContest?.user_vote?.choice ?? 0))
    },
    userBets() {
      return (
        this.memeContest?.user_bets?.map(
          ({ wager, choice, prize }) => {
            return {
              choice: this.memeContest.stores?.find(
                (store) => store.id == choice
              )?.name,
              prize: prize,
              wager: wager,
            }
          }
        ) || []
      )
    },
    contestants() {
      if (this.memeContest &&
        this.memeContest.contest &&
        this.memeContest.contest.contestants &&
        this.memeContest.contest.contestants.options) {
        return this.memeContest.contest.contestants.options
      }
      return []
    },
    pot() {
      return this.memeContest?.contest?.pot
    },
    isContestClosed() {
      return ['DISQUALIFIED', 'COMPLETE', 'CANCELLED'].includes(this.stage)
    },
    isContestRunning() {
      return ['MAIN', 'EXTENSION'].includes(this.stage)
    },
    votes() {
      if (this.isContestClosed) {
        let votesInfo = this.memeContest.stores.map((store) => {
          return {
            store,
            votes:
              this.memeContest.votes?.filter(
                (vote) => parseInt(this.notIsNaN(vote.choice)) === store.id
              ) || [],
            bets:
              this.memeContest.bets?.filter(
                (bet) => parseInt(this.notIsNaN(bet.choice)) === store.id
              ) || [],
          }
        })
        
        return votesInfo
      }
      return []
    },
  },
  beforeMount() {
    const payload = { age: 0 }
    if (this.$route.params?.name) {
      payload.name = this.$route.params.name
    }
    this.$store.dispatch('getMemeContest', payload)
  },
}
</script>
<style scoped>
.grid-list {
  gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
</style>