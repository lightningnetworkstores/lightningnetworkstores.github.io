<template>
  <div class="text-center">
    <v-dialog
      v-model="showDialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon large v-bind="attrs" v-on="on">
          <v-icon>mdi-help-circle</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5 lighten-2">
          Payout calculation
        </v-card-title>
        <v-card-text class="pb-0"><b>Total bitcoin to be paid out</b>: {{contest.pot - contest.pot_bonus}} (bets) + {{contest.pot_bonus}} (pot bonus) - {{contest.house_cut}} (house cut) = {{potToDistribute}} sats</v-card-text>
        <br>
        <v-card-text><b>Winning bets</b>: {{ winningBets}} sats </v-card-text>
        <v-card-text><b>Return for winning bets</b>: 100*({{potToDistribute}} - {{winningBets}})/{{winningBets}} = {{contest.roi}} %</v-card-text>
        <!-- <v-card-text>Losing bets: {{ losingBets }} sats</v-card-text> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="showDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    contest: {
      type: Object,
      default: () => ({
        pot: 0,
        rake: 0,
        roi: 0,
        house_cut: 0
      })
    }
  },
  computed: {
    potToDistribute(){
      return this.contest.pot - this.contest.house_cut;
    },
    winningBets(){
      return Math.floor((this.contest.pot - this.contest.house_cut)/(1 + this.contest.roi/100))
    },
    losingBets(){
      return this.contest.pot - this.contest.pot_bonus - this.winningBets
    }
  },
  data() {
    return {
      showDialog: false
    }
  }
}
</script>