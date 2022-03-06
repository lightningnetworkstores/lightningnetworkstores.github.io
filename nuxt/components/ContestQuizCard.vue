<template>
  <v-card hover :disabled="disabled" class="quizCard" :class="{ selected: selected }">
    <v-card-title>{{ option }}</v-card-title>
    <v-card-actions>
      <v-btn
        text
        color="blue-grey"
        class="mx-2 white--text"
        :disabled="selected"
        @click="chooseOption"
      >
        <v-icon left dark> mdi-star </v-icon>
        {{ selected ? "chosen" : "chose" }}
      </v-btn>

      <v-btn
        text
        color="orange darken-1"
        class="mx-2 white--text"
        @click="openAmountModal = true"
      >
        <v-icon left dark> mdi-crown-circle </v-icon>
        Place a bet
      </v-btn>
    </v-card-actions>
    <place-bet-modal
      :isOpen.sync="openAmountModal"
      :contestId="contestId"
      :option="option"
      :minAmount="minBet"
    />
  </v-card>
</template>

<script>
import PlaceBetModal from "./PlaceBetModal.vue";

export default {
  components: { PlaceBetModal },
  props: ["option", "disabled", "contestId", "selected", "minBet"],
  data() {
    return {
      openAmountModal: false,
    };
  },
  methods: {
    chooseOption() {
      this.$store
        .dispatch("choseOption", {
          contestID: this.contestId,
          choice: this.option,
        })
        .then(() => {
          this.$store.dispatch("getQuizContest");
        });
    },
  },
};
</script>

<style>
.selected {
  box-shadow: 0px 0px 10px 0px #00e1ff;
}

.quizCard {
  width: 100%;
}
</style>
