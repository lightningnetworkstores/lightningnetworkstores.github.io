<template>
  <div>
    <v-chip class="pl-1" color="secondary">
      <div
        class="d-flex justify-start align-center"
        style="min-width: 8em"
      >
        <v-avatar class="mr-1">
          <v-img v-if="user && user.image" :src="user.image" />
          <v-icon large v-else>mdi-account-circle</v-icon>
        </v-avatar>
        <div v-if="user && user.handle">
          <div class="text-caption py-0 my-0 tx-history-avatar-text">
            {{ user.name }}
          </div>
          <div
            class=" text-caption py-0 my-0 font-weight-thin tx-history-avatar-text"
          >
            @{{ user.handle }}
          </div>
        </div>
        <div v-else>
          <div
            v-if="user && user.name"
            class="text-caption py-0 my-0"
          >
            {{ user.name }}
          </div>
          <div v-if="user" class="text-caption py-0 my-0">
            {{ user.id }}
          </div>
          <div v-else class="text-caption py-0 my-0">External</div>
        </div>
      </div>
    </v-chip>
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
    },
  },
}
</script>
<style scoped>
.tx-history-avatar-text {
  line-height: 1;
}
</style>