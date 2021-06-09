<template>
  <v-row justify="center">
    <v-dialog
      v-model="enabled"
      persistent
      max-width="500"
    >
      <v-card v-if="loginResponse">
        <v-card-title>{{ loginResponseTitle }}</v-card-title>
        <v-card-text>{{ loginResponse.message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="onCancel"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="loginResponse === null">
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
        <div class="text-center" v-if="isWaiting && !loginResponse">
          <v-progress-circular indeterminate color="primary"/>
        </div>
        <div class="ml-5 mr-5">
          <v-text-field @input="handleChange" label="Recipient" type="text" :value="recipient"></v-text-field>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="isWaiting && !loginResponse"
            color="green darken-1"
            text
            @click="onCancel"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="isWaiting && !loginResponse"
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
  props: ['enabled', 'email', 'onCancel', 'onCaptchaToken', 'rooturl', 'loginResponse'],
  components: { VueHcaptcha },
  data() {
    return {
      recipient: this.email.split('@')[0],
      domain: this.email.split('@')[1],
      token: null,
      isWaiting: false
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
        this.isWaiting = true;
      } catch(err) {
        console.error('error: ', err);
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
    },
    showProgress() {
      return this.isWaiting && this.loginResponse === null;
    },
    loginResponseTitle() {
      if (this.loginResponse.status === 'success')
        return 'Success!';
      else
        return loginResponse.status;
    }
  }
}
</script>
<style scoped>
  .login-modal {
    width: 20px;
  }
</style>