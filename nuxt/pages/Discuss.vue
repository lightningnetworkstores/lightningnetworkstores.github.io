<template>
  <v-layout justify-center>
    <v-flex xs12 md12 lg10 xl12 class="pa-2">
      <v-container>
        <v-row
          class="store-row"
          v-for="discussion in this.$store.getters.getDiscussions"
          :key="'store-' + discussion.store.id"
        >
          <store-card
            class="store-card"
            :key="'store-' + discussion.store.id"
            :store="discussion.store"
          >
          </store-card>
          <Thread
            class="store-card"
            :comment="discussion.reviews[0]"
            :comments="discussion.reviews.slice(1)"
            :store="discussion.store"
          >
          </Thread>
        </v-row>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  head() {
    return {
      title: 'Lightning Network Discussion page',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Discuss and review stores/apps/projects about the Lightning Network',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lightning Network wallets',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            'Discuss and review stores/apps/projects about the Lightning Network',
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: 'Lightning Network Discussion page',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Discuss and review stores/apps/projects about the Lightning Network',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: '/ogimage.png',
        },
        {
          hid: 'twitter:image:src',
          property: 'twitter:image:src',
          content: '/ogimage.png',
        },
      ],
    }
  },
  data() {
    return {
      discussions: [],
    }
  },
  mounted() {
    this.$store.dispatch('getDiscussions')
    this.$recaptcha.init()
  },
}
</script>
<style scoped>
.store-row {
  flex-direction: column;
  align-content: center;
  padding: 2em;
}
.store-card {
  width: 50%;
}
@media (max-width: 600px) {
  .store-row {
    padding: 1.5em 0;
  }
  .store-card {
    width: 100%;
  }
}
</style>
