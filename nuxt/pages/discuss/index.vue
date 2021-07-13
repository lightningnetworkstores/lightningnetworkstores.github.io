<template>
  <div justify-center>
    <AddDiscussModal />
    <v-container fluid class="px-12">
      <v-row>
        <v-col cols="12" lg="4" md="6" xs="12" sm="12">
          <div class="text-center text-h6 py-6">
            <v-layout justify-center ma-3>
              <h2>General discussions</h2></v-layout
            >
          </div>
          <LazyListCards
            :items="lastDiscussions"
            :className="$style['store-row']"
          >
            <template slot="item" slot-scope="{ slotScope: discussion }">
              <Thread
                class="store-card"
                :store="{}"
                :comment="discussion[0]"
                :comments="discussion.slice(1)"
                :type="'discussion'"
                :onlyShowLast="2"
              >
              </Thread>
            </template>
          </LazyListCards>
        </v-col>
        <v-col cols="12" lg="4" md="6" sm="12" xs="12">
          <div class="text-center text-h6 py-6">
            <v-layout justify-center ma-3>
              <h2>Store discussions/reviews</h2></v-layout
            >
          </div>
          <LazyListCards
            :items="getActiveStoreDiscussions"
            :className="$style['store-row']"
            :maxItems="1"
          >
            <template slot="item" slot-scope="{ slotScope: discussion }">
              <store-card
                :class="`${$style['store-card']} mb-2`"
                :key="'store-' + discussion.store.id"
                :store="discussion.store"
              >
              </store-card>
              <Thread
                class="store-card"
                :comment="
                  discussion.reviews
                    ? discussion.reviews[0]
                    : discussion.discussions[0]
                "
                :comments="
                  discussion.reviews
                    ? discussion.reviews.slice(1)
                    : discussion.discussions.slice(1)
                "
                :store="discussion.store"
                :type="discussion.reviews ? 'comment' : 'discussion'"
              >
              </Thread>
            </template>
          </LazyListCards>
        </v-col>
        <v-col cols="12" lg="4" md="12" sm="12" xs="12">
          <div class="text-center text-h6 py-6">
            <v-layout justify-center ma-3> <h2>Events</h2></v-layout>
          </div>
          <LazyListCards
            :items="storeEvents"
            :className="$style['store-row']"
            :maxItems="1"
          >
            <template slot="item" slot-scope="{ slotScope: discussion }">
              <store-card
                :class="`${$style['store-card']} mb-2`"
                :key="'store-' + discussion.id"
                :store="discussion"
              >
              </store-card>
              <event-card :event="discussion.event" :type="discussion.type" />
            </template>
          </LazyListCards>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

import AddDiscussModal from '@/components/AddDiscussModal.vue'
import EventCard from '@/components/EventCard.vue'
import LazyListCards from '@/components/LazyListCards.vue'

export default {
  components: { AddDiscussModal, EventCard, LazyListCards },
  data() {
    return {
      discussions: [],
      maxCards: 1,
      events: [],
    }
  },
  computed: {
    ...mapGetters(['getActiveStoreDiscussions']),
    ...mapState(['lastDiscussions', 'storeEvents']),
  },
  mounted() {
    this.$store.dispatch('getDiscussions')
  },
}
</script>
<style module>
.store-row {
  flex-direction: column;
  align-content: center;
  padding: 2em;
  max-width: 550px;
  margin: auto;
}

.store-card {
  width: 100%;
}

@media (max-width: 600px) {
  .store-row {
    padding: 1.5em 0;
  }
}
</style>