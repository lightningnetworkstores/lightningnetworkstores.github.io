<template>
  <v-dialog
    v-model="isOpen"
    @click:outside="$emit('update:isOpen', false)"
    @keydown.esc="$emit('update:isOpen', false)"
    max-width="500px"
  >
    <v-card>
      <v-card-title>Blocked Voting</v-card-title>
      <v-card-text>
        This account cannot vote because our system thinks you might be a throwaway account or not a real person. If you an old github account, 
        you can remove this block by connecting your account:
      </v-card-text>
      <v-card-text>
        <GithubLoginButton />
      </v-card-text>
      <v-card-text>
        Alternatively, contact us to remove this block:
        <ul>
          <li>
              <a href="https://twitter.com/messages/compose?recipient_id=1021110839288451072&text=I%20would%20like%20access%20to%20the%20contests" target="_blank" rel="noreferrer noopener">
              Click here to send a twitter direct message.</a>
          </li>
          <li>
              <a href="https://t.me/LNstores" target="_blank" rel="noreferrer noopener">Click here to ask on our telegram group.</a>
          </li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close()">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import GithubLoginButton from './GithubLoginButton.vue';

export default {
  emits: ['update:isOpen'],
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close(){
      this.amount = null
      this.$emit('update:isOpen', false)
    },
  }
}
</script>
