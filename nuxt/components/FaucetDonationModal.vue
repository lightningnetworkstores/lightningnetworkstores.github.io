<template>
	<div class="FaucetDonationModal">
		<form v-if="!pendingDonation && !donationPaid" @submit.prevent="submit">
			<v-text-field
				v-model="amount"
        type="number"
				label="Amount"
				required
				></v-text-field>
			<v-text-field
				v-model="totalDays"
        type="number"
				label="Distribute in the next days"
        min="1"
        max="99"
				required
				></v-text-field>
			<v-text-field
				v-model="name"
				label="Name"
				></v-text-field>
			<v-text-field
				v-model="message"
				label="Message"
				></v-text-field>
			<v-text-field
				v-model="url"
        type="url"
				label="URL"
				></v-text-field>
			<v-btn class="mr-4" type="submit">submit</v-btn>
			<v-btn @click="cancel">Close</v-btn>
		</form>
    <Checkout
      v-if="pendingDonation"
      :satoshi="satoshi"
      :paymentRequest="paymentRequest"
      @cancel="cancel"
    />
    <Success
      v-if="donationPaid"
      @cancel="cancel"
    />
	</div>
</template>
<script>
    import Checkout from '@/components/Checkout.vue'
    import Success from '@/components/Success.vue'

  	export default {
		name: "FaucetDonationModal",
        components: {
        Checkout,
        Success,
      },
    	data: () => ({
        amount: null,
        totalDays: null,
        name: '',
        message: '',
        url: '',
        pendingDonation: false,
        donationPaid: false,
        paymentRequest: '',
        satoshi: '',
        interval: null
    	}),
    	methods: {
        submit () {
          const requestObj = {
            timeout_days: this.totalDays,
            amount: this.amount
          };

            if (this.name) {
                requestObj['name'] = this.name
            }
            if (this.message) {
                requestObj['message'] = this.message
            }
            if (this.URL) {
                requestObj['URL'] = this.URL
            }

          this.$store.dispatch('doFaucetDonation', { data: requestObj } ).then((response) => {
              let data = response.data
              this.paymentRequest = data.invoice
              this.satoshi = data.amount
              this.pendingDonation = true
              this.checkInvoice(data.id);
          }, (error) => {
              console.log(error);
          });
        },

        checkInvoice (invoiceId) {
          this.interval = setInterval(() => {
            this.$store.dispatch('verifyInvoiceRequest', { id: invoiceId } ).then((response) => {
              if (response.data.paid) {
                clearInterval(this.interval);
                this.donationPaid = true
                this.pendingDonation = false
              }
            }, (error) => {
              console.log(error);
            });
          }, 5000);
        },

        cancel () {
          this.amount = ''
		  this.totalDays = ''
          this.name = ''
          this.message = ''
          this.url = ''
          this.$emit('closeDialog');
        }
    	},
  	}
</script>