<template>
  <v-container class="py-14">
    <contest-header
      v-if="contestName"
      :question="question"
      :name="contestName"
      :deadlineTimestamp="deadlineTimestamp"
      :stage="stage"
      :userBets="userBets"
      :pot="pot"
      contestType="quiz"
    />
    <PnL :pnl="pnl"></PnL>
    <template v-if="isContestClosed">
      <v-row>
        <v-col><h2>Quiz Results</h2></v-col></v-row
      >
      <v-row>
        <v-col>
          <div class="grid-list" >
            <quiz-contest-result-card
              v-for="optionVote in votes"
              :key="`optionVotes-${optionVote.option}`"
              :option="optionVote.option"
              :votes="optionVote.votes"
              :bets="optionVote.bets"
            />
            </div></v-col
      ></v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col>
          <div class="grid-list mt-3">
            <quiz-contest-card
              :isLogged="isLogged"
              v-for="option in options"
              :selected="choice === option"
              :key="'option-' + option"
              :contestId="contestId"
              :option="option"
              :minBet="minimumBet"
            /></div
        ></v-col>
      </v-row>
    </template>
    <v-row>
      <v-col>
        <h2 class="mb-4 d-flex justify-center">Your bets</h2>
        <user-bets-table
          :userBets="userBets"
          :isContestRunning="isContestRunning"
          contestType="quiz"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import FlipCountdown from 'vue2-flip-countdown'
import Head from '~/mixins/Head'
import PnL from '@/components/contests/PnL.vue'

export default {
  components: { FlipCountdown, PnL},
  mixins: [Head],
    head() {
      return this.getMetadata(
        'Quiz contest',
        'Vote on the daily quiz and earn sats by guessing the most voted choice.',
        '/ogimage.png'
      )
    },
  data() {
    return {
      countPreviousQuiz: 0,
      isActivePrevious: false,
    }
  },
  computed: {
    ...mapGetters({
      quizContest: 'getQuizContest',
    }),
    ...mapState({
      isLogged(state) {
        if (state.loginStatus.user) return state.loginStatus.user.logged
        else return false
      },
    }),
    contestId() {
      return this.quizContest.contest?.id
    },
    choice() {
      return this.quizContest?.user_vote?.choice || ''
    },
    pnl(){
      return this.quizContest?.user_bets?.map(b => b.prize - b.wager).reduce( (a,b) => a+b, 0)
    },
    contestName() {
      return this.quizContest.contest?.name
    },
    isContestRunning() {
      return ['MAIN', 'EXTENSION'].includes(this.stage)
    },
    deadlineTimestamp() {
      return this.quizContest.contest?.end
    },
    isContestClosed() {
      if (
        ['DISQUALIFIED', 'COMPLETE', 'CANCELLED'].includes(this.stage)
      ) {
        return true
      }

      return false
    },
    minimumBet() {
      return this.quizContest.minimum_bet
    },
    options() {
      return this.quizContest?.contest?.contestants?.options
    },
    pot() {
      return this.quizContest.contest?.pot
    },
    question() {
      return this.quizContest.contest?.contestants.question
    },
    stage() {
      return this.quizContest.contest?.stage
    },
    userBets() {
      return this.quizContest?.user_bets || []
    },
    votes() {
      if (this.isContestClosed) {
        const quizContestData =
          this.quizContest.contest.contestants.options.map(
            (option) => {
              return {
                option,
                votes:
                  this.quizContest.votes?.filter(
                    (vote) => vote.choice === option
                  ) || [],
                bets:
                  this.quizContest.bets?.filter(
                    (bet) => bet.choice === option
                  ) || [],
              }
            }
          )
        return quizContestData
      }
      return []
    },
  },

  beforeMount() {
    const payload = { age: 0 }
    if (this.$route.params?.name) {
      payload.name = this.$route.params.name
    }
    if(this.$route.query.admin){
      payload.admin = this.$route.query.admin
    }
    this.$store.dispatch('getQuizContest', payload)
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
}
</script>

<style scoped>
.contest-info {
  row-gap: 32px;
}

.grid-list {
  gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
.isActive {
  background: #424242;
  border: 1px solid #424242;
  color: white !important;
}
</style>
