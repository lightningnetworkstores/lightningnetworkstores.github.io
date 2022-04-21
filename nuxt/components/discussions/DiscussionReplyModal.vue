<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="500"
    style="overflow-x: hidden"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-chip
        :color="color"
        v-bind="attrs"
        v-on="on"
        text-color="white"
        small
        style="cursor: pointer; min-width: 7em"
      >
        <v-icon class="pr-4">mdi-reply</v-icon>
        {{ reply.id.slice(0, 5) }}
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
        <v-checkbox v-model="sage" class="my-0" label="Don't bump thread" color="primary">
        </v-checkbox>
        <v-progress-linear v-if="isProcessing" indeterminate/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="() => showDialog = false" :disabled="isProcessing">Cancel</v-btn>
        <v-btn text @click="handleSubmit" color="primary" :disabled="disableSubmit">Submit</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="hasError" color="red">{{ errorMessage }}</v-snackbar>
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
    },
    mentionReference: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  data() {
    return {
      message: '',
      sage: false,
      showDialog: false,
      hasError: null,
      errorMessage: null,
      isValid: true,
      isProcessing: false
    }
  },
  mounted() {
    this.$recaptcha.init()
    if (this.mentionReference) {
      this.message = `@${this.reply.id.slice(0, 5)} `
    }
  },
  methods: {
    async handleSubmit() {
      this.isProcessing = true
      const recaptchaToken = await this.$recaptcha.execute('low_value_comment')
      this.$store.dispatch('discussions/postReply', {
        recaptchaToken: recaptchaToken,
        parent: this.threadId,
        comment: this.message,
        threadIndex: this.threadIndex,
        sage: this.sage
      }).then(data => {
        this.showDialog = false
        if (!data.data.submitted && data.status === 'success') {
          this.$emit('paid-reply-request', data)
        }
      })
      .catch(err => {
        console.error('Error while trying to post reply. err: ', err)
        this.hasError = true
        if (err && err.response && err.response.data) {
          this.errorMessage = err.response.data.message
        } else {
          this.errorMessage = 'Unknown error'
        }
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