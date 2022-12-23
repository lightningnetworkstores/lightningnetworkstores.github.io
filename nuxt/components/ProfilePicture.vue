<template>
  <v-btn text v-bind="attrs" v-on="on">
    <div class="d-flex flex-column justify-center align-center">
      <v-avatar size="36">
        <img :src="src" alt="Profile Picture">
      </v-avatar>
      <v-chip x-small :ripple="false" class="profile-balance-container mx-6">
        <div class="text-caption"> 21e6 <i class="fak fa-regular"></i></div>
      </v-chip>
    </div>
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
<style scoped>
.profile-balance-container {
  margin-top: -5px;
}
</style>