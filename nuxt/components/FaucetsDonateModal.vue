<template>
	<div class="FaucetsDonateModal">
		<form v-if="!checkoutPage && !invoiceVerified" @submit.prevent="submit">
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
			<v-btn @click="clear">Close</v-btn>
		</form>
    <Checkout
      v-if="checkoutPage && !invoiceVerified"
      :satoshi="satoshi"
      :paymentRequest="paymentRequest"
      @cancel="cancel"
    />
    <Success
      v-if="invoiceVerified"
      @cancel="cancel"
    />
	</div>
</template>
<script>
    import Checkout from '@/components/Checkout.vue'
    import Success from '@/components/Success.vue'

  	export default {
		name: "FaucetsDonateModal",
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
        checkoutPage: false,
        invoiceVerified: false,
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
						requestObj = { ...requestObj, name: this.name }
					}
					if (this.message) {
						requestObj = { ...requestObj, message: this.message }
					}
					if (this.URL) {
						requestObj = { ...requestObj, URL: this.URL }
					}

          this.$store.dispatch('donateFaucetsRequest', { data: requestObj } ).then((response) => {
              let data = response.data
              this.paymentRequest = data.invoice
              this.satoshi = data.amount
              this.checkoutPage = true
              this.clear();
              this.checkInvoice(data.id);
          }, (error) => {
              this.clear();
          });
        },

        checkInvoice (invoiceId) {
          this.interval = setInterval(() => {
            this.$store.dispatch('verifyInvoiceRequest', { id: invoiceId } ).then((response) => {
              let data = response.data
              if (data.status == success) {
                clearInterval(this.interval);
              }
            }, (error) => {
              console.log('yes');
            });
          }, 5000);
        },

        clear () {
          this.amount = ''
					this.totalDays = ''
          this.name = ''
          this.message = ''
          this.url = ''
        },

        cancel () {
          this.$emit('closeDialog');
        }
    	},
  	}
</script>