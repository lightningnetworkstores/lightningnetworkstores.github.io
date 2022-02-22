<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="500"
    style="overflow-x: hidden"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-chip
        @click="replyClicked"
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
          :rules="[
            (v) =>
              (v || '').length <=
                this.$store.state.configuration.max_comment_size ||
              'Reply has to be shorter than ' +
                this.$store.state.configuration.max_comment_size +
                ' characters',
            (v) => !!v || 'Reply is required',
          ]"
        >
        </v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="() => showDialog = false">Cancel</v-btn>
        <v-btn text color="primary" :disabled="disableSubmit">Submit</v-btn>
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
    }
  },
  data() {
    return {
      message: `@${this.reply.id.slice(0, 5)} `,
      showDialog: false,
      isValid: false
    }
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
    replyClicked() {
      // TODO: Implement message delivery (change the store)
    },
    updateError(hasError) {
      this.isValid = !hasError
    }
  },
  computed: {
    disableSubmit() {
      return !this.isValid
    }
  }
}
</script>