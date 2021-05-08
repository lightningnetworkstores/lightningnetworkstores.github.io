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
        <v-flex shrink px-3>{{ store.upvotes | splitNumber }}</v-flex>
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
        <v-flex shrink px-3>{{ store.downvotes | splitNumber }}</v-flex>
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
      <a @click="reply()">Reply</a>
    </template>
    <!-- Upvote store modal -->
    <v-dialog v-model="showDialog" persistent max-width="500">
      <v-card>
        <template v-if="showDialog">
          <div v-if="paymentRequest && isPaid" class="text-xs-center">
            <!-- paymentRequest && isPaid -->
            <v-card-title class="headline">
              <v-layout row>
                <v-flex>Payment successful</v-flex>
              </v-layout>
            </v-card-title>
            <v-icon size="200" color="green" pa-5>fas fa-check-circle</v-icon>
            <v-layout row mt-2>
              <v-flex
                >Go to
                <a :href="'/store/' + store.id">{{ store.name }}</a></v-flex
              >
            </v-layout>
          </div>

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
                    counter="200"
                    :label="
                      'Review (optional - minimum ' +
                      replyReviewFee +
                      ' satoshis)'
                    "
                    rows="4"
                    :rules="[
                      (v) =>
                        v.length <= 200 ||
                        'Review has to be shorter than 200 characters',
                    ]"
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
                    counter="200"
                    label="Reply"
                    rows="4"
                    :rules="[
                      (v) =>
                        v.length <= 200 ||
                        'Reply has to be shorter than 200 characters',
                      (v) => !!v || 'Reply is required',
                    ]"
                  ></v-textarea>
                </v-flex>
              </v-layout>

              <div v-if="paymentRequest" class="text-center">
                <v-layout row>
                  <v-flex class="pa-3 text-xs-center"
                    ><h2>{{ upvoteDialogForm.amount }} sat</h2></v-flex
                  >
                </v-layout>
                <v-layout row>
                  <v-flex pl-3 pr-3 class="text-xs-center"
                    ><qrcode-vue
                      class="qrcode"
                      size="300"
                      :value="paymentRequest"
                    ></qrcode-vue
                  ></v-flex>
                </v-layout>

                <v-layout row>
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
                <a :href="'lightning:' + paymentRequest" class="link-button"
                  >Open in wallet</a
                >
              </div>
            </v-card-text>
          </div>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="cancel">
              {{ paymentRequest && isPaid ? 'Close' : 'Cancel' }}
            </v-btn>

            <v-btn
              color="green darken-1"
              text
              v-if="!paymentRequest.length"
              @click="getInvoice"
            >
              Get invoice
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VoteButton from './VoteButton.vue'

export default {
  components: { VoteButton },
  props: {
    store: { required: true },
    isInfo: { required: false },
    parentReview: { required: false },
    parentComment: { required: false },
    isReviewUpvote: { required: false },
    isReplyToSubComment: { required: false },
    sort: { required: false },
  },
  data() {
    return {
      score: {},
      isUpvoting: true,

      showDialog: false,
      upvoteDialogForm: { amount: 0, comment: '' },

      paymentRequest: '',
      paymentID: '',
      expiryTime: new Date(),
      isPaid: false,

      checkPaymentTimer: null,

      commentAlert: { message: '', success: false },
    }
  },
  computed: {
    replyReviewFee() {
      return this.$store.state.replyReviewFee
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
    this.upvoteDialogForm.amount = this.replyReviewFee
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
      this.upvoteDialogForm = { amount: this.replyReviewFee, comment: '' }
      this.showDialog = false
      this.isPaid = false
      this.paymentID = ''
      this.commentAlert.message = ''
    },

    getInvoice() {
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
        this.upvoteDialogForm.amount < this.replyReviewFee
      ) {
        this.commentAlert.message =
          'Vote at least ' +
          this.replyReviewFee +
          ' satoshis to be able to write a review/reply.'
        return
      }

      if (this.encodedComment.length >= 225) {
        this.commentAlert.message =
          'Encoded review or comment is too long, please remove special characters and emoijs.'
        return
      } // end validation

      this.commentAlert.message = ''

      this.$store
        .dispatch('getStoreVotePaymentRequest', {
          id: this.store.id,
          amount: this.upvoteDialogForm.amount,
          isUpvote: this.isUpvoting,
          comment: this.encodedComment,
          parent: this.parentReview,
        })
        .then(
          (response) => {
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
            if (response == 'true') {
              this.isPaid = true
              clearInterval(this.checkPaymentTimer)
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