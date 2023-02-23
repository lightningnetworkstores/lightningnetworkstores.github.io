<template>
  <v-chip class="pl-1">
    <div class="d-flex justify-start align-center">
      <v-avatar class="mr-1 light-dark-border-circle">
        <v-img :src="user.image"/>
      </v-avatar>
      <div>
        <div class="text-caption user-avatar-text">
          {{ user.name }}
        </div>
        <div v-if="user.handle" class=" text-caption font-weight-thin user-avatar-text">
          @{{ user.handle }}
        </div>
      </div>
    </div>
  </v-chip>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
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