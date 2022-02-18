<template>
  <div class="d-flex flex-column mt-8 align-center">
    <v-flex xs12 md12 lg10 xl8 class="container">
      <div>
        <div class="d-flex align-center justify-space-between">
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
          <v-btn text href="#" color="primary"> Game rules </v-btn>
          <div class="d-flex align-center">
            <span class="title">Total bets (sats): 1320</span>
          </div>
        </div>
      </div>
    </v-flex>

    <h1>What's your favorite project?</h1>

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
import { mapGetters } from "vuex";
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

<style></style>
