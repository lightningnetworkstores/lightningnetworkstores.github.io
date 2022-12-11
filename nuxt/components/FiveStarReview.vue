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
    <v-row v-for="(filter, index) in starFilters" :key="filter.label">
      <v-col md="2" sm="3" class="my-0 py-0 d-flex align-center justify-start">
        <v-checkbox
          class="my-0 py-0"
          v-model="selected"
          :value="filter.value"
          @click="$emit('filterChange', selected)"
          color="grey"
          hide-details
        />
        <div class="d-flex flex-grow-1">
          <v-icon v-for="i in (5 - index)" x-small color="warning" :key="i">
            mdi-star
          </v-icon>
        </div>
      </v-col>
      <v-col md="10" sm="9" class="my-0 py-2">
        <v-progress-linear
          class="my-0 py-0"
          v-model="starCount[filter.value - 1]"
          rounded
          color="grey"
          height="8"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    reviews: {
      type: Array,
      default: [],
    },
  },
  emits: ['filterChange'],
  data(){
    return { 
      starFilters: [
        {'value': 5},
        {'value': 4},
        {'value': 3},
        {'value': 2},
        {'value': 1}
      ],
      selected: [1,2,3,4,5]
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
    starCount(){
      let count = [];
      for(let st in [...Array(5).keys()]){
        let nbs = Number(st) + 1;
        count[st] = this.reviews.filter(r => r[0].stars==nbs).length*100/this.reviewCount
      }
      return count;
    }
  },
}
</script>