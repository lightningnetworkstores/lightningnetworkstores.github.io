<template>
  <v-dialog v-model="showDialog" max-width="500">
    <template v-slot:activator="{ on, attrs}">
      <v-btn icon :attrs="attrs" v-on="on">
        <v-icon color="red">mdi-delete</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Please confirm</v-card-title>
      <v-card-text>Click to confirm the removal of this comment</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="showDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="deleteComment">YES</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    threadIndex: {
      type: Number,
      required: true
    },
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
    deleteComment() {
      const deletePayload = {
        threadIndex: this.threadIndex,
        reason: '',
        comments: [ this.commentId ]
      }
      this.$store.dispatch('discussions/deleteComment', deletePayload)
    }
  },
  computed: {
    ...mapState('discussions', ['error', 'isAdmin'])
  }
}
</script>