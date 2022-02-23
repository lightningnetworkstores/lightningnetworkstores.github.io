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
        <span class="title">Total bets (sats): {{ pot }}</span>
      </div>
    </div>

    <h1 class="pt-10">What's your favorite project?</h1>

    <v-container v-if="!isLogged" class="d-flex flex-column mt-8 align-center">
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
      <contest-store-card
        v-for="store in storeContest.stores"
        :data-storeId="store.id"
        :key="'store-' + store.id"
        :store="store"
        :disabled="!isLogged"
      />
    </v-container>

    <v-container class="my-4" v-if="isLogged && userBets">
      <h3 class="mb-4">Your bets</h3>
      <user-bets-table :userBets="userBets" :waitingForEnd="contestFinalized" />
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
      storeContest: "getStoreContest",
    }),
    ...mapState({
      isLogged(state) {
        if (state.loginStatus.user) return state.loginStatus.user.logged;
        else return false;
      },
    }),
    deadline() {
      return this.storeContest.contest?.end
        ? new Date(this.storeContest.contest?.end).toLocaleString()
        : "2020-01-01:00:00:00";
    },
    userBets() {
      return this.quizContest?.user_bets || [];
    },
    pot() {
      return this.storeContest.contest?.pot;
    },
  },
  methods: {
    handleLoginClick() {
      this.$axios
        .get("/api/oauthlogin?platform=twitter")
        .then((res) => res.data)
        .then((data) => {
          const { request_token, authorization_url, platform } = data.data;
          console.log({ request_token, authorization_url, platform });
          window.location.replace(authorization_url);
        });
    },
  },

  beforeMount() {
    this.$store.dispatch("getStoreContest");
  },
};
</script>

<style>
.contest-info {
  row-gap: 32px !important;
}
</style>
