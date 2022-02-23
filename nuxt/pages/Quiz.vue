<template>
  <div class="d-flex flex-column mt-8 align-center">
    <div
      class="
        d-flex
        flex-column flex-lg-row
        align-center
        justify-center
        contest-info
      "
    >
      <div class="d-flex align-center flex-wrap">
        <span class="title">Time left:</span>
        <div>
          <flip-countdown
            :deadline="deadline"
            :showDays="false"
            countdownSize="32px"
            labelSize="14px"
          ></flip-countdown>
        </div>
      </div>
      <v-btn text href="#" color="primary" class="mx-16">
        <v-icon left dark>mdi-gamepad-variant</v-icon>
        Game rules
      </v-btn>
      <div class="d-flex align-center">
        <span class="title">Total bets (sats): {{ pot }}</span>
      </div>
    </div>

    <h1 class="pt-10 text-center">
      {{ question }}
    </h1>

    <v-container
      v-if="!isLogged"
      class="d-flex flex-column order-lg-last mt-8 align-center"
    >
      <h3>You need to be logged to play</h3>
      <v-btn
        color="blue lighten-1"
        class="mx-2 my-3 white--text"
        @click="handleLoginClick"
      >
        <v-icon left dark> mdi-twitter </v-icon>
        login with twitter
      </v-btn>
    </v-container>

    <v-container class="full-list mt-8">
      <contest-quiz-card
        :disabled="!isLogged"
        v-for="option in options"
        :selected="choice === option"
        :key="'option-' + option"
        :contestId="id"
        :option="option"
      />
    </v-container>

    <v-container class="mt-4" v-if="isLogged && userBets">
      <h3 class="mb-4">Your bets</h3>
      <user-bets-table :userBets="userBets" :waitingForEnd="contestFinalized" />
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import FlipCountdown from 'vue2-flip-countdown'

export default {
  components: { FlipCountdown },
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
    id() {
      return this.quizContest.contest?.id
    },
    deadline() {
      return this.quizContest.contest?.end
        ? new Date(this.quizContest.contest?.end).toLocaleString()
        : '2022-01-01:00:00:00'
    },
    options() {
      return this.quizContest?.contest?.contestants?.options
    },
    choice() {
      return this.quizContest?.user_vote?.choice || ''
    },
    userBets() {
      return this.quizContest?.user_bets || []
    },
    contestFinalized() {
      return new Date(this.quizContest?.contest?.end) > new Date()
    },
    pot() {
      return this.quizContest.contest?.pot
    },
    question() {
      return this.quizContest.contest?.contestants.question
    },
  },
  beforeMount() {
    this.$store.dispatch('getQuizContest')
  },
  methods: {
    handleLoginClick() {
      this.$axios
        .get('/api/oauthlogin?platform=twitter')
        .then((res) => res.data)
        .then((data) => {
          console.log(data)
          const { request_token, authorization_url, platform } = data.data
          window.location.replace(authorization_url)
        })
    },
  },
}
</script>

<style>
.contest-info {
  row-gap: 32px;
}
</style>
