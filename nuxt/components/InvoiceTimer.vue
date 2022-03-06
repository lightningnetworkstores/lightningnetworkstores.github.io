<template>
  <div class="mt-2 mx-6 d-flex flex-column justify-center align-center">
    <div class="text-overline">Time left</div>
    <v-icon color="grey">mdi-timer</v-icon>
    <v-progress-linear
      class="mt-1"
      :value="remainingTimePercent"
      rounded
      height="5"
      color="primary"
    />
    {{ remainingTimeText }}
  </div>
</template>
<script>
import { Duration } from 'luxon'
export default {
  props: {
    lifetime: {
      type: Number,
      required: true
    },
    remaining: {
      type: Number,
      required: true
    }
  },
  computed: {
    remainingTimeText() {
      const millis = this.remaining * 1e3
      const duration = Duration.fromMillis(millis > 0 ? millis : 0)
      const h = parseInt(this.remaining / 60 / 60)
      const m = parseInt(this.remaining / 60)
      const s = parseInt(this.remaining % 60)
      if (h > 0) return duration.toFormat('hh:mm:ss')
      else if (m > 0) return duration.toFormat('mm:ss')
      else `${s} seconds`
    },
    remainingTimePercent() {
      return this.remaining > 0 && this.lifetime > 0 ? ((this.remaining / this.lifetime) * 100) : 0
    },
  }
}
</script>