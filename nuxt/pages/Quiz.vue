<template>
  <v-container class="py-14">
    <v-row>
      <v-col
        ><h1 class="text-center">
          {{ question }}
        </h1></v-col
      ></v-row
    >
    <v-row>
      <v-col
        ><div
          class="d-flex flex-column flex-md-row align-center justify-center contest-info"
        >
          <div class="d-flex align-center justify-center flex-wrap">
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
        </div></v-col
      ></v-row
    >

    <v-row v-if="!isLogged">
      <v-col class="text-center"
        ><h3>You need to be logged to play</h3>
        <v-btn
          color="blue lighten-1"
          class="mx-2 my-3 white--text"
          @click="handleLoginClick"
        >
          <v-icon left dark> mdi-twitter </v-icon>
          login with twitter
        </v-btn></v-col
      >
    </v-row>
    <template v-if="true">
      <v-row>
        <v-col><h2>Quiz Results</h2></v-col></v-row
      >
      <v-row>
        <v-col class="text-center">
          <div v-if="true" class="grid-list">
            <quiz-contest-votes-card
              v-for="option in options"
              :key="'option-' + option"
              :option="option"
            /></div></v-col
      ></v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col>
          <div class="grid-list">
            <quiz-contest-card
              :disabled="!isLogged || isContestClosed"
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
      <v-col><v-divider class="mt-8" /></v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3 class="mb-4">Your bets</h3>
        <user-bets-table :userBets="userBets" :waitingForEnd="isContestClosed" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import FlipCountdown from "vue2-flip-countdown";

export default {
  components: { FlipCountdown },
  computed: {
    ...mapGetters({
      quizContest: "getQuizContest",
    }),
    ...mapState({
      isLogged(state) {
        if (state.loginStatus.user) return state.loginStatus.user.logged;
        else return false;
      },
    }),
    contestId() {
      return this.quizContest.contest?.id;
    },

    choice() {
      return this.quizContest?.user_vote?.choice || "";
    },
    deadline() {
      return this.quizContest.contest?.end
        ? new Date(this.quizContest.contest?.end).toLocaleString()
        : "2022-01-01:00:00:00";
    },
    isContestClosed() {
      switch (this.stage) {
        case "DISQUALIFIED" || "COMPLETE" || "CANCELLED":
          return true;
        default:
          return false;
      }
    },
    minimumBet() {
      return this.quizContest.minimum_bet;
    },
    options() {
      return this.quizContest?.contest?.contestants?.options;
    },
    pot() {
      return this.quizContest.contest?.pot;
    },
    question() {
      return this.quizContest.contest?.contestants.question;
    },

    stage() {
      return this.quizContest.contest?.stage;
    },
    userBets() {
      return this.quizContest?.user_bets || [];
    },
  },

  beforeMount() {
    this.$store.dispatch("getQuizContest");
  },
  methods: {
    handleLoginClick() {
      this.$axios
        .get("/api/oauthlogin?platform=twitter")
        .then((res) => res.data)
        .then((data) => {
          console.log(data);
          const { request_token, authorization_url, platform } = data.data;
          window.location.replace(authorization_url);
        });
    },
  },
};
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
</style>
