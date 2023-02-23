<template>
  <v-dialog v-model="showDetails" width="600">
    <template v-slot:activator="{ on, attrs }">
      <div class="d-flex align-center">
        <div v-for="n in betsLength" :key="`bets-${n}`">
          <v-tooltip bottom>
            <template v-slot:activator="activator">
              <v-btn icon x-large class="avatar-container" v-bind="activator.attrs" v-on="activator.on">
                <v-avatar size="32" class="dark-border-circle">
                  <img :src="getProfilePicture(n - 1)" />
                </v-avatar>
              </v-btn>
            </template>
            {{ bets[n - 1].profile.name }}
          </v-tooltip>
        </div>
        <div>
          <v-btn v-if="hasManyVotes" icon x-large class="avatar-container" v-bind="attrs" v-on="on">
            <v-avatar size="32" class="dark-border-circle more">
              <v-icon small color="gray">mdi-dots-horizontal</v-icon>
            </v-avatar>
          </v-btn>
        </div>
      </div>
    </template>
    <v-card>
      <v-card-title>Bets Summary</v-card-title>
      <v-card-text>For the sake of transparency, every contest result is provided here.</v-card-text>
      <v-card-text>Here's the list of every user that wagered on this contest.</v-card-text>
      <div class="px-4">
        <v-chip-group column>
          <simple-user-chip
            v-for="(bet, index) of bets" :key="`bet-${index}`"
            :user="bet.profile"
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
  data() {
    return {
      showDetails: false
    }
  },
  props: {
    bets: {
      type: Array,
      default: []
    }
  },
  methods: {
    getProfilePicture(n) {
      return this.bets[n].profile.image
    },
  },
  computed: {
    betsLength() {
      return Math.min(MAX_VOTES_TO_DISPLAY, this.bets.length)
    },
    hasManyVotes() {
      return this.bets.length > MAX_VOTES_TO_DISPLAY
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
  background: white;
}
.user-avatar-text {
  line-height: 1;
}
</style>