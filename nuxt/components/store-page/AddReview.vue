<template>
  <v-container pa-6 ma-6>
    <v-row>
      <v-col cols="12" style="text-align: center">
        <v-textarea
          outlined
          hide-details
          name="new-review"
          label="Enter your review"
          v-model="reviewText"
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
        />
      </v-col>
      <v-col style="text-align: right">
        <v-btn color="primary">Submit</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      reviewText: '',
      stars: 0
    }
  }
}
</script>