<template>
  <div class="vote">
    <div class="store-card" v-if="!isInfo && !parentReview && !parentComment">
      <div class="text-xs-center">
        <v-flex xs12>
          <vote-button :isUpvoting="true" :store="store" :isInfo="true" />
        </v-flex>
        <v-flex xs12 pa-2>
          <span v-if="sort != 'lifetime'" class="number">{{
            store.upvotes - store.downvotes
          }}</span
          ><span v-else class="number">{{ store.lifetime }}</span>
        </v-flex>

        <v-flex xs12>
          <vote-button :isUpvoting="false" :store="store" :isInfo="true" />
        </v-flex>
      </div>
    </div>
    <div class="store-info" v-if="isInfo == true">
      <v-layout row pt-4 class="mb-3">
        <v-flex grow pa-1>
          <vote-button :isUpvoting="true" :store="store" :isInfo="true" />
        </v-flex>
        <v-flex shrink pa-1>
          <vote-button :isUpvoting="false" :store="store" :isInfo="true" />
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex shrink px-3>{{
          Number(store.upvotes).toLocaleString()
        }}</v-flex>
        <v-flex grow pa-1
          ><v-progress-linear
            color="success"
            background-color="error"
            height="15"
            :value="
              (store.upvotes / (store.upvotes + store.downvotes)) * 100 || 100
            "
          ></v-progress-linear
        ></v-flex>
        <v-flex shrink px-3>{{
          Number(store.downvotes).toLocaleString()
        }}</v-flex>
      </v-layout>
    </div>
    <div class="review" v-if="parentReview && !parentComment">
      <v-btn
        v-if="isReviewUpvote == true"
        icon
        @click.stop="vote(true)"
        outlined
        color="success"
        class="ma-2"
        ><v-icon>mdi-thumb-up</v-icon></v-btn
      >
      <v-btn
        v-else
        icon
        @click.stop="vote(false)"
        outlined
        color="error"
        class="ma-2"
        ><v-icon>mdi-thumb-down</v-icon></v-btn
      >
    </div>
    <template class="comment" v-if="parentComment">
      <a @click.stop="reply()">Reply</a>
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
              <span
                v-if="parentComment"
                >Reply</span
              >

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
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex
                  pl-3
                  pr-3
                  v-if="!paymentRequest.length && parentComment"
                >
                  <div v-if="upvoteDialogForm.amount > 0">
                     Cost: {{ upvoteDialogForm.amount }} satoshis
                  </div>
                   <div v-else>
                    You can reply for free
                  </div>

                  <v-textarea
                    v-if="
                      (parentReview && parentComment) ||
                      type === 'discussion' ||
                      type === 'discussion reply'
                    "
                    v-model="upvoteDialogForm.comment"
                    type="text"
                    :counter="this.$store.state.configuration.max_comment_size"
                    label="Reply"
                    rows="4"
                    :rules="[
                      (v) =>
                        v.length <=
                          this.$store.state.configuration.max_comment_size ||
                        'Reply has to be shorter than ' +
                          this.$store.state.configuration.max_comment_size +
                          ' characters',
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
         <v-snackbar v-model="snackbar" class="m-3">
                Reply successfully added
        <v-btn color="red" text @click="snackbar = false"> Close </v-btn>
      </v-snackbar>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VoteButton from './VoteButton.vue'
