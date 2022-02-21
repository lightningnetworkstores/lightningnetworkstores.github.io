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

    <h1 class="pt-10">What's your favorite project?</h1>

    <v-container class="full-list mt-8" ref="list">
      <contest-store-card
        v-for="store in storeContest.stores"
        :data-storeId="store.id"
        :key="'store-' + store.id"
        :store="store"
      />
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import FlipCountdown from "vue2-flip-countdown";

export default {
  components: { FlipCountdown },
  data() {
    return {
      deadline: "2021-12-25 00:00:00",
    };
  },
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
  },
  watch: {
    "storeContest.contest.end"(val) {
      this.deadline = new Date(val).toLocaleString();
    },
  },
  mounted() {
    this.$store.dispatch("getStoreContest");
  },
};
</script>

<style>
.contest-info {
  row-gap: 32px !important;
}
</style>
