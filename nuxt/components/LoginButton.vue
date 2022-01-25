<template>
  <v-btn text @click="handleLoginClick">
    <v-icon>
      mdi-account-circle
    </v-icon>
  </v-btn>
</template>
<script>
export default {
  methods: {
    handleLoginClick() {
      this.$axios.get('/api/oauthlogin?platform=twitter')
        .then(res => res.data)
        .then(data => {
          console.log(data)
          const { request_token, authorization_url, platform } = data.data
          window.location.replace(authorization_url)
        })
    }
  }
}
</script>