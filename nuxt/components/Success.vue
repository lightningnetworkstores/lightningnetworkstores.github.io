<template>
  <v-card flat class="text-center">
    <v-card-title class="headline">
      <v-row class="py-2">
        <v-flex>{{ confirm_title }}</v-flex>
      </v-row>
    </v-card-title>
    <v-icon size="100" color="green" pa-5>fas fa-check-circle</v-icon>

    <blockquote class="twitter-tweet" v-if="tweet">
      <a :href="'https://twitter.com/x/status/' + tweet"></a>
    </blockquote>
    <script
      async
      src="https://platform.twitter.com/widgets.js"
      charset="utf-8"
    ></script>
    <v-row v-if="Object.keys(store).length" class="ma-2 pt-2">
      <v-flex
        >Go to <a :href="'/store/' + store.id">{{ store.name }}</a></v-flex
      >
    </v-row>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="green darken-1" text @click="handleClose"> Close </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'Success',
  props: {
    tweet: {
      type: String,
      default: '',
    },
    confirm_title: {
      type: String,
      default: '',
    },
    store: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    handleClose() {
      this.$emit('cancel')
    },
  },
}
</script>
