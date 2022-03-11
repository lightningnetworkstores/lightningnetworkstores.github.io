<template>
  <v-dialog v-model="showDialog" max-width="500">
    <template v-slot:activator="{ attrs, on }">
      <v-btn v-on="on" :attrs="attrs" icon color="secondary">
        <v-icon>mdi-tooltip-edit</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Change Topic
      </v-card-title>
      <v-card-text>
        <v-select :items="topics" v-model="selectedTopic" outlined/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="() => showDialog = false" :disabled="isProcessing">Cancel</v-btn>
        <v-btn text @click="handleConfirm" color="primary">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showDialog: false,
      isProcessing: false,
      selectedTopic: null
    }
  },
  props: {
    threadId: {
      type: String,
      required: true
    }
  },
  methods: {
    handleConfirm() {
      this.$store.dispatch('discussions/updateTopic', {
        threadId: this.threadId,
        topic: this.selectedTopic
      })
      .then(data => {
        if (data.status === 'fail') {
          const { message } = data
          // TODO: Handle error properly
        }
      })
      .catch(err => {
        console.error('> err: ', err)
      })
    }
  },
  computed: {
    ...mapState('discussions', ['topics'])
  }
}
</script>