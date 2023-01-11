<template>
  <div>
    <div v-if="isSuccess" class="d-flex flex-column justify-center align-center">
      <div class="text-h5 text-center">Success!</div>
      <div class="text-body-1">
        Add <strong>{{ address.adr }}</strong> to contact book?
      </div>
      <v-text-field
        v-model="contactName"
        class="mt-3"
        label="Contact Name"
        hint="Optional field"
        style="min-width: 60%"
        outlined dense
      />
      <div class="mt-4">
        <v-btn
          color="primary"
          outlined
          min-width="100"
          @click="onAddContact"
        >
          Add
        </v-btn>
        <v-btn
          color="red"
          outlined
          min-width="100"
          @click="onCancelAddContact"
        >
          Cancel
        </v-btn>
      </div>
    </div>
    <div v-else>
      <v-form>
        <v-autocomplete
          v-model="address"
          :items="suggestions"
          item-text="adr"
          item-value="adr"
          :search-input.sync="search"
          :filter="contactFilter"
          outlined
          dense
          type="email"
          label="Lightning Address"
          hint="Any lightning address. Ex: some-user@lntxbot.com"
          hide-no-data
          hide-selected
          return-object
          :disabled="isProcessing"
          :rules="addressRules"
        >
          <template v-slot:item="data">
            <div class="d-flex">
              <div>{{ data.item.adr }}</div>
              <div v-if="!data.item.hideName && data.item.name" class="ml-3 text--secondary">
                [ {{ data.item.name  }} ]
              </div>
            </div>
          </template>
        </v-autocomplete>
        <v-text-field
          v-model="amount"
          outlined
          dense
          type="number"
          label="Amount (sats)"
          hint="Enter an amount in sats"
          :disabled="isProcessing"
          :rules="amountRules"
        />
        <v-text-field
          v-model="comment"
          outlined
          dense
          type="text"
          label="Comment"
          hint="Any comment (optional)"
          :disabled="isProcessing"
        />
      </v-form>
      <div class="text-caption font-weight-light">
        Fee: {{ LIGHTNING_ADDRESS_FEE_AMOUNT }} %
      </div>
      <v-btn
        width="200"
        @click="sendPayment"
        :disabled="isButtonDisabled"
        color="primary"
      >
        Withdraw
      </v-btn>
      <div class="pt-2 mb-0">
        <v-progress-linear v-if="isProcessing" color="primary" indeterminate/>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import regexMixin from '~/mixins/regex.js'
import { WithdrawalState } from '~/store/wallet'
import Success from '~/components/Success.vue'

const MIN_ADDRESS_LENGTH = 3

const LIGHTNING_ADDRESS_FEE_AMOUNT = 1

export default {
  components: {
    Success
  },
  data() {
    return {
      address: null,
      amount: undefined,
      comment: '',
      contactName: '',
      search: null,
      suggestions: [],
      LIGHTNING_ADDRESS_FEE_AMOUNT
    }
  },
  mixins: [ regexMixin ],
  methods: {
    async sendPayment() {
      await this.$store.dispatch('wallet/sendPayment', {
        address: this.address.adr,
        amount: parseInt(this.amount),
        comment: this.comment,
        feeAmount: LIGHTNING_ADDRESS_FEE_AMOUNT
      })
      await this.$store.dispatch('wallet/getDashboardInfo')
    },
    reset() {
      this.address = ''
      this.amount = undefined
      this.comment = ''
    },
    async onAddContact() {
      let payload = {
        name: this.contactName,
        adr: this.address.adr
      }
      await this.$store.dispatch('contacts/add', payload)
      await this.$store.dispatch('wallet/resetWithdrawalState')
      this.reset()
    },
    async onCancelAddContact() {
      await this.$store.dispatch('wallet/resetWithdrawalState')
      this.reset()
    },
    contactFilter(item, queryText, itemText) {
      const name = item?.name?.toLowerCase()
      const address = item?.adr?.toLowerCase()
      console.log('contactFilter. name: ', name, ', address: ', address)
      return (name && name.indexOf(queryText) !== -1) ||
        (address && address.indexOf(queryText) !== -1)
    }
  },
  watch: {
    search(newVal, oldVal) {
      const contacts = this.addresses ? this.addresses : []
      let updatedSuggestions = [
        {
          adr: newVal, name: '', hideName: true
        },
        ...contacts
      ]
      this.suggestions = updatedSuggestions
    }
  },
  computed: {
    isButtonDisabled() {
      return this.amount === undefined ||
        this.amount < 0 ||
        Number.parseInt(this.amount) === NaN ||
        this.address.length < MIN_ADDRESS_LENGTH ||
        this.isProcessing
    },
    amountRules() {
      return [
        v => !!v || v === undefined || 'Enter any amount',
        v => Number.parseInt(v) !== NaN || v === undefined || 'Please enter a number',
        v => Number.parseInt(v) > 0 || v === undefined || 'Must be a positive number'
      ]
    },
    addressRules() {
      return [
        v => !!v || v === '' || 'Enter a Lightning Address',
        v => {
          if (!v) return true
          v = v.adr
          if (v.length < MIN_ADDRESS_LENGTH) return true
          if (this.isValidEmail(v)) return true
          else return 'Not a valid Lightning Address'
        }
      ]
    },
    ...mapState({
      isProcessing: state => state.wallet.withdrawal.state === WithdrawalState.PROCESSING,
      isSuccess: state => state.wallet.withdrawal.state === WithdrawalState.SUCCESS,
      addresses: state => state.contacts.contacts
    })
  }
}
</script>