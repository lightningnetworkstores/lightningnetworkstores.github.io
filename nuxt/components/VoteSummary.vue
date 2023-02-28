<template>
  <v-dialog v-model="showDetails" width="600">
    <template v-slot:activator="{ on, attrs }">
      <div class="d-flex align-center">
        <div v-for="n in votesLength" :key="`votes-${n}`">
          <v-tooltip bottom>
            <template v-slot:activator="activator">
              <v-btn icon x-large class="avatar-container" v-bind="activator.attrs" v-on="activator.on">
                <v-avatar size="32" class="dark-border-circle">
                  <img :src="getProfilePicture(n - 1)" />
                </v-avatar>
              </v-btn>
            </template>
            {{ votes[n - 1].profile.name }}
          </v-tooltip>
        </div>
        <div v-if="votesLength > 0">
          <v-btn icon x-large class="avatar-container" v-bind="attrs" v-on="on">
            <v-avatar size="32" class="dark-border-circle more">
              <v-icon small color="gray">mdi-magnify</v-icon>
            </v-avatar>
          </v-btn>
        </div>
      </div>
    </template>
    <v-card>
      <v-card-title>Votes Summary</v-card-title>
      <v-card-text>For the sake of transparency, every contest result is provided here.</v-card-text>
      <v-card-text>Here's the list of every user that voted on this contest.</v-card-text>
      <div class="px-4">
        <v-chip-group column>
          <simple-user-chip
            v-for="(vote, index) of votes" :key="`vote-${index}`"
            :user="vote.profile"
          />
        </v-chip-group>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="showDetails = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
const MAX_VOTES_TO_DISPLAY = 12
export default {
  props: {
    votes: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      showDetails: false
    }
  },
  methods: {
    getProfilePicture(n) {
      return this.votes[n].profile.image
    },
  },
  computed: {
    votesLength() {
      return Math.min(MAX_VOTES_TO_DISPLAY, this.votes.length)
    }
  }
}
</script>
<style scoped>
.avatar-container {
  margin-right: -30px;
}
.dark-border-circle {
  border: 0.8px solid black;
}
.light-dark-border-circle {
  border: 0.8px solid rgb(85, 83, 83);
}
.more {
  background: rgba(255, 255, 255, 0.88);
}
.user-avatar-text {
  line-height: 1;
}
</style>