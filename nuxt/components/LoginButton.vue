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
      console.log('Clicked')
    }
  }
}
</script>