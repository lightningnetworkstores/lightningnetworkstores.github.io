<template>
  <v-btn text>
    <v-avatar size="36">
      <nuxt-link to="/dashboard">
        <img :src="src" alt="Profile Picture">
      </nuxt-link>
    </v-avatar>
  </v-btn>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>