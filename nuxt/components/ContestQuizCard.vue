<template>
  <v-card hover :disabled="disabled" :class="{ selected: 'selected' }">
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
        {{ selected ? 'already chosen' : 'chose' }}
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
            v-model="amount"
            placeholder="20"
            hint="min 20 sats"
            prefix="$"
            :rules="[rules.required, rules.number]"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="disableDoneButton"
            text
            @click="placeBet"
          >
            Done
          </v-btn>
          <v-btn color="secondary" text @click="openAmountModal = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  props: ['option', 'disabled', 'contestId', 'selected'],
  data() {
    return {
      amount: '0',
      openAmountModal: false,
      rules: {
        required: (value) => !!value || 'Required.',
        counter: (value) => value.length <= 20 || 'Max 20 characters',
        number: (value) => {
          const pattern = /^[0-9]*$/
          return (pattern.test(value) && value >= 20) || 'Invalid amount.'
        },
      },
    }
  },
  computed: {
    disableDoneButton() {
      return this.amount < 20 || this.amount.length < 1
    },
  },
  methods: {
    chooseOption() {
      this.$store
        .dispatch('choseOption', {
          contestID: this.contestId,
          choice: this.option,
        })
        .then(() => {
          this.$store.dispatch('getQuizContest')
        })
    },
    placeBet() {
      this.$store
        .dispatch('placeBet', {
          contestID: this.contestId,
          choice: this.option,
          amount: this.amount,
        })
        .then(() => {
          this.openAmountModal = false
          this.amount = '0'
          this.$store.dispatch('getQuizContest')
        })
    },
  },
}
</script>

<style>
.selected {
  background-color: #ffc888;
}
</style>
