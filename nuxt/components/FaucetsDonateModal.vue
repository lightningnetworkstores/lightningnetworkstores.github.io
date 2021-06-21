<template>
  <div class="FaucetsDonateModal">
    <form @submit.prevent="submit">
      <v-text-field
        v-model="amount"
        type="number"
        label="Amount"
        required
      ></v-text-field>
      <v-text-field
        v-model="totalDays"
        type="number"
        label="Timeout Days"
        required
      ></v-text-field>
      <v-text-field v-model="name" label="Name"></v-text-field>
      <v-text-field v-model="message" label="Message"></v-text-field>
      <v-text-field v-model="url" type="url" label="URL"></v-text-field>
      <v-btn class="mr-4" type="submit">submit</v-btn>
      <v-btn @click="clear">clear</v-btn>
    </form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'FaucetsDonateModal',
  data: () => ({
    amount: '',
    totalDays: '',
    name: '',
    message: '',
    url: '',
  }),
  methods: {
    submit() {
      const requestObj = {
        timeout_days: this.totalDays,
        amount: this.amount,
        name: this.name,
        message: this.message,
        URL: this.url,
      }
      this.$store.dispatch('donateFaucetsRequest', { data: requestObj }).then(
        (response) => {
          console.log(response)
          this.clear()
        },
        (error) => {
          console.error(error)
          this.clear()
        }
      )
    },
    clear() {
      this.totalDays = ''
      this.amount = ''
      this.name = ''
      this.message = ''
      this.url = ''
    },
  },
}
</script>
