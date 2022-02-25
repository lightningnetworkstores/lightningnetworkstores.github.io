<template>
  <v-dialog
    v-model="isOpen"
    @click:outside="$emit('update:isOpen', false)"
    @keydown="$emit('update:isOpen', false)"
    max-width="500px"
  >
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
        <v-btn color="secondary" text @click="$emit('update:isOpen', false)">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['option', 'contestId', 'isOpen'],
  emits: ['update:isOpen'],
  data() {
    return {
      amount: '0',
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

<style></style>
