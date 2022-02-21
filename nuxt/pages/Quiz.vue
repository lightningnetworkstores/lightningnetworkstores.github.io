<template>
  <div class="d-flex flex-column mt-8 align-center">
    <div class="d-flex align-center justify-center contest-info">
      <div class="d-flex align-center">
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
        <span class="title">Total bets (sats): 1320</span>
      </div>
    </div>

    <h1 v-if="quizContest.contestants" class="pt-10">
      {{ quizContest.contestants.question }}
    </h1>

    <v-container class="full-list mt-8">
      <v-card v-for="option in options" :key="'option-' + option">
        <v-card-title>{{ option }}</v-card-title>
        <v-card-actions>
          <v-btn
            :disabled="!isLogged"
            text
            color="blue-grey"
            class="mx-2 white--text"
            @click="choseStore()"
          >
            <v-icon left dark> mdi-star </v-icon>
            chose
          </v-btn>

          <v-btn
            text
            :disabled="!isLogged"
            color="orange darken-1"
            class="mx-2 white--text"
            @click="placeBet()"
          >
            <v-icon left dark> mdi-crown-circle </v-icon>
            Place a bet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>

    <v-container v-if="!isLogged" class="d-flex flex-column mt-8 align-center">
      <h3>You need to be logged to play</h3>
      <v-btn color="blue lighten-1" class="mx-2 my-3 white--text" @click="choseStore()">
        <v-icon left dark> mdi-twitter </v-icon>
        login with twitter
      </v-btn>
    </v-container>
  </div>
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
    deadline() {
      return this.quizContest.end
        ? new Date(this.quizContest.end).toLocaleString()
        : "2020-01-01:00:00:00";
    },
    options() {
      return this.quizContest?.contestants?.options;
    },
  },
  beforeMount() {
    this.$store.dispatch("getQuizContest");
  },
};
</script>

<style>
.contest-info {
  row-gap: 32px;
}
</style>
