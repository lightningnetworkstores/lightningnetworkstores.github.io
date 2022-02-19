<template>
  <div class="d-flex justify-space-around mt-5">
    <v-btn-toggle v-model="selected" mandatory rounded>
      <v-btn width="250" height="60">
        <div class="d-flex flex-column justify-center align-center">
          <v-icon color="grey" class="mb-1">mdi-comment-text</v-icon>
          Discussions
        </div>
      </v-btn>
      <v-btn width="250" height="60">
        <div class="d-flex flex-column justify-center align-center">
          <v-icon color="grey" class="mb-1">mdi-star</v-icon>
          Reviews
        </div>
      </v-btn>
      <v-btn width="250" height="60">
        <div class="d-flex flex-column justify-center align-center">
          <v-icon color="grey" class="mb-1">mdi-newspaper</v-icon>
          News/Events
        </div>
      </v-btn>
    </v-btn-toggle>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected: null
    }
  }
}
</script>