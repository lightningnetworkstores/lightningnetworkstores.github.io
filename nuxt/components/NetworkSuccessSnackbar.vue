<template>
  <v-snackbar v-model="showSnackbar">
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="green"
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
    message: {
      type: String,
      default: 'Success!'
    }
  }
}
</script>