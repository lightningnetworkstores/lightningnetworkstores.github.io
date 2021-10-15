import { mapState } from 'vuex'
export default {
  data() {
    return {
      hCaptchaToken: '',
      hCaptchaSiteKey: '327adc75-957d-4063-9cf3-c4999bead7dd',
    }
  },
  computed: {
    ...mapState(['hcaptchaRequired']),
  },
  methods: {
    onVerify(token) {
      this.hCaptchaToken = token
    },
  },
}
