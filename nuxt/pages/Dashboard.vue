<template>
  <div>
    <v-layout justify-center class="mt-5">
      <v-row>
        <v-col>
        </v-col>
        <v-col>
          <v-card elevation="2" class="px-5 py-6">
            <v-card-title class="d-flex justify-center">Balance</v-card-title>
            <div v-if="info !== null">
              <BalanceChart/>
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