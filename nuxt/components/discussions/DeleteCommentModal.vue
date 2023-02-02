<template>
  <v-dialog v-model="showDialog" max-width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn @click="deleteCommentRequested" icon :attrs="attrs" v-on="on">
        <v-icon small color="red">mdi-delete</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Please confirm</v-card-title>
      <v-card-text>Click to confirm the removal of this comment</v-card-text>
      <div class="mx-2 px-2">
        <v-text-field outlined label="Days to Ban" type="number" v-model="daysToBan"/>
        <v-text-field outlined label="Reason" v-model="reason"/>
      </div>
      <div class="mx-2 px-2" v-if="criminalRecord">
        <div class="text-body-1">
          <span class="font-weight-black">Last Ban:</span> {{ criminalRecord.last_ban }}
        </div>
        <div class="text-body-1">
          <span class="font-weight-black">Previously Removed:</span> {{ criminalRecord.previously_removed }}
        </div>
        <div class="text-body-1">
          <span class="font-weight-black">Removal Rate:</span> {{ criminalRecord.removal_rate }}</div>
      </div>
      <v-btn class="text-body-1 mx-2 px-2" @click="handleMoreInfo">More Info</v-btn>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="showDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="deleteComment">YES</v-btn>
      </v-card-actions>
      <v-progress-linear v-if="isProcessing" indeterminate></v-progress-linear>
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
      isProcessing: false,
      showDialog: false,
      daysToBan: '0',
      reason: ''
    }
  },
  methods: {
    deleteCommentRequested() {
      this.$store.dispatch('discussions/getBanInfo', this.commentId)
    },
    async deleteComment() {
      const deletePayload = {
        threadIndex: this.threadIndex,
        reason: this.reason,
        daysToBan: this.daysToBan !== '' ? parseInt(this.daysToBan) : 0,
        comments: [ this.commentId ]
      }
      this.isProcessing = true
      await this.$store.dispatch('discussions/deleteComment', deletePayload)
      this.isProcessing = false
      this.showDialog = false
    },
    handleMoreInfo() {
      window.open(`/api/baninfo?comment=${this.commentId}`, '_blank')
    }
  },
  computed: {
    ...mapState('discussions', ['error', 'isAdmin', 'criminalRecord'])
  }
}
</script>