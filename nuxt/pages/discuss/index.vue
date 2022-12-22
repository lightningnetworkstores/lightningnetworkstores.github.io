<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="d-flex justify-space-around mt-5">
          <v-btn-toggle v-model="selected" rounded mandatory>
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
          <DiscussionsMobile v-if="$vuetify.breakpoint.mobile"/>
          <FilteredDiscussionsContainer v-if="!$vuetify.breakpoint.mobile"/>
        </div>
        <div v-if="showReviews">
          <Reviews/>
        </div>
        <div v-if="showNews">
          <Events/>
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
import FilteredDiscussionsContainer from '~/components/discussions/FilteredDiscussionsContainer.vue'
import DiscussionsMobile from '@/components/discussions/DiscussionsMobile.vue'
import AddDiscussModal from '@/components/discussions/AddDiscussModal'
import Reviews from '@/components/reviews/Reviews.vue'
import Events from '@/components/events/Events.vue'

import { mapActions, mapState } from 'vuex'

export default {
  components: { FilteredDiscussionsContainer, DiscussionsMobile, Reviews, Events, AddDiscussModal },
  data() {
    return {
      selected: 0
    }
  },
  async mounted() {
    this.$store.dispatch('discussions/getDiscussions')
    await this.$store.dispatch('getDiscussions')
    this.updateLastDiscussionTime({
      discussionTime: this.lastActivity,
    })
  },
  methods: {
    ...mapActions(['updateLastDiscussionTime']),
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
    },
    ...mapState(['lastActivity'])
  },
  watch: {
    lastActivity(newValue) {
      if (newValue !== 0) {
        this.updateLastDiscussionTime({
          discussionTime: this.lastActivity,
        })
      }
    },
  }
}
</script>