<template>
  <v-layout class="justify-center error-wrapper column align-center">
    <div v-if="error.statusCode === 404">
      <h1 class="error-code">404</h1>
      <p class="error-message">{{ pageNotFound }}</p>
    </div>
    <div v-else>
      <p class="error-message">{{ otherError }}</p>
    </div>
    <v-btn depressed to="/">Back to home page</v-btn>
  </v-layout>
</template>

<script>
export default {
  layout: 'default',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: 'Page not found...',
      otherError: 'An error occurred...',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped lang="scss">
.error-wrapper {
  height: 100%;
}
.error-code {
  text-align: center;
  font-size: 100px;
  letter-spacing: 20px;
  font-weight: 300;
  color: rgb(253, 185, 25);
}
.error-message {
  text-align: center;
  font-size: 20px;
}
</style>