import Checkout from '@/components/Checkout.vue'
import Success from '@/components/Success.vue'
export default {
  components: { VoteButton, Checkout, Success },
  props: {
    store: { required: true },
    isInfo: { required: false },
    parentReview: { required: false }, // parentReview and parentComment could almost be same variable if it wasn't for the Review reinforcing scenario
    parentComment: { required: false },
    isReviewUpvote: { required: false },
    isReplyToSubComment: { required: false },
    sort: { required: false },
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      score: {},
      isUpvoting: true,
      recaptchaToken: null,

      showDialog: false,
      upvoteDialogForm: { amount: 0, comment: '' },

      paymentRequest: '',
      paymentID: '',
      expiryTime: new Date(),
      isPaid: false,
      tweet: null,

      checkPaymentTimer: null,

      commentAlert: { message: '', success: false },
      warningMessage: '',
      snackbar: false,
    }
  },
  computed: {
    replyMinimumFee() {
      return this.$store.state.configuration.min_reply
    },
    encodedComment() {
      return encodeURIComponent(
        (this.isReplyToSubComment
          ? `@${(this.parentComment
              ? this.parentComment
              : this.parentReview
            ).substring(0, 5)} ${this.upvoteDialogForm.comment}`
          : this.upvoteDialogForm.comment
        ).trim()
      ).replace(/%20/g, '+')
    },
  },

  async created() {
    this.upvoteDialogForm.amount = this.replyMinimumFee
  },

  methods: {
    reply() {
      this.showDialog = true
    },

    vote(upvote) {
      this.isUpvoting = upvote
      this.showDialog = true
    },

    copy() {
      // let input = document.getElementById('paymentrequest')!.focus()
      document.execCommand('SelectAll')
      document.execCommand('copy')
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
      this.upvoteDialogForm = { amount: this.replyMinimumFee, comment: '' }
      this.showDialog = false
      this.isPaid = false
      this.paymentID = ''
      this.commentAlert.message = ''
    },
    sleepMs(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },

    async storeVotePaymentRequest() {
      try {
        const result = await this.$store.dispatch(
          'getStoreVotePaymentRequest',
          {
            id: this.store.id,
            amount: this.upvoteDialogForm.amount,
            isUpvote: this.isUpvoting,
            comment: this.encodedComment,
            parent: this.parentReview,
            recaptchaToken: this.recaptchaToken,
          }
        )

        if(result.status != 'success'){
            if (result.message) this.commentAlert.message = result.message
            this.commentAlert.success = false
            return
        }

        if (result.submitted) {
          this.isPaid = true
          this.snackbar = true
          await this.sleepMs(2000)
          location.reload()
          return
        }

        this.upvoteDialogForm.amount = result.amount
        this.paymentRequest = result.payment_request
        if (result.message) this.warningMessage = result.message
        this.paymentID = result.id
        let date = new Date()
        this.expiryTime = new Date(date.setSeconds(date.getSeconds() + 3600))
        this.checkPaymentTimer = setInterval(() => {
          this.checkPayment()
        }, 3000)
      } catch (error) {
        console.error(error)
      }
    },

    discussionReplyPaymentRequest() {
      let payload = {
        parent: this.type === 'discussion' ? this.parentComment : this.parentReview,
        comment: this.encodedComment,
        recaptchaToken: this.recaptchaToken,
      }
      if (this.store && this.store.id) {
        payload.storeID = this.store.id
      }
      this.$store.dispatch('getDiscussionReplyPaymentRequest', payload).then(
        (response) => {
          if (response.status === 'success') {
            if(response.data.submitted){
                this.isPaid = true
                this.snackbar = true
                setTimeout(()=> location.reload(), 2000)
                location.reload()
                return
            }
            this.upvoteDialogForm.amount = response.data.amount
            this.paymentRequest = response.data.payment_request
            this.paymentID = response.data.id
            if (response.message) this.warningMessage = response.message
            let date = new Date()
            this.expiryTime = new Date(
              date.setSeconds(date.getSeconds() + 3600)
            )
            this.checkPaymentTimer = setInterval(() => {
              this.checkPayment()
            }, 3000)
          } else {
                if (response.message) this.commentAlert.message = response.message
                this.commentAlert.success = false
            }
        },
        (error) => {
          console.error(error)
        }
      )
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
        this.upvoteDialogForm.amount < this.replyMinimumFee
      ) {
        this.commentAlert.message =
          'Vote at least ' +
          this.replyMinimumFee +
          ' satoshis to be able to write a review/reply.'
        return
      }

      if (this.encodedComment.length >= this.$store.state.configuration.max_comment_size) {
        this.commentAlert.message =
          'Encoded review or comment is too long, please remove special characters and emoijs.'
        return
      } // end validation

      this.commentAlert.message = ''
      
      this.recaptchaToken = await this.getRecaptchaToken()

      if (this.type === 'comment' || this.type === 'comment reply') {
        this.storeVotePaymentRequest()
      } else if (
        this.type === 'discussion' ||
        this.type === 'discussion reply'
      ) {
        this.discussionReplyPaymentRequest()
      }
    },
    getRecaptchaToken() {
        return this.$recaptcha.execute('low_value_comment')
    },
    checkPayment() {
      //todo: check if payment is done
      if (this.expiryTime > new Date()) {
        this.$store.dispatch('checkPayment', { id: this.paymentID }).then(
          (response) => {
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
</style>
