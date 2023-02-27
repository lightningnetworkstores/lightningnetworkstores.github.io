<template>
  <v-container>
    <contest-header
      v-if="contestName"
      question="What's your favorite project?"
      :name="contestName"
      :deadlineTimestamp="deadlineTimestamp"
      :stage="stage"
      :userBets="userBets"
      :pot="pot"
    />
    <v-row>
      <v-col><v-divider class="mt-8" /></v-col>
    </v-row>
    <template v-if="isContestClosed">
      <v-row>
        <v-col >
          <h2 class="text-center">Contest Results</h2>
          <div class="text-center mt-1">
            <v-chip pill :color="getStateColor(storeContest.contest.stage)" text-color="white">
              {{ storeContest.contest.stage }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="winner" class="mt-0">
        <v-col class="d-flex justify-center">
          <store-contest-winner
            :winner="winner.store"
            :votes="winner.votes"
            :bets="winner.bets"
            :contest="storeContest.contest"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <div class="grid-list">
            <store-contest-result-card
              v-for="loser in losers"
              :key="`store-${loser.store.id}`"
              :store="loser.store"
              :votes="loser.votes"
              :bets="loser.bets"
            />
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col>
          <h2>Stores</h2>
        </v-col>
      </v-row>
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
import Head from '~/mixins/Head'

export default {
  mixins: [Head],
  head() {
    return this.getMetadata(
      'Project contest',
      'Vote regularly on your favorite project. Guess the most voted project and earn sats',
      '/ogimage.png'
    )
  },
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
    deadlineTimestamp() {
      return this.storeContest.contest?.end
    },
    userBets() {
      return (
        this.storeContest?.user_bets?.map(
          ({ wager, choice, prize }) => {
            const choiceName = this.storeContest.stores?.find(
                (store) => store.id == choice
              )?.name
            return {
              choice: {
                name: choiceName
              },
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
    results() {
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
    losers() {
      return this.results.filter(result => {
        if (this.storeContest.winner) {
          return parseInt(this.storeContest.winner) !== result.store.id
        }
        return true
      })
    },
    winner() {
      const winners = this.results.filter(result => {
        if (this.storeContest.winner) {
          return parseInt(this.storeContest.winner) === result.store.id
        }
        return false
      })
      if (winners.length === 1) return winners[0]
      return null
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    }
  },
  watch: {
    contestName(newName, oldName) {
      if (newName && oldName && newName !== oldName) {
        if (this.$route.params.name) {
          const updatedPath = this.$route.path.replace(this.$route.params.name, newName)
          history.pushState({}, null, updatedPath)
        } else {
          history.pushState({}, null, this.$route.path + '/' + newName)
        }
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
    getStateColor(stage) {
      if (['CANCELLED', 'DISQUALIFIED'].includes(stage)) {
        return 'orange darken-1'
      } else if (stage === 'COMPLETE') {
        return 'green darken-1'
      }
      return 'grey darken-1'
    }
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
