<template>
  <v-snackbar v-model="showSnackbar">
    {{ errorMessage }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="red"
        text
        v-bind="attrs"
        @click="showSnackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  data() {
    return {
      showSnackbar: true
    }
  },
  props: {
    errorMessage: {
      type: String,
      default: 'Unspecified error'
    }
  }
}
</script>