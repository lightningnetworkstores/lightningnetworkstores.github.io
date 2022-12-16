<template>
  <div>
    <template v-if="isInfo">
      <span v-if="isUpvoting" @click="showDialog = true">
        <v-btn fab dark color="success"
          ><v-icon large>mdi-arrow-up</v-icon></v-btn
        >
      </span>
      <span v-else @click="showDialog = true">
        <v-btn fab dark color="error"
          ><v-icon large>mdi-arrow-down</v-icon></v-btn
        >
      </span>
    </template>
    <template v-else>
      <span v-if="isUpvoting" @click="showDialog = true">
        <v-btn fab dark color="success" x-small
          ><v-icon size="24" class="arrow up" >mdi-arrow-up</v-icon></v-btn
        ></span
      >
      <span v-else @click="showDialog = true">
        <v-icon width="100%" size="16" class="arrow down" color="red"
          >mdi-arrow-down</v-icon
        >
      </span>
    </template>

    <v-dialog
      v-model="showDialog"
      persistent
      max-width="500"
      style="overflow-x: hidden"
    >
      <v-card>
        <template v-if="showDialog">
          <Success
            v-if="paymentRequest && isPaid"
            :tweet="tweet"
            :store="store"
            :confirm_title="'Payment successful'"
            @cancel="cancel"
          />
          <div v-else>
            <v-layout row v-if="commentAlert.message.length">
              <v-flex pa-3>
                <v-alert
                  :value="commentAlert.message"
                  :type="commentAlert.success ? 'success' : 'error'"
                  transition="scale-transition"
                >
                  {{ commentAlert.message }}
                </v-alert>
              </v-flex>
            </v-layout>
            <v-card-title class="headline">
              <span v-if="isUpvoting && !parentComment && !parentReview"
                >Upvote</span
              ><span v-if="!isUpvoting && !parentComment && !parentReview"
                >Downvote</span
              >
              <span v-if="!parentReview && !parentComment"
                >&nbsp;{{ store.name }}</span
              >
              <span v-if="parentReview && !parentComment && isReviewUpvote"
                >Reinforce positive review & upvote</span
              >
              <span v-if="parentReview && !parentComment && !isReviewUpvote"
                >Reinforce negative review & downvote</span
              >
              <span v-if="parentComment">Reply</span>

              <v-flex class="corner-loading" v-if="paymentRequest && !isPaid"
                ><v-progress-circular
                  indeterminate
                  size="20"
                  color="green"
                ></v-progress-circular
              ></v-flex>
            </v-card-title>
            <v-card-text>
              <v-layout row>
                <v-flex
                  pl-3
                  pr-3
                  v-if="!paymentRequest.length && !parentComment"
                >
                  <v-text-field
                    v-model="upvoteDialogForm.amount"
                    type="number"
                    label="Number of upvotes (1 vote = 1 satoshi)"
                    hint=""
                    :rules="[(v) => !!v || 'Amount is required']"
                  ></v-text-field>
                  <v-textarea
                    v-if="!parentReview"
                    v-model="upvoteDialogForm.comment"
                    type="text"
                    :counter="this.$store.state.configuration.max_comment_size"
                    :label="
                      'Review (optional - minimum ' +
                      minCreateReview +
                      ' satoshis)'
                    "
                    rows="4"
                    :rules="[maxCommentSizeRule]"
                  ></v-textarea>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex
                  pl-3
                  pr-3
                  v-if="!paymentRequest.length && parentComment"
                >
                  Cost: {{ upvoteDialogForm.amount }} satoshis
                  <v-textarea
                    v-if="parentReview && parentComment"
                    v-model="upvoteDialogForm.comment"
                    type="text"
                    :counter="this.$store.state.configuration.max_comment_size"
                    label="Reply"
                    rows="4"
                    :rules="[
                      maxCommentSizeRule,
                      (v) => !!v || 'Reply is required',
                    ]"
                  ></v-textarea>
                </v-flex>
              </v-layout>
              <Checkout
                v-if="paymentRequest"
                :warningMessage="warningMessage"
                :paymentRequest="paymentRequest"
                :satoshi="upvoteDialogForm.amount"
                @cancel="cancel"
              />
            </v-card-text>
          </div>

          <v-card-actions v-if="!paymentRequest">
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="cancel"> Cancel </v-btn>

            <v-btn color="green darken-1" text @click="getInvoice">
              Get invoice
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import QrcodeVue from "qrcode.vue";
import Checkout from '@/components/Checkout.vue'
import Success from '@/components/Success.vue'

