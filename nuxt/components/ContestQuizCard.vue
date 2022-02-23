<template>
  <v-card hover :disabled="disabled" :class="{ selected: 'selected' }">
    <v-card-title>{{ option }}</v-card-title>
    <v-card-actions>
      <v-btn
        text
        color="blue-grey"
        class="mx-2 white--text"
        :disabled="selected"
        @click="chooseOption(contestId, option)"
      >
        <v-icon left dark> mdi-star </v-icon>
        {{ selected ? "already chosen" : "chose" }}
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
    <v-dialog v-model="openAmountModal" max-width="500px">
      <v-card>
        <v-card-title> Amount </v-card-title>
        <v-card-text>
          <v-text-field
            label="Amount"
            value="20"
            hint="min 20 sats"
            prefix="$"
            autofocus
            :rules="[rules.required, rules.number]"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="dialog2 = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  props: ["option", "disabled", "contestId", "selected"],
  data() {
    return {
      openAmountModal: false,
      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 20 || "Max 20 characters",
        number: (value) => {
          const pattern = /^[0-9]*$/;
          return (pattern.test(value) && value >= 20) || "Invalid amount.";
        },
      },
    };
  },
  methods: {
    choseOption(contestId, option) {
      this.$store.dispatch("choseOption", { contestId, choice: option });
    },
    placeBet(contestId, option) {
      this.$store.dispatch("placeBet", {
        contestId,
        choice: option,
        amount: 20,
      });
    },
  },
};
</script>

<style>
.selected {
  background-color: #ffc888;
}
</style>
