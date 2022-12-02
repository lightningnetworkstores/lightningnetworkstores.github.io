<template>
  <div class="d-flex justify-center w100">
    <v-btn
      @click.stop="openDialog()"
      color="primary"
    >
      Add Review
    </v-btn>
    <v-dialog
      v-model="showDialog"
      max-width="600"
    >
      <v-card>
        <v-progress-linear
          v-if="review.isPosting"
          indeterminate
        />
        <v-card-title>Leave Review</v-card-title>
        <v-container pa-6 ma-1>
          <v-row>
            <v-col cols="12" style="text-align: center">
              <v-textarea
                outlined
                hide-details
                name="new-review"
                label="Enter your review"
                v-model="reviewText"
                :disabled="review.isPosting"
              >
              </v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-rating
                size="24"
                color="warning"
                v-model="stars"
                :disabled="review.isPosting"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="red"
            @click.stop="closeDialog()"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="green"
            :disabled="disableSubmit"
            @click.stop="submitReview"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      showDialog: false,
      reviewText: '',
      stars: null
    }
  },
  props: {
    storeID: {
      type: Number,
      required: true 
    }
  },
  methods: {
    openDialog() {
      this.showDialog = true
    },
    closeDialog() {
      this.reviewText = ''
      this.stars = null
      this.showDialog = false
    },
    async submitReview() {
      const review = {
        storeID: this.storeID,
        comment: this.reviewText,
        stars: this.stars
      }
      await this.$store.dispatch('review/postReview', review)
      this.$store.dispatch('getStore', { id: this.storeID })
      this.closeDialog()
    }
  },
  computed: {
    disableSubmit() {
      return this.stars === null || this.review.isPosting
    },
    ...mapState(['review'], 'isPosting')
  }
}
</script>