export default {
  componets: {
    Checkout,
    Success,
  },
  props: {
    store: { required: true },
    parentReview: { required: false },
    parentComment: { required: false },
    isReviewUpvote: { required: false },
    isReplyToSubComment: { required: false },
    isUpvoting: { required: false },
    isInfo: { required: false },
  },
  data() {
    return {
      showDialog: false,
      upvoteDialogForm: { amount: 0, comment: this.getReplyingTo() },

      paymentRequest: '',
      paymentID: '',
      expiryTime: new Date(),
      isPaid: false,
      tweet: null,

      checkPaymentTimer: null,

      commentAlert: { message: '', success: false },

      warningMessage: '',
    }
  },
  computed: {
    minCreateReview() {
      return this.$store.state.configuration.min_post
    },
    encodedComment() {
      return this.upvoteDialogForm.comment
    },
  },

  async created() {
    this.upvoteDialogForm.amount = this.minCreateReview
  },
  methods: {
    reply() {
      this.showDialog = true
    },

    vote(upvote) {
      this.isUpvoting = upvote
      this.showDialog = true
    },

    cancel() {
      if (this.paymentRequest.length > 0) {
        this.paymentRequest = ''
      } else {
        this.closeDialog()
      }

      if (!this.isPaid) {
        clearInterval(this.checkPaymentTimer)
      } else {
        this.closeDialog()
        if (
          this.parentReview ||
          this.parentComment ||
          typeof this.isReviewUpvote !== 'undefined' ||
          this.isReviewUpvote !== null
        )
          location.reload()
      }
    },

    closeDialog() {
      //this.upvoteDialogForm = { amount: this.minCreateReview, comment: '' }
      this.showDialog = false
      this.isPaid = false
      this.paymentID = ''
      this.commentAlert.message = ''
    },

    getReplyingTo() {
      return this.isReplyToSubComment
        ? `@${(this.parentComment
            ? this.parentComment
            : this.parentReview
          ).substring(0, 5)} `
        : ''
    },

    getRecaptchaToken() {
      return this.$recaptcha.execute('low_value_comment')
    },
    async getInvoice() {
      this.warningMessage = ''
      // validations
      if (
        this.upvoteDialogForm.comment.indexOf('>') > -1 ||
        this.upvoteDialogForm.comment.indexOf('<') > -1 ||
        this.upvoteDialogForm.comment.indexOf('"') > -1
      ) {
        this.commentAlert.message =
          'Comment contains invalid characters (>, < or "), please remove them.'
        return
      }

      if (
        this.encodedComment.length > 0 &&
        this.upvoteDialogForm.amount < this.minCreateReview
      ) {
        this.commentAlert.message =
          'Vote at least ' +
          this.minCreateReview +
          ' satoshis to be able to write a review/reply.'
        return
      }

      if (
        this.encodedComment.length >=
        this.$store.state.configuration.max_comment_size
      ) {
        this.commentAlert.message = 'Comment is too long.'
        return
      } // end validation

      this.commentAlert.message = ''

      let recaptchaToken = await this.getRecaptchaToken()

      this.$store
        .dispatch('getStoreVotePaymentRequest', {
          id: this.store.id,
          amount: this.upvoteDialogForm.amount,
          isUpvote: this.isUpvoting,
          comment: this.encodedComment,
          parent: this.parentReview,
          recaptchaToken: recaptchaToken,
        })
        .then(
          (response) => {
            if (response.status != 'success') {
              if (response.message) this.commentAlert.message = response.message
              this.commentAlert.success = false
              return
            }

            this.upvoteDialogForm.amount = response.amount
            if (response.message) this.warningMessage = response.message
            this.paymentRequest = response.payment_request
            this.paymentID = response.id
            let date = new Date()
            this.expiryTime = new Date(
              date.setSeconds(date.getSeconds() + 3600)
            )
            this.checkPaymentTimer = setInterval(() => {
              this.checkPayment()
            }, 3000)
          },
          (error) => {
            console.error(error)
          }
        )
    },
    checkPayment() {
      //todo: check if payment is done
      if (this.expiryTime > new Date()) {
        this.$store.dispatch('checkPayment', { id: this.paymentID }).then(
          (response) => {
            console.log(response.data.paid)
            if (response.data.paid == true) {
              this.isPaid = true
              clearInterval(this.checkPaymentTimer)
            }
            if (response.data.tweet !== undefined) {
              this.tweet = response.data.tweet
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

    maxCommentSizeRule(v) {
      const { max_comment_size } = this.$store.state.configuration

      return (
        (v || '').length <= max_comment_size ||
        `Review has to be shorter than ${max_comment_size} characters.`
      )
    },

    stopPayment() {
      clearInterval(this.checkPaymentTimer)
      this.paymentRequest = ''
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.vote {
  &.store-card {
    width: 50px;
  }
}
.number {
  font-size: 15px !important;
}
.corner-loading {
  position: absolute;
  right: 10px;
  top: 4px;
}
.arrow {
  padding: 5px;

  &.up:hover {
    background-color: rgba(76, 175, 80, 0.12);
  }
  &.down:hover {
    background-color: rgba(255, 82, 82, 0.12);
  }
}
</style>
