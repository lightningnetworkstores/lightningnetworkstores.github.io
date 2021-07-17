<template>
  <div class="">
    <v-btn
      color="green"
      class="mt-16"
      dark
      fab
      fixed
      top
      right
      @click="openDialog"
    >
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
          <v-layout v-if="addAlert.message.length">
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
              <v-flex grow>Add new discussion</v-flex>
              <v-flex shrink v-if="isLoading || paymentRequest.length"
                ><v-progress-circular
                  indeterminate
                  size="20"
                  color="green"
                ></v-progress-circular
              ></v-flex>
            </v-card-title>
            <Checkout
              v-if="paymentRequest"
              :satoshi="addDiscussionFee"
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
                      v-model="addDiscussionForm.title"
                      label="Title"
                      hint="eg. Some Title no longer than 100 characters."
                      :rules="[
                        (v) => !!v || 'Title is required',
                        (v) =>
                          (v && v.length < 100) ||
                          'Title must be smaller than 100 characters',
                      ]"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-textarea
                      v-model="addDiscussionForm.comment"
                      type="text"
                      :counter="
                        this.$store.state.configuration.max_comment_size
                      "
                      label="
                       Comment
                      "
                      rows="4"
                      :rules="[
                        (v) =>
                          !v ||
                          v.length <=
                            this.$store.state.configuration.max_comment_size ||
                          'Comment has to be shorter than ' +
                            this.$store.state.configuration.max_comment_size +
                            ' characters',
                      ]"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex pl-3 pr-3>
                    <v-autocomplete
                      :items="storeSummary"
                      label="Store (optional)"
                      v-model="addDiscussionForm.storeId"
                    />
                  </v-flex>
                </v-layout>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="green darken-1" text @click="cancel">
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
import { mapState } from 'vuex'

import Checkout from '@/components/Checkout.vue'
import Success from '@/components/Success.vue'

export default {
  name: 'AddDiscussModal',
  components: {
    Checkout,
    Success,
  },
  data() {
    return {
      showAddDialog: false,
      addDiscussionForm: {},
      addAlert: { message: '', success: true },
      confirm_title: 'Store successfully added.',
      isLoading: false,

      paymentRequest: '',
      paymentID: '',
      expiryTime: new Date(),
      isPaid: false,
      tweet: null,

      checkPaymentTimer: null,
      addDiscussionFee: 0,
    }
  },
  computed: {
    ...mapState(['storeSummary']),
  },
  methods: {
    openDialog() {
      this.$store.dispatch('getStoreSummary')
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
      if (this.$refs && this.$refs.addform) {
        this.$refs.addform.reset()
      }
      this.addDiscussionForm = {}
      this.showAddDialog = false
      this.isPaid = false
      this.paymentID = ''
      this.addAlert = { message: '', success: true }
      this.isLoading = false
    },

    async submitAdd(event) {
      if (this.$refs.addform.validate(true)) {
        this.isLoading = true
        this.addAlert = { message: '', success: true }
        this.isPaid = false
        let recaptchaToken = await this.$recaptcha.execute('create_discussion')
        const payload = {
          title: this.addDiscussionForm.title,
          comment: this.addDiscussionForm.comment,
          recaptchaToken: recaptchaToken
        }
        if (this.addDiscussionForm.storeId) {
          payload.storeID = this.addDiscussionForm.storeId
        }

        
        console.log(payload.recaptchaToken)
        

        this.$store.dispatch('addDiscussion', payload).then(
          (response) => {
            if (response.status === 'success') {
              this.addDiscussionFee = response.data.amount
              this.paymentRequest = response.data.payment_request
              this.paymentID = response.data.id
              //     this.confirm_title = 'Store successfully added.'

              let date = new Date()
              this.expiryTime = new Date(
                date.setSeconds(date.getSeconds() + 3600)
              )
              this.checkPaymentTimer = setInterval(() => {
                this.checkPayment()
              }, 3000)
            } else {
              this.addAlert.message = response.message
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
              this.addDiscussionForm = {}
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
.cardContent {
  max-height: 60vw;
}
</style>
