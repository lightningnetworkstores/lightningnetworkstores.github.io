<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-around mt-5">
          <v-btn-toggle v-model="selected" rounded>
            <v-btn :width="buttonWidth" height="60">
              <div class="d-flex flex-column justify-center align-center">
                <v-icon color="grey" class="mb-1">mdi-comment-text</v-icon>
                Discussions
              </div>
            </v-btn>
            <v-btn :width="buttonWidth" height="60">
              <div class="d-flex flex-column justify-center align-center">
                <v-icon color="grey" class="mb-1">mdi-star</v-icon>
                Reviews
              </div>
            </v-btn>
            <v-btn :width="buttonWidth" height="60">
              <div class="d-flex flex-column justify-center align-center">
                <v-icon color="grey" class="mb-1">mdi-newspaper</v-icon>
                News/Events
              </div>
            </v-btn>
          </v-btn-toggle>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="showAll">
      <v-col>
        <div>Showing all</div>
      </v-col>
    </v-row>
    <v-row v-if="!showAll">
      <v-col>
        <div v-if="showDiscussions">
          Discussions
        </div>
        <div v-if="showReviews">
          Reviews
        </div>
        <div v-if="showNews">
          News
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AddDiscussModal v-if="selected === 0"/>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      selected: null
    }
  },
  computed: {
    buttonWidth() {
      switch(this.$vuetify.breakpoint.name) {
        case 'xs': return '33.33%'
        case 'sm': return 200
        case 'md': return 250
        case 'lg':
        case 'xl': return 350
      }
    },
    showAll() {
      return this.selected === null
    },
    showDiscussions(){
      return this.selected === 0
    },
    showReviews() {
      return this.selected === 1
    },
    showNews() {
      return this.selected === 2
    }
  }
}
</script>