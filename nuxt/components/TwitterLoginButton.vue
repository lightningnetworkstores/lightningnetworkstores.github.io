<template>
  <v-btn color="primary" dark block @click="handleLoginClick">
    <v-icon color="white darken-2" class="mr-3">
      mdi-twitter
    </v-icon>
    LOGIN WITH TWITTER
  </v-btn>
</template>
<script>
export default {
  methods: {
    handleLoginClick() {
      this.$axios
        .get(`/api/oauthlogin?platform=twitter&source_page=${encodeURIComponent(this.$route.path)}`)
        .then((res) => res.data)
        .then((data) => {
          const { authorization_url } = data.data
          window.location.replace(authorization_url)
        })
    },
  },
}
</script>
