<template>
	<div class="faucet">
		<v-layout justify-center>
			<v-flex xs12 md12 lg10 xl8 class="pa-6">
				<v-container>
					<v-layout row class="donor-head">
						<h1>Faucet</h1>
						<v-btn depressed color="primary" @click="donarDialog = true">Donate</v-btn>
					</v-layout>
					<v-layout row pt-3 justify-center class="datatable-layout">
						<v-data-table
						:headers="headers"
						:items="topDonors"
						:items-per-page="20"
						:hide-default-footer="true"
						class="elevation-1"
						></v-data-table>
					</v-layout>
					<v-layout row pt-3 justify-center>
					<vue-hcaptcha ref="invisibleHcaptcha" sitekey="327adc75-957d-4063-9cf3-c4999bead7dd" size="invisible" theme="dark" @verify="onVerify"/>
					<v-btn depressed color="primary" @click="runCaptcha">
						Get Sats
					</v-btn>
					</v-layout>
				</v-container>
			</v-flex>
		</v-layout>
		<v-dialog persistent v-model="donarDialog" max-width="500">
			<v-card>
				<v-card-title class="text-h5">Donate to Faucet</v-card-title>
        <v-card-text>
          <faucets-donate-modal v-on:closeDialog="donarDialog = false" />
        </v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
import VueHcaptcha from '@hcaptcha/vue-hcaptcha';
export default {
    name: "Faucet",
    components: {VueHcaptcha},
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
      donarDialog: false,
      token: null
    }),
		created() {
			this.$store.dispatch('getFaucetDonars').then(
				(response) => {
					console.log('response', response);
					this.donations = response
				},
				(error) => {
					console.error(error)
				}
			)
		},
    mounted(){},
    methods: {
        onVerify(token, ekey){
            this.token = token;
            this.$store.dispatch('faucetClaim', {token: this.token}).then((resp)=>{console.log(resp.data.data['lnurl-withdraw'])});
        },
        runCaptcha(){
            this.$refs.invisibleHcaptcha.execute();
        }
    },
}

</script>
<style scoped>
	.donor-head {
  		justify-content: space-between;
	}
</style>