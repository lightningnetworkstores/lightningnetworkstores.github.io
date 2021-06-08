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
        <v-card-text>An e-mail will be sent to {{ email }}.</v-card-text>
        <vue-hcaptcha
          v-if="token === null"
          ref="invisibleHcaptcha"
          sitekey="327adc75-957d-4063-9cf3-c4999bead7dd"
          size="invisible"
          theme="dark"
          @verify="onVerify"
        />
        <div class="d-flex justify-center">
          <v-btn
            v-if="token === null"
            depressed
            color="primary"
            @click="runCaptcha">
            Solve Captcha
          </v-btn>
        </div>
        <div
          v-if="token !== null"
          class="ml-5 mr-5"
        >
          <v-text-field label="Recipient" type="text" v-model="recipient"></v-text-field>
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
            :disabled="token === null"
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
  props: ['enabled', 'email', 'onCancel', 'onCaptchaToken'],
  components: { VueHcaptcha },
  data() {
    return {
      recipient: '',
      token: null
    }
  },
  methods: {
    onSubmit(e) {
      try {
        const { token, recipient } = this;
        this.onCaptchaToken(token, recipient);
      } catch(err) {
        console.error('error: ', err);
      } finally {
        this.onCancel();
      }
    },
    onVerify(token, ekey) {
      this.token = token;
    },
    runCaptcha(){
        this.$refs.invisibleHcaptcha.execute();
    }
  }
}
</script>
<style scoped>
  .login-modal {
    width: 20px;
  }
</style>