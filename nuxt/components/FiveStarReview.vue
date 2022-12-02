<template>
  <v-container>
    <v-row>
      <v-col cols="12" style="text-align: center">
        <v-rating
          size="32"
          color="warning"
          half-increments
          readonly
          :value="averageReview"
        />
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <div class="text-h6 font-weight-thin">{{ reviewCount }} reviews</div>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    reviews: {
      type: Array,
      default: []
    }
  },
  computed: {
    reviewCount() {
      return this.reviews.length
    },
    averageReview() {
      const total = this.reviews
        .reduce((accum, [review]) => accum + review.stars, 0)
      return total / this.reviewCount
    },
  }
}
</script>