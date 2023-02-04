<template>
  <v-dialog v-model="showDialog" max-width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon :attrs="attrs" v-on="on">
        <v-icon small color="primary">mdi-image-album</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Confirm</v-card-title>
      <v-card-text>Please confirm this meme selection</v-card-text>
      <v-select v-model="creationDate" class="mx-6" outlined
        label="Select the year of this meme"
        :items="dates"
        item-text="text"
        item-value="value"
      />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="showDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="postMeme">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { DateTime } from 'luxon'
const NOW = DateTime.local()
const DATES = [
  { text: 'Now', value: NOW },
  { text: 'A week ago', value: NOW.minus({ weeks: 1 }) },
  { text: 'A month ago', value: NOW.minus({ months: 1 }) },
  { text: 'A year ago', value: NOW.minus({ years: 1 }) },
  { text: '2 years ago', value: NOW.minus({ years: 2 }) },
  { text: '3 years ago', value: NOW.minus({ years: 3 }) },
  { text: '5 years ago', value: NOW.minus({ years: 5 }) }
]
export default {
  props: {
    commentId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showDialog: false,
      dates: DATES,
      creationDate: NOW
    }
  },
  methods: {
    postMeme() {
      const payload = {
        commentId: this.commentId,
        creationDate: parseInt(this.creationDate.toMillis() / 1e3)
      }
      this.$axios.$post('/api/meme', payload)
        .then(data => {
          console.log('post meme response: ', data)
        })
        .catch(err => console.error(err))
        .finally(() => this.showDialog = false)
    }
  }
}
</script>