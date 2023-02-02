<template>
  <v-dialog v-model="showDialog" max-width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn @click="deleteCommentRequested" icon :attrs="attrs" v-on="on">
        <v-icon small color="primary">mdi-image-album</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Confirm</v-card-title>
      <v-card-text>Please confirm this meme selection</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="showDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="postMeme">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    commentId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showDialog: false
    }
  },
  methods: {
    postMeme() {
      const payload = { commentId: this.commentId }
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