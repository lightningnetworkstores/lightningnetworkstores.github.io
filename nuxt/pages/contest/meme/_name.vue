<template>
  <v-container>
    <contest-header
      v-if="hasMemeContest"
      question="What's the best meme?"
      :name="contestName"
      :deadlineTimestamp="deadlineTimestamp"
      :stage="stage"
      :userBets="userBets"
      :pot="pot"
      contestType="meme"
    />
    <v-row>
      <v-col><v-divider class="mt-8" /></v-col>
    </v-row>
    <PnL :pnl="pnl"></PnL>
    <template v-if="isContestClosed">
      <v-row>
        <v-col >
          <h2 class="text-center">Contest Results</h2>
          <div class="text-center mt-1">
            <v-chip pill :color="getStateColor(memeContest.contest.stage)" text-color="white">
              {{ memeContest.contest.stage }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="winner">
        <v-col class="d-flex justify-center">
          <meme-contest-winner
            :winner="winner.meme"
            :votes="winner.votes"
            :bets="winner.bets"
            :contest="memeContest.contest"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(loser, index) in losers"
          :key="`store-${loser.meme.id}`"
          col="12" md="6" class="text-center"
        >
          <div
            class="d-flex"
            :class="{
              'justify-end': index % 2 === 0 && !isMobile,
              'justify-start': index % 2 !== 0 && !isMobile
            }"
          >
            <meme-contest-result-card
              :meme="loser.meme"
              :votes="loser.votes"
              :bets="loser.bets"
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
        <v-col col="12" md="6"
          v-for="(meme, index) in contestants"
          :key="meme.id"
        >
          <div
            class="d-flex"
            :class="{
              'justify-end': index % 2 === 0 && !isMobile,
              'justify-start': index % 2 !== 0 && !isMobile
            }">
            <meme-contest-card
              :contestId="memeContest.contest.id"
              :url="meme.link"
              :id="meme.id"
              :selected="meme.id === choice"
              :isLogged="isLogged"
            />
          </div>
        </v-col>
      </v-row>
    </template>
    <v-row>
      <v-col>
        <h2 class="mb-4 d-flex justify-center">Your bets</h2>
        <user-bets-table
          :userBets="userBets"
          :isContestRunning="isContestRunning"
          contestType="meme"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'
import Head from '~/mixins/Head'
import PnL from '@/components/contests/PnL.vue'

export default {
  components: {
    PnL
  },
  mixins: [Head],
    head() {
      return this.getMetadata(
        'Meme contest',
        'Vote on the meme of the day and earn sats by guessing the most voted meme.',
        '/ogimage.png'
      )
    },
  computed: {
    ...mapState({
      isLogged(state) {
        if (state.loginStatus.user) return state.loginStatus.user.logged
        else return false
      },
    }),
    ...mapState(['memeContest']),
    isMobile() {
      return this.$vuetify.breakpoint.name === 'xs'
    },
    hasMemeContest() {
      return this.memeContest !== undefined
    },
    contestName() {
      return this.memeContest?.contest?.name
    },
    deadlineTimestamp() {
      return this.memeContest?.contest?.end
    },
    stage() {
      return this.memeContest?.contest?.stage
    },
    choice() {
      return parseInt((this.memeContest?.user_vote?.choice ?? 0))
    },
    pnl(){
      return this.memeContest?.user_bets?.map(b => b.prize - b.wager).reduce( (a,b) => a+b, 0)
    },
    userBets() {
      return (
        this.memeContest?.user_bets?.map(
          ({ wager, choice, prize }) => {
            const memeLink = this.contestants?.find(
                (meme) => meme.id == +choice
              ).link
            return {
              choice: {
                link: memeLink
              },
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
        this.memeContest.contest.contestants.option_details) {
        return this.memeContest.contest.contestants.option_details
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
    results() {
      if (!this.memeContest) return []
      if (this.isContestClosed) {
        let votesInfo = this.memeContest.contest.contestants.option_details.map((meme) => {
          return {
            meme,
            votes:
              this.memeContest.votes?.filter(
                (vote) => parseInt(vote.choice ?? 0) === parseInt(meme.id)
              ) || [],
            bets:
              this.memeContest.bets?.filter(
                (bet) => parseInt(bet.choice ?? 0) === parseInt(meme.id)
              ) || [],
          }
        })
        
        return votesInfo
      }
      return []
    },
    losers() {
      return this.results.filter(result => {
        if (this.memeContest.winner) {
          return parseInt(this.memeContest.winner) !== result.meme.id
        }
        return true
      })
    },
    winner() {
      const winners = this.results.filter(result => {
        if (this.memeContest.winner) {
          return parseInt(this.memeContest.winner) === result.meme.id
        }
        return false
      })
      if (winners.length === 1) return winners[0]
      return null
    }
  },
  beforeMount() {
    const payload = { age: 0 }
    if (this.$route.params?.name) {
      payload.name = this.$route.params.name
    }
    if(this.$route.query.admin){
      payload.admin = this.$route.query.admin
    }
    this.$store.dispatch('getMemeContest', payload)
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
    getStateColor(stage) {
      if (['CANCELLED', 'DISQUALIFIED'].includes(stage)) {
        return 'orange darken-1'
      } else if (stage === 'COMPLETE') {
        return 'green darken-1'
      }
      return 'grey darken-1'
    }
  }
}
</script>
<style scoped>
.grid-list {
  gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
</style>
