<template>
  <div>
    <v-layout justify-center class="mt-5">
      <v-row>
        <v-col>
        </v-col>
        <v-col>
          <v-card elevation="2">
            <v-card-title class="d-flex justify-center">Balance</v-card-title>
            <div v-if="info !== null">
              <v-card-text v-if="info !== null">
                Available Balance: {{ info.balance.available }}
              </v-card-text>
              <v-card-text>
                Pending Deposits: {{ info.balance.pending_deposits }}
              </v-card-text>
              <v-card-text>
                Pending Withdrawals: {{ info.balance.pending_withdrawals }}
              </v-card-text>
              <v-card-text>
                Unsettled Bets: {{ info.balance.unsettled_bets }}
              </v-card-text>
              <v-card-text>
                Pending Affiliate: {{ info.affiliate.pending }}
              </v-card-text>
            </div>
          </v-card>
        </v-col>
        <v-col>
        </v-col>
      </v-row>
    </v-layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      info: null
    }
  },
  mounted() {
    this.$axios.get('/api/dashboardinfo')
      .then(res => res.data)
      .then(data => data.data)
      .then(data => this.info = data)
      .catch(console.error)
  }
}
</script>