<template>
  <v-chip small>
    <v-icon class="pr-3">mdi-account-circle</v-icon>
    {{ userId }}
  </v-chip>
</template>
<script>
export default {
  props: {
    userId: {
      type: Object,
      required: true
    }
  }
}
</script>