<template>
  <v-list three-line>
    <template>
      <div v-for="(review, index) in reviews" :key="review[0].id">
        <v-list-item link>
          <v-list-item-avatar>
            <v-img :src="review[0].user.image"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="ml-2">
              @{{ review[0].user.handle }}
            </v-list-item-title>
            <v-list-item-subtitle class="ml-2">
              {{ review[0].comment ? review[0].comment : '' }}
            </v-list-item-subtitle>
            <v-rating
              size="18"
              color="warning"
              half-increments
              readonly
              :value="review[0].stars"
            />
          </v-list-item-content>
          <div class="d-flex justify-start flex-column align-end time-container mt-3">
            <div class="text-caption text--disabled">
              {{ format(review[0].timestamp) }}
            </div>
          </div>
        </v-list-item>
        <v-divider
          v-if="index < reviews.length - 1"
          inset
          :key="review[0].id"/>
      </div>
    </template>
  </v-list>
</template>
<script>
import { DateTime } from 'luxon'
import { format } from 'timeago.js'
export default {
  props: {
    reviews: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      format
    }
  },
  mounted() {
    console.log('this.reviews: ', this.reviews)
  },
  methods: {
    getDate(timestamp) {
      const date = DateTime.fromMillis(timestamp)
      return date.toFormat('DDD')
    },
    getTime(timestamp) {
      const date = DateTime.fromMillis(timestamp)
      return date.toFormat('hh:mm:ss')
    }
  }
}
</script>
<style scoped>
.time-container {
  align-self: stretch;
}
</style>