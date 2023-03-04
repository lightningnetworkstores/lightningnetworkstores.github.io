<template>
  <v-chip class="pl-1" @click="() => onClick(user)">
    <div class="d-flex justify-start align-center">
      <v-avatar class="mr-1 light-dark-border-circle">
        <v-img :src="user.image"/>
      </v-avatar>
      <div class="mx-2">
        <div class="text-caption user-avatar-text">
          {{ user.name }}
        </div>
        <div v-if="user.handle" class=" text-caption font-weight-thin user-avatar-text">
          @{{ user.handle }}
        </div>
      </div>
      <v-divider v-if="wager" vertical></v-divider>
      <div v-if="wager" class="ml-1 d-flex justify-space-between align-center" style="min-width: 2.4em">
        <span class="text-caption">{{ numify(wager) }}</span>
        <i class="fak fa-satoshisymbol-solidtilt"/>
      </div>
    </div>
  </v-chip>
</template>
<script>
import { numify } from 'numify'
export default {
  data() {
    return {
      numify
    }
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    wager: {
      type: Number,
      required: false
    }
  },
  methods: {
    onClick(user) {
      window.open(`https://www.twitter.com/${user.handle}`, '_blank', 'noopener')
    }
  }
}
</script>
<style scoped>
.user-avatar-text {
  line-height: 1;
}
.light-dark-border-circle {
  border: 0.8px solid rgb(85, 83, 83);
}
</style>