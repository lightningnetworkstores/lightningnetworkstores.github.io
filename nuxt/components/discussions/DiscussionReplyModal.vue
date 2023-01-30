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
        <ImageSelector @onImageSelected="onImageSelected" @onImageCancelled="onImageCancelled"/>
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
import { mapState } from 'vuex'
import ImageSelector from '@/components/discussions/ImageSelector'
import { IMAGE_TYPE_FILE_UPLOAD, IMAGE_TYPE_URL } from '@/utils/constants'

export default {
  components: {
    ImageSelector
  },
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
      isProcessing: false,
      image: null
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
      const payload = {
        recaptchaToken: recaptchaToken,
        parent: this.threadId,
        comment: this.message,
        threadIndex: this.threadIndex,
        sage: this.sage
      }
      let uploadImageResponse = null
      if (this.image && this.image.type === IMAGE_TYPE_FILE_UPLOAD) {
        // Image specified as a file
        try {
          uploadImageResponse = await this.$store.dispatch('discussions/addImage', this.image.value)
          payload.link = `${this.baseURL}${uploadImageResponse.data.path.slice(1)}`
        } catch(err) {
          this.isLoading = false
          return this.$store.dispatch('network/showError', err)
        }
      } else if (this.image && this.image.type === IMAGE_TYPE_URL) {
        // Image specified as a URL
        payload.link = this.image.value
      }
      this.$store.dispatch('discussions/postReply', payload).then(data => {
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
    onImageSelected(event) {
      // {type: <IMAGE_TYPE_FILE_UPLOAD|IMAGE_TYPE_URL>, value: <File|String>}
      console.log('onImageSelected. event: ', event)
      this.image = event
    },
    onImageCancelled() {
      this.image = null
    }
  },
  computed: {
    ...mapState(['storeSummary', 'baseURL']),
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