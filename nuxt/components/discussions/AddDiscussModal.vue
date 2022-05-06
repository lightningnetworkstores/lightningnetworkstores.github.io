<template>
  <div class="">
    <v-btn
      color="green"
      class="mt-16"
      dark
      fab
      fixed
      bottom
      right
      @click="openDialog"
    >
      <v-icon>mdi-comment</v-icon>
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
                      outlined
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
                <ImageSelector @onImageSelected="onImageSelected"/>
                <v-divider class="my-2"/>
                <div class="text-body-1 mx-1">What is this about?</div>
                <v-layout row>
                  <v-radio-group class="mx-3" row v-model="about">
                    <v-radio label="Store" value="store"></v-radio>
                    <v-radio label="Topic" value="other"></v-radio>
                  </v-radio-group>
                </v-layout>
                <v-layout row>
                  <v-flex pl-3 pr-3 v-if="about === 'store'">
                    <v-autocomplete
                      outlined
                      :items="storeSummary"
                      label="Store (optional)"
                      v-model="addDiscussionForm.storeId"
                    />
                  </v-flex>
                  <v-flex pl-3 pr-3 v-if="about === 'other'">
                    <v-select
                      outlined
                      v-model="selectedTopic"
                      :items="topicsWithout('MERCHANTS')"
                      label="Topics"
                    >
                    </v-select>
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
import { mapState, mapGetters } from 'vuex'

import Checkout from '@/components/Checkout.vue'
import Success from '@/components/Success.vue'
import ImageSelector from '@/components/discussions/ImageSelector'
import { IMAGE_TYPE_FILE_UPLOAD, IMAGE_TYPE_URL } from '@/utils/constants'

export default {
  name: 'AddDiscussModal',
  components: {
    Checkout,
    Success,
    ImageSelector
  },
  data() {
    return {
      showAddDialog: false,
      addDiscussionForm: {},
      addAlert: { message: '', success: true },
      confirm_title: 'Success!',
      isLoading: false,

      paymentRequest: '',
      paymentID: '',
      expiryTime: new Date(),
      isPaid: false,
      tweet: null,
      selectedTopic: 'OTHER',
      checkPaymentTimer: null,
      addDiscussionFee: 0,
      about: 'other',
      image: null
    }
  },
  computed: {
    ...mapState(['storeSummary', 'baseURL']),
    ...mapGetters('discussions', ['topicsWithout'])
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

    onImageSelected(event) {
      // {type: <IMAGE_TYPE_FILE_UPLOAD|IMAGE_TYPE_URL>, value: <File|String>}
      this.image = event
    },
    async submitAdd(event) {
      if (this.$refs.addform.validate(true)) {
        this.isLoading = true
        this.addAlert = { message: '', success: true }
        this.isPaid = false
        let uploadImageResponse = null
        if (this.image && this.image.type === IMAGE_TYPE_FILE_UPLOAD) {
          try {
            uploadImageResponse = await this.$store.dispatch('discussions/addImage', this.image.value)
          } catch(err) {
            this.isLoading = false
            return this.$store.dispatch('networkError/showError', err)
          }
        }
        let recaptchaToken = await this.$recaptcha.execute('create_discussion')
        const payload = {
          title: this.addDiscussionForm.title,
          comment: this.addDiscussionForm.comment,
          recaptchaToken: recaptchaToken
        }
        if (uploadImageResponse) {
          payload.url = `${this.baseURL}${uploadImageResponse.data.path.slice(1)}`
        }
        if (this.addDiscussionForm.storeId) {
          payload.storeID = this.addDiscussionForm.storeId
        }
        if (this.selectedTopic) {
          payload.topic = this.selectedTopic
        }
        
        console.log(payload.recaptchaToken)
        

        this.$store.dispatch('discussions/addDiscussion', payload).then(
          data => {
            const { amount, payment_request, id, submitted } = data
            if (!payment_request && submitted) {
              this.$store.dispatch('discussions/getDiscussions')
              return this.closeDialog()
            }
            this.addDiscussionFee = amount
            this.paymentRequest = payment_request
            this.paymentID = id

            let date = new Date()
            this.expiryTime = new Date(
              date.setSeconds(date.getSeconds() + 3600)
            )
            this.checkPaymentTimer = setInterval(() => {
              this.checkPayment()
            }, 3000)
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
              this.$store.dispatch('discussions/getDiscussions')
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
