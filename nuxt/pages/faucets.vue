<template>
	<div class="faucets">
		<v-layout justify-center>
			<v-flex xs12 md12 lg10 xl8 class="pa-6">
				<v-container>
					<v-layout row class="donor-head">
						<h1>Faucets</h1>
						<v-btn depressed color="primary" @click="donarDialog = true">Donate</v-btn>
					</v-layout>
					<v-layout row pt-3 justify-center class="datatable-layout">
						<v-data-table
						:headers="headers"
						:items="topDonors"
						:items-per-page="5"
						class="elevation-1"
						></v-data-table>
					</v-layout>
					<v-layout row pt-3 justify-center>
						<v-btn depressed color="primary">Get {{ claim }} Sats</v-btn>
					</v-layout>
				</v-container>
			</v-flex>
		</v-layout>
		<v-dialog persistent v-model="donarDialog" max-width="500">
			<v-card>
				<v-card-title class="text-h5">Donate Faucets</v-card-title>
        <v-card-text>
          <faucets-donate-modal />
        </v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
export default {
	name: "Faucets",
    data: () => ({
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Message', value: 'message' },
        { text: 'Total Sats Donated', value: 'total_sats_donated' },
        { text: 'Sats/Claim', value: 'claim' },
      ],
      topDonors: [
        {
          name: 'Random Dude',
          message: 'Buy my bitcoin',
          total_sats_donated: '100000',
          claim: 40
        },
        {
          name: 'Random Dude 2',
          message: 'Follow my twitter',
          total_sats_donated: '200000',
          claim: 13
        },
      ],
      claim: 67,
      donarDialog: false,
    }),
}
</script>
<style scoped>
	.donor-head {
  		justify-content: space-between;
	}
</style>