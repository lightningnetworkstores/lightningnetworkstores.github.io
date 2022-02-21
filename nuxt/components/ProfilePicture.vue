<template>
  <v-btn text v-bind="attrs" v-on="on">
    <v-avatar size="36">
      <img :src="src" alt="Profile Picture">
    </v-avatar>
  </v-btn>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    on: {},
    attrs: {}
  }
}
</script>