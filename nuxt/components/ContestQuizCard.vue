<template>
  <v-card hover :disabled="disabled">
    <v-card-title>{{ option }}</v-card-title>
    <v-card-actions>
      <v-btn
        text
        color="blue-grey"
        class="mx-2 white--text"
        @click="choseOption(contestId, option)"
      >
        <v-icon left dark> mdi-star </v-icon>
        chose
      </v-btn>

      <v-btn
        text
        color="orange darken-1"
        class="mx-2 white--text"
        @click="placeBet(contestId, option)"
      >
        <v-icon left dark> mdi-crown-circle </v-icon>
        Place a bet
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["option", "disabled", "contestId"],
  methods: {
    choseOption(contestId, option) {
      this.$store.dispatch("choseOption", { contestId, choice: option });
    },
    placeBet(contestId, option) {
      this.$store.dispatch("placeBet", {
        contestId,
        choice: option,
        amount: 2,
      });
    },
  },
};
</script>

<style></style>
