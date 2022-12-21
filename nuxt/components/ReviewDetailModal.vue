<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5">
          Review Detail
        </v-card-title>
        <v-card-text>
          {{ review.comment }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="$emit('closeReviewDetail')"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    review: {
      type: Object
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  }
}
</script>