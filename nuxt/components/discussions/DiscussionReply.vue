<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="500"
    style="overflow-x: hidden"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-chip
        class="mb-2"
        :color="getPillColor(reply.id)"
        v-bind="attrs"
        v-on="on"
        text-color="white"
        small
        style="cursor: pointer"
      >
        <v-icon class="pr-4">mdi-comment</v-icon>
        {{ reply.id.slice(0, 8) }}
      </v-chip>
    </template>
    <v-card>
      <v-card-title>
        Reply
      </v-card-title>
      <v-card-subtitle>
        You can reply for free
      </v-card-subtitle>
      <v-card-text>
        <v-textarea v-model="message"
          rows="4"
          label="Reply"
          outlined
          type="text"
          @update:error="updateError"
          :rules="replyRules"
        >
        </v-textarea>
        <v-progress-linear v-if="isProcessing" indeterminate/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="() => showDialog = false" :disabled="isProcessing">Cancel</v-btn>
        <v-btn text @click="handleSubmit" color="primary" :disabled="disableSubmit">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    reply: {
      type: Object,
      required: true
    },
    threadId: {
      type: String,
      required: true
    },
    threadIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      message: `@${this.reply.id.slice(0, 5)} `,
      showDialog: false,
      isValid: true,
      isProcessing: false
    }
  },
  mounted() {
    this.$recaptcha.init()
  },
  methods: {
    getPillColor(id) {
      const hashCode = (s) => {
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
      }
      const hash = hashCode(id)
      const hue = Math.abs(hash % 360)
      return `hsl(${hue}, 70%, 50%)`
    },
    async handleSubmit() {
      this.isProcessing = true
      const recaptchaToken = await this.$recaptcha.execute('low_value_comment')
      this.$store.dispatch('discussions/postReply', {
        recaptchaToken: recaptchaToken,
        parent: this.threadId,
        comment: this.message,
        threadIndex: this.threadIndex
      }).then(data => {
        this.showDialog = false
        if (!data.data.submitted && data.status === 'success') {
          this.handleRateControlResponse(data)
        }
      })
      .catch(err => {
        console.error('Error while trying to post reply. err: ', err)
      })
      .finally(() => this.isProcessing = false)
    },
    updateError(hasError) {
      this.isValid = !hasError
    },
    handleRateControlResponse(data) {
      console.log('handleRateControlResponse. data: ', data)
    }
  },
  computed: {
    disableSubmit() {
      return !this.isValid || this.isProcessing
    },
    replyRules() {
      return [
        (v) => {
          const maxLength = this.$store.state.configuration.max_comment_size
          if (v.length > maxLength) {
            return `Reply has to be shorter than ${maxLength} characters`
          }
          return true
        },
        (v) => {
          if (!v || v === '') return 'Reply is required'
          return true
        }
      ]
    }
  }
}
</script>