<template>
  <v-btn color="black white--text" dark block @click="handleLoginClick">
    <v-icon color="white" class="mr-3">
      mdi-github
    </v-icon>
    CONNECT GITHUB ACCOUNT
    </v-btn>
</template>
<script>
export default {
  methods: {
    handleLoginClick() {
      this.$axios
        .get(`/api/oauthlogin?platform=github&source_page=${encodeURIComponent(this.$route.path)}`)
        .then((res) => res.data)
        .then((data) => {
          const { authorization_url } = data.data
          window.location.replace(authorization_url)
        })
    },
  },
}
</script>
