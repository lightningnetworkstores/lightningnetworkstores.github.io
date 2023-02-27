<template>
  <div>
    <v-btn text color="orange darken-1" class="ma-2 white--text" @click="placeBet()">
      <v-icon left dark> fa-bitcoin </v-icon>
      Place a bet
    </v-btn>
    <place-bet-modal :isOpen.sync="openAmountModal" :contestId="contestId" :choice="choice" :minAmount="minAmount"
      :type="contestType" />
  </div>
</template>

<script>
export default {
  props: {
    contestType: { type: String, required: true },
    contestId: { type: Number, required: true },
    minAmount: { type: Number, required: true },
    choice: { type: Number | String, required: true },
    isLogged: { type: Boolean, required: true }
  },
  emits: ['update:isOpen'],
  data() {
    return {
      openAmountModal: false,
    }
  },
  computed: {
  },
  methods: {
    placeBet() {
      this.checkUserLogged() && (this.openAmountModal = true);
    },
    checkUserLogged() {
      if (this.isLogged) return true

      this.$store.dispatch('modals/openSettingsModal')

      return false;
    }
  },
}
</script>

