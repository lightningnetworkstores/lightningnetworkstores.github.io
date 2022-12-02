<template>
  <v-container>
    <v-row>
      <v-col cols="12" style="text-align: center">
        <v-rating
          size="32"
          color="warning"
          half-increments
          readonly
          :value="rating"
        />
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <div class="text-h6 font-weight-thin">34 reviews</div>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    rating: {
      type: Number,
      required: true
    }
  }
}
</script>