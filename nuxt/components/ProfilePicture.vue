<template>
  <v-btn text v-bind="attrs" v-on="on">
    <div class="d-flex flex-column justify-center align-center">
      <v-avatar size="36">
        <img :src="src" alt="Profile Picture">
      </v-avatar>
      <v-chip
        x-small
        :ripple="false"
        class="profile-balance-container px-1"
        color="primary"
        style="min-width: 4em"
        :style="{'opacity': showBalance ? 1 : 0}"
      >
        <div v-if="showBalance" class="text-caption"> {{ numify(balance.available) }} <i class="fak fa-regular"></i></div>
      </v-chip>
    </div>
  </v-btn>
</template>
<script>
import { numify } from 'numify'
import { mapState } from 'vuex'
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    on: {},
    attrs: {}
  },
  data() {
    return {
      numify
    }
  },
  computed: {
    ...mapState(['loginStatus']),
    ...mapState('wallet', ['balance']),
    showBalance() {
      return this.loginStatus && this.balance
    }
  }
}
</script>
<style scoped>
.profile-balance-container {
  margin-top: -5px;
}
</style>
