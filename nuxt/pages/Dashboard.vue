<template>
  <div>
    <div class="hidden-sm-and-down">
      <v-layout class="mt-5 mx-5">
        <v-container>
          <v-row>
            <v-col>
              <v-card elevation="2" class="px-5 py-6" min-height="30em">
                <v-card-title class="d-flex justify-center text-h4">
                  Balance
                </v-card-title>
                <div v-if="info !== null">
                  <BalanceChart />
                </div>
              </v-card>
            </v-col>
            <v-col>
              <v-card
                class="px-5 py-6 d-flex flex-column justify-center"
                min-height="30em"
              >
                <Wallet />
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <TxHistory />
            </v-col>
          </v-row>
        </v-container>
      </v-layout>
    </div>
    <div class="hidden-md-and-up mt-5">
      <v-layout d-flex flex-column align-center>
        <v-card elevation="2" class="ma-1 px-3" min-width="95%">
          <v-card-title class="d-flex justify-center text-h4">
            Balance
          </v-card-title>
          <div v-if="info !== null">
            <BalanceChart />
          </div>
        </v-card>
        <v-card elevation="2" class="mx-2 my-2" min-width="95%">
          <Wallet />
        </v-card>
        <TxHistory class="mx-2 my-2" />
      </v-layout>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      info: null,
    }
  },
  mounted() {
    this.$axios
      .get('/api/dashboardinfo')
      .then((res) => res.data)
      .then((data) => data.data)
      .then((data) => (this.info = data))
      .catch(console.error)
  },
}
</script>
