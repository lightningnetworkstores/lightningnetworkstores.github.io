<template>
  <v-row justify="center">
    <v-dialog v-model="enabled" persistent max-width="500">
      <v-card v-if="loginResponse">
        <v-card-title>{{ loginResponseTitle }}</v-card-title>
        <v-card-text>{{ loginResponse.message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="onCancel"> Ok </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="loginResponse === null" justify="center">
        <v-card-title class="text-h5"> Login </v-card-title>

        <v-card class="d-flex flex-column justify-center align-center">
          <v-card-title class="text-h6">
            login with the authorized twitter account</v-card-title
          >
          <v-card-text>
            <TwitterLoginButton /> 
          </v-card-text>
        </v-card>
        <h1 justify="center" class="text-center">OR</h1>
        <v-card-text
          >An email will be sent to {{ destinationEmail }}.</v-card-text
        >
        <vue-hcaptcha
          v-if="token === null"
          ref="invisibleHcaptcha"
          sitekey="327adc75-957d-4063-9cf3-c4999bead7dd"
          size="invisible"
          theme="dark"
          @verify="onVerify"
        />
        <div class="text-center" v-if="isWaiting && !loginResponse">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <div class="ml-5 mr-5">
          <v-radio-group v-model="emailSelection">
            <v-row v-if="showRadioButtons">
              <v-radio :value="0"> </v-radio>
              <v-text-field
                label="Default email"
                type="email"
                :value="email"
                disabled
              />
            </v-row>
            <v-row>
              <v-radio v-if="showRadioButtons" :value="1"> </v-radio>
              <v-text-field
                @input="handleChange"
                label="Company email"
                type="text"
                :value="recipient"
                :suffix="'@' + rooturl"
                :disabled="showRadioButtons && emailSelection !== 1"
                :rules="[
                  (v) => /^[a-zA-Z0-9_\.\-]+$/.test(v) || 'invalid email',
                ]"
              ></v-text-field>
            </v-row>
          </v-radio-group>
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
import VueHcaptcha from '@hcaptcha/vue-hcaptcha'
import TwitterLoginButton from './TwitterLoginButton.vue'

export default {
  props: [
    'enabled',
    'email',
    'onCancel',
    'onCaptchaToken',
    'rooturl',
    'loginResponse',
  ],
  components: { VueHcaptcha },
  data() {
    return {
      emailSelection: this.email.endsWith(this.rooturl) ? 1 : 0,
      recipient: this.email.endsWith(this.rooturl)
        ? this.email.split('@')[0]
        : '',
      domain: this.email.split('@')[1],
      token: null,
      isWaiting: false,
    }
  },
  methods: {
    onSubmit(e) {
      this.$refs.invisibleHcaptcha.execute()
    },
    onVerify(token, ekey) {
      this.token = token
      try {
        const { token, destinationEmail } = this
        const shouldSendRecipient = this.destinationEmail.endsWith(this.rooturl)
        if (shouldSendRecipient) this.onCaptchaToken(token, destinationEmail)
        else this.onCaptchaToken(token)
        this.isWaiting = true
      } catch (err) {
        console.error('error: ', err)
      }
    },
    handleChange(value) {
      this.recipient = value
      if (this.domain !== this.rooturl) {
        this.domain = this.rooturl
      }
    },
  },
  computed: {
    destinationEmail() {
      if (this.emailSelection === 0) return `${this.email}`
      else if (this.emailSelection === 1)
        return `${this.recipient}@${this.domain}`
    },
    showProgress() {
      return this.isWaiting && this.loginResponse === null
    },
    loginResponseTitle() {
      if (this.loginResponse.status === 'success') return 'Success!'
      else return loginResponse.status
    },
    showRadioButtons() {
      return !this.email.endsWith(this.rooturl)
    },
  },
}
</script>
<style scoped>
.login-modal {
  width: 20px;
}
</style>
