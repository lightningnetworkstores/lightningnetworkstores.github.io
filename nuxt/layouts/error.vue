<template>
  <v-layout class="justify-center error-wrapper column align-center">
    <div v-if="error.statusCode">
      <h1 class="error-code">{{ error.statusCode }}</h1>
    </div>
    <p class="error-message">{{ errorTitle }}</p>
    <p class="error-message">{{ error.message }}</p>
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
      errorTitle:
        this.error.statusCode == 404
          ? 'Page not found...'
          : 'An error occurred...',
    }
  },
  head() {
    const title = this.errorTitle

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
