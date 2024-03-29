<template>
  <v-container class="py-14">
    <contest-header
      v-if="contestName"
      :question="question"
      :name="contestName"
      :deadline="deadline"
      :stage="stage"
      :userBets="userBets"
      :pot="pot"
      contestType="quiz"
    />
    <template v-if="isContestClosed">
      <v-row>
        <v-col><h2>Quiz Results</h2></v-col></v-row
      >
      <v-row>
        <v-col>
          <div class="grid-list" >
            <quiz-contest-votes-card
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
              :disabled="!isLogged"
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
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import FlipCountdown from 'vue2-flip-countdown'
import Head from '~/mixins/Head'

export default {
  components: { FlipCountdown },
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
    contestName() {
      return this.quizContest.contest?.name
    },
    deadline() {
      return this.quizContest.contest?.end
        ? new Date(this.quizContest.contest?.end).toLocaleString()
        : '2022-01-01:00:00:00'
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
    this.$store.dispatch('getQuizContest', payload)
  },
  watch: {
    contestName(oldName, newName) {
      if (newName) {
        history.pushState({}, null, this.$route.path + '/' + newName)
      }
    }
  },
  methods: {
    handleLoginClick() {
      this.$axios
        .get('/api/oauthlogin?platform=twitter')
        .then((res) => res.data)
        .then((data) => {
          const { request_token, authorization_url, platform } =
            data.data
          window.location.replace(authorization_url)
        })
    },
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
