<template>
  <v-card hover width="500px" height="150px">
    <v-card-text class="pa-0 content">
      <div class="pa-2 pl-5">
        <div class="discussion-title">
          {{ discussion.title }}
        </div>
        <div class="description pt-2">{{ discussion.comment }}</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    discussion: {
      type: Object,
      default: () => {},
    },
  },
  methods: {},
  computed: {},
}
</script>

<style lang="scss">
.discussion-title {
  font-size: 1.7rem !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
.description {
  font-size: 14px !important;
  margin-top: 5px;
}
</style>
