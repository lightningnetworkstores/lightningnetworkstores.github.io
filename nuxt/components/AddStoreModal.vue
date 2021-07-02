<template>
  <div class="add-store-modal">
    <v-btn color="green" dark fab fixed bottom right @click="openDialog">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Add store modal -->
    <v-dialog
      v-model="showAddDialog"
      max-width="500"
      persistent
      style="overflow-x: hidden"
      scrollable
    >
      <template v-if="showAddDialog">
        <v-card>
          <v-layout v-if="addAlert.message">
            <v-flex>
              <v-alert
                :type="addAlert.success ? 'success' : 'error'"
                transition="scale-transition"
                class="mb-0"
              >
                {{ addAlert.message }}
              </v-alert>
            </v-flex>
          </v-layout>
          <Success
            v-if="isPaid"
            :tweet="tweet"
            :confirm_title="confirm_title"
            @cancel="cancel"
          />

          <v-card-text class="pa-0 cardContent" v-else>
            <v-card-title class="headline">
              <v-flex grow>Automatically add new store!</v-flex>
              <v-flex shrink v-if="isLoading || paymentRequest.length"
                ><v-progress-circular
                  indeterminate
                  size="20"
                  color="green"
                ></v-progress-circular
              ></v-flex>
            </v-card-title>

            <v-card-text>
              <v-flex pl-3 pr-3 v-if="!paymentRequest.length">
                Amount due if not a contributor: {{ addStoreFee }} satoshis
              </v-flex>
            </v-card-text>
            <Checkout
              v-if="paymentRequest"
              :satoshi="addStoreFee"
              :paymentRequest="paymentRequest"
              @cancel="cancel"
            />
            <v-card-text>
              <v-form
                @submit.prevent="submitAdd"
                ref="addform"
                v-if="!paymentRequest.length"
              >
                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-text-field
                      v-model="addDialogForm.url"
                      v-debounce:800ms="handleURLChange"
                      label="Website URL"
                      hint="eg. https://lightningnetworkstores.com"
                      :rules="urlRules"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-text-field
                      v-model="addDialogForm.name"
                      class="dialogform-name"
                      :disabled="!isValidUrl(addDialogForm.url)"
                      label="Name"
                      hint="eg. Some name no longer than 50 characters."
                      :rules="[(v) => !!v || 'Name is required']"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-text-field
                      v-model="addDialogForm.description"
                      class="dialogform-description"
                      :disabled="!isValidUrl(addDialogForm.url)"
                      label="Description"
                      hint="eg. Some description no longer than 150 characters."
                      :rules="[
                        (v) => !!v || 'Description is required',
                        (v) =>
                          (v && v.length > 6 && v.split(/\b(\s)/).length > 1) ||
                          'Enter a clear description of the store',
                      ]"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-text-field
                      v-model="addDialogForm.uri"
                      label="Node URI (optional)"
                      hint="eg. 03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f@34.239.230.56:9735 (optional)"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-text-field
                      v-model="addDialogForm.contributor"
                      :append-icon="showContributorCode ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showContributorCode ? 'text' : 'password'"
                      label="Contributor code (optional)"
                       @click:append="showContributorCode = !showContributorCode"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-checkbox
                      v-model="addDialogForm.agreeRemoved"
                      label="I agree that the store may be removed later if it disables lightning payments"
                      :rules="[
                        (v) =>
                          !!v || 'Agreeing with the sites policy is required',
                      ]"
                    ></v-checkbox>
                  </v-flex>
                </v-layout>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    color="green darken-1"
                    text
                    @click="showAddDialog = false"
                  >
                    Close
                  </v-btn>

                  <v-btn color="green darken-1" text type="submit">
                    Submit
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
import Checkout from '@/components/Checkout.vue'
import Success from '@/components/Success.vue'
import regexMixin from '~/mixins/regex.js'
export default {
  components: {
    Checkout,
    Success,
  },
  mixins: [ regexMixin ],
  data() {
    return {
      digitalGoodFormItems: [
        { name: 'Yes', prop: 'yes' },
        { name: 'No, goods shipped', prop: 'no, goods shipped' },
        {
          name: 'No, goods only in a physical store',
          prop: 'no, goods only in-store',
        },
      ],

      sectorFormItems: [
        { name: 'Technology', prop: 'technology' },
        { name: 'VPS & Web hosting', prop: 'vps&web hosting' },
        { name: 'Security', prop: 'security' },
        { name: 'Clothing', prop: 'clothing' },
        { name: 'Exchange', prop: 'exchange' },
        { name: 'Food', prop: 'food' },
        { name: 'Games & Casino', prop: 'games&casino' },
        { name: 'Adult', prop: 'adult' },
        { name: 'Art', prop: 'art' },
        { name: 'Drugs & Supplements', prop: 'drugs&supplements' },
        {
          name: 'Cryptocurrency merchandise',
          prop: 'cryptocurrency merchandise',
        },
        { name: 'Fitness & Sports', prop: 'fitness&sports' },
        { name: 'Other', prop: 'other' },
      ],

      showAddDialog: false,
      showContributorCode: true,
      addDialogForm: { name: '', description: '', url: '' },
      addAlert: { message: '', success: true },
      confirm_title: 'Store successfully added.',
      isLoading: false,

      paymentRequest: '',
      paymentID: '',
      expiryTime: new Date(),
      isPaid: false,
      tweet: null,

      checkPaymentTimer: null,
    }
  },
  computed: {
    addStoreFee() {
      return this.$store.state.addStoreFee
    },
    urlRules() {
      return [
        (v) => !!v || 'Website URL is required',
        (v) => this.isValidUrl(v) || 'Enter a valid url eg. https://lightningnetworkstores.com',
      ]
    }
  },
  methods: {
    openDialog() {
      this.paymentRequest = ''
      this.isPaid = false
      this.showAddDialog = true
    },
    cancel() {
      if (this.paymentRequest.length > 0) {
        this.paymentRequest = ''
      }

      clearInterval(this.checkPaymentTimer)
      this.closeDialog()
    },

    closeDialog() {
      this.addDialogForm = {}
      this.showAddDialog = false
      this.$refs.addform.reset()
      this.isPaid = false
      this.paymentID = ''
      this.addAlert = { message: '', success: true }
    },

    copy() {
      // let input = document.getElementById('paymentrequest')!.focus()
      document.execCommand('SelectAll')
      document.execCommand('copy')
    },

    handleURLChange() {
      if (this.isValidUrl(this.addDialogForm.url) && !this.isLoading) {
        this.isLoading = true
        this.$store.dispatch('getPreview', { url: this.addDialogForm.url })
          .then(result => {
            this.addAlert = {message: '', success: true}
            if (result.success) {
              this.addDialogForm.name = result.name
              this.addDialogForm.description = result.description
            } else {
              this.addAlert = result
              this.addDialogForm.name = ''
              this.addDialogForm.description = ''
            }
          })
          .finally(() => this.isLoading = false)
      }
    },

    async submitAdd() {
      let token = null
      this.$refs.addform.validate()
      try {
        token = await this.$recaptcha.execute('addStore')
      } catch (error) {
        return
      }

      if (token && this.addDialogForm.agreeRemoved) {
        this.isLoading = true
        this.addAlert = { message: '', success: true }
        this.isPaid = false
        this.$store
          .dispatch('addStore', {
            name: this.addDialogForm.name,
            description: this.addDialogForm.description,
            url: this.addDialogForm.url,
            uri: this.addDialogForm.uri,
            contributor: this.addDialogForm.contributor,
            recaptcha: token,
          })
          .then(
            (response) => {
              if (
                response.message.includes(
                  'Please pay this anti-spam fee or ask for a contributor code.'
                )
              ) {
                this.confirm_title = 'Store successfully added.'
                this.paymentRequest = response.data.payment_request
                this.paymentID = response.data.invoiceID

                let date = new Date()
                this.expiryTime = new Date(
                  date.setSeconds(date.getSeconds() + 3600)
                )
                this.checkPaymentTimer = setInterval(() => {
                  this.checkPayment()
                }, 3000)
              } else if (response.data.submitted == true) {
                this.confirm_title = response.message
                this.isPaid = true

                this.addDialogForm = {}

                if (response.data.tweet !== undefined) {
                  this.tweet = response.data.tweet
                }

                // this.addAlert.message = response.data
                // this.addAlert.success = true
                // this.addDialogForm = {}
                // this.$refs.addform.reset()
              } else if (response.status === 'fail') {
                this.addAlert.message = response.message
                this.addAlert.success = false
              } else {
                this.addAlert.message = response.data
                this.addAlert.success = false
              }

              this.isLoading = false
            },
            (error) => {
              console.error(error)
              this.isLoading = false
            }
          )
      }
    },

    checkPayment() {
      //todo: check if payment is done
      if (this.expiryTime > new Date()) {
        this.$store.dispatch('checkPayment', { id: this.paymentID }).then(
          (response) => {
            if (response.data.paid == true) {
              this.isPaid = true
              this.addDialogForm = {}
              clearInterval(this.checkPaymentTimer)

              if (response.data.tweet !== undefined) {
                this.tweet = response.data.tweet
              }
            } else {
              this.isPaid = false
            }
          },
          (error) => {
            console.error(error)
          }
        )
      } else {
        this.stopPayment()
      }
    },

    stopPayment() {
      clearInterval(this.checkPaymentTimer)
      this.paymentRequest = ''
    },
  },
  beforeDestroy() {
    this.$recaptcha.destroy()
  },
  async mounted() {
    try {
      await this.$recaptcha.init()
    } catch (e) {
      console.error(e)
    }
  },
}
</script>

<style scoped lang="scss">
.cardContent {
  max-height: 60vw;
}
</style>
