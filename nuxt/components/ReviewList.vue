<template>
  <v-list three-line>
    <template>
      <div v-for="(review, index) in formattedReviews" :key="review.id">
        <v-list-item
          v-if="showReviewsWithStars.includes(review.stars)"
          :class="{'pl-15' : review.isReply}"
          link
        >
          <v-list-item-avatar>
            <v-img :src="review.user.image"></v-img>
          </v-list-item-avatar>
          <v-list-item-content class="py-1 my-0">
            <v-list-item-title class="ml-2" :class="{'text--secondary': review.isReply}">
              @{{ review.user.handle }}
            </v-list-item-title>
            <v-list-item-subtitle class="ml-2" :class="{'text--secondary': review.isReply}">
              {{ review.comment ? review.comment : '' }}
            </v-list-item-subtitle>
            <v-rating v-if="!review.isReply"
              size="12"
              color="warning"
              half-increments
              readonly
              :value="review.stars"
            />
            <v-list-item-subtitle class="text-caption text--disabled ml-2">
              {{ format(review.timestamp) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <div v-if="!review.isReply" class="d-flex justify-space-between flex-column align-end time-container mt-3">
            <v-btn icon>
              <v-icon @click="toggleHelpful(review)" color="pink" small>
                {{ review.helpful ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
            </v-btn>
            <review-reply-modal
              :storeId="storeId"
              :parent="review.id"
            />
          </div>
        </v-list-item>
        <v-divider
          v-if="index < formattedReviews.length - 1"
          :key="review.id"/>
      </div>
    </template>
  </v-list>
</template>
<script>
import { DateTime } from 'luxon'
import { format } from 'timeago.js'
import { mapState } from 'vuex'
import ReviewReplyModal from '@/components/ReviewReplyModal'

export default {
  props: ['showReviewsWithStars', 'storeId'],
  data() {
    return {
      format
    }
  },
  components: {
    ReviewReplyModal
  },
  methods: {
    getDate(timestamp) {
      const date = DateTime.fromMillis(timestamp)
      return date.toFormat('DDD')
    },
    getTime(timestamp) {
      const date = DateTime.fromMillis(timestamp)
      return date.toFormat('hh:mm:ss')
    },
    toggleHelpful(review) {
      this.$store.dispatch('review/toggleHelpful', review)
    }
  },
  computed: {
    formattedReviews() {
      const flattened = [...this.reviews]
        .map(reviewsThread => {
          reviewsThread.forEach(review => {
            review.stars = reviewsThread[0].stars
          })
          return reviewsThread
        })
        .flat()
        .map(review => {
          review.isReply = review.thread_id === undefined
          return review
        })
      return flattened
    },
    ...mapState('review',['reviews'])
  }
}
</script>
<style scoped>
.time-container {
  align-self: stretch;
}
</style>