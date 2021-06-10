<template>
  <v-row justify="center">
    <v-dialog
      v-model="enabled"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5">
          Login
        </v-card-title>
        <v-card-text>An e-mail will be sent to {{ destinationEmail }}.</v-card-text>
        <vue-hcaptcha
          v-if="token === null"
          ref="invisibleHcaptcha"
          sitekey="327adc75-957d-4063-9cf3-c4999bead7dd"
          size="invisible"
          theme="dark"
          @verify="onVerify"
        />
        <div
          class="ml-5 mr-5"
        >
          <v-text-field @input="handleChange" label="Recipient" type="text" :value="recipient"></v-text-field>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="onSubmit"
          >
            Send Login Link
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import VueHcaptcha from '@hcaptcha/vue-hcaptcha';
export default {
  props: ['enabled', 'email', 'onCancel', 'onCaptchaToken', 'rooturl'],
  components: { VueHcaptcha },
  data() {
    return {
      recipient: this.email.split('@')[0],
      domain: this.email.split('@')[1],
      token: null
    }
  },
  methods: {
    onSubmit(e) {
      this.$refs.invisibleHcaptcha.execute();
    },
    onVerify(token, ekey) {
      this.token = token;
      try {
        const { token, destinationEmail } = this;
        this.onCaptchaToken(token, destinationEmail);
      } catch(err) {
        console.error('error: ', err);
      } finally {
        this.onCancel();
      }
    },
    handleChange(value) {
      this.recipient = value;
      if (value.indexOf('*') !== -1) {
        this.domain = this.rooturl;
      }
    }
  },
  computed: {
    destinationEmail() {
      return `${this.recipient}@${this.domain}`;
    }
  }
}
</script>
<style scoped>
  .login-modal {
    width: 20px;
  }
</style>