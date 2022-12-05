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

    <v-row v-for="cb in starFilters" :key="cb.label">
      <v-col md="auto">
           <v-checkbox
              v-model="selected"
              :label="`${cb.label} star`"
              :value="cb.value"
              @click="$emit('filterChange', selected)"
              color="grey"
              hide-details
            ></v-checkbox>
      </v-col>
      <v-col >
        <v-progress-linear
        v-model="starCount[cb.value-1]"
        color="grey"
        height="20"
       ></v-progress-linear>
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
      starFilters: [{'label': 'one', 'value': 1}, {'label': 'two', 'value': 2}, {'label': 'three', 'value': 3}, 
      {'label': 'four', 'value': 4}, {'label': 'five', 'value': 5}],
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