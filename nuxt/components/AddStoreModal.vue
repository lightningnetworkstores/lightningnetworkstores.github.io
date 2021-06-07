<template>
  <div class="add-store-modal">
    <v-btn
      color="green"
      dark
      fab
      fixed
      bottom
      right
      @click="showAddDialog = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Add store modal -->
    <v-dialog
      v-model="showAddDialog"
      max-width="500"
      persistent
      style="overflow-x: hidden"
    >
      <template v-if="showAddDialog">
        <v-card>
          <v-layout row v-if="addAlert.message.length">
            <v-flex pa-3>
              <v-alert
                :value="addAlert.message"
                :type="addAlert.success ? 'success' : 'error'"
                transition="scale-transition"
              >
                {{ addAlert.message }}
              </v-alert>
            </v-flex>
          </v-layout>
          <div v-if="paymentRequest.length && isPaid" class="text-center">
            <!-- paymentRequest && isPaid -->
            <v-card-title class="headline">
              <v-row class="py-2">
                <v-flex>Payment successful</v-flex>
              </v-row>
            </v-card-title>
            <v-icon size="100" color="green" pa-5>fas fa-check-circle</v-icon>

            <blockquote class="twitter-tweet" v-if="tweet">
              <a :href="'https://twitter.com/x/status/' + tweet"></a>
            </blockquote>
            <script
              async
              src="https://platform.twitter.com/widgets.js"
              charset="utf-8"
            ></script>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="green darken-1" text @click="cancel"> Close </v-btn>
            </v-card-actions>
          </div>

          <div v-else>
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

            <div v-if="paymentRequest">
              <v-layout row class="ma-0">
                <v-flex pa-3 class="text-center"
                  ><h3>{{ addStoreFee }} sat</h3></v-flex
                >
              </v-layout>
              <v-layout row class="ma-0">
                <v-flex pl-3 pr-3 class="text-center"
                  ><qrcode-vue
                    class="qrcode"
                    size="300"
                    :value="paymentRequest"
                  ></qrcode-vue
                ></v-flex>
              </v-layout>

              <v-layout row class="ma-0">
                <v-flex pl-3 pr-3>
                  <v-text-field
                    :value="paymentRequest"
                    label="Invoice"
                    hint=""
                    append-icon="fa-copy"
                    type="text"
                    id="paymentrequest"
                    @click:append="copy"
                  ></v-text-field
                ></v-flex>
              </v-layout>
              <v-layout row class="ma-0">
                <v-flex pl-3 pr-3 class="text-center">
                  <a :href="'lightning:' + paymentRequest" class="link-button"
                    >Open in wallet</a
                  >
                </v-flex>
              </v-layout>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" text @click="cancel">
                  Cancel
                </v-btn>
              </v-card-actions>
            </div>

            <v-card-text>
              <v-form
                @submit.prevent="submitAdd"
                ref="addform"
                v-if="!paymentRequest.length"
              >
                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-text-field
                      v-model="addDialogForm.name"
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
                      v-model="addDialogForm.url"
                      label="Website URL"
                      hint="eg. https://lightningnetworkstores.com"
                      :rules="[
                        (v) => !!v || 'Website URL is required',
                        (v) =>
                          /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
                            v
                          ) ||
                          'Enter a valid url eg. https://lightningnetworkstores.com',
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
                    <v-combobox
                      v-model="addDialogForm.sector"
                      item-text="name"
                      item-value="prop"
                      label="Sector"
                      :items="sectorFormItems"
                      return-object
                      :rules="[(v) => !!v || 'Sector is required']"
                    ></v-combobox>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-combobox
                      v-model="addDialogForm.digitalGoods"
                      item-text="name"
                      item-value="prop"
                      label="Digital goods"
                      :items="digitalGoodFormItems"
                      return-object
                      :rules="[(v) => !!v || 'Digital goods is required']"
                    ></v-combobox>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-text-field
                      v-model="addDialogForm.contributor"
                      label="Contributor code (optional)"
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

                <v-row class="my-3">
                  <v-flex grow></v-flex>
                  <v-flex pl-3 pr-3 shrink v-if="showAddDialog">
                    <recaptcha />
                  </v-flex>
                  <v-flex grow></v-flex>
                </v-row>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    color="green darken-1"
                    text
                    @click="showAddDialog = false"
                  >
                    {{ paymentRequest && isPaid ? 'Close' : 'Close' }}
                  </v-btn>

                  <v-btn color="green darken-1" text type="submit">
                    Submit
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </div>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
// import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

export default {
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
      addDialogForm: {},
      addAlert: { message: '', success: true },
      isLoading: false,

      paymentRequest: '',
      paymentID: '',
      expiryTime: new Date(),
      isPaid: false,
      tweet: '807811447862468608',

      checkPaymentTimer: null,
    }
  },
  watch: {
    showAddDialog() {
      //           onChildChanged(val, oldVal) {
      //               if (val && !oldVal) {
      //                   document.getElementsByTagName('body')[0].className = 'noscroll'
      //     } else if (!val && oldVal) {
      //         document.body.classList.remove('noscroll')
      //     }
      //   }
    },
  },
  computed: {
    addStoreFee() {
      return this.$store.state.addStoreFee
    },
  },
  methods: {
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

    async submitAdd(event) {
      let token = null
      this.$refs.addform.validate()
      try {
        token = await this.$recaptcha.getResponse()
        await this.$recaptcha.reset()
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
            sector: this.addDialogForm.sector.prop,
            digitalGoods: this.addDialogForm.digitalGoods.prop,
            contributor: this.addDialogForm.contributor,
            recaptcha: token,
          })
          .then(
            (response) => {
              console.log(response)
              if (
                response.message.includes(
                  'Please pay this anti-spam fee or ask for a contributor code.'
                )
              ) {
                this.paymentRequest = response.data.payment_request
                this.paymentID = response.data.invoiceID

                let date = new Date()
                this.expiryTime = new Date(
                  date.setSeconds(date.getSeconds() + 3600)
                )
                this.checkPaymentTimer = setInterval(() => {
                  this.checkPayment()
                }, 3000)
              } else if (
                response.message.includes('Store successfully added')
              ) {
                this.addAlert.message = response.data
                this.addAlert.success = true
                this.addDialogForm = {}
                this.$refs.addform.reset()
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
}
</script>

<style scoped lang="scss">
</style>
