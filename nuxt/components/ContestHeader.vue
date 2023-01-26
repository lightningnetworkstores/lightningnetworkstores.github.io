<template>
  <v-container>
    <v-row>
      <v-col class="col-md-2 d-flex justify-start">
        <v-btn
          outlined
          color="#424242"
          @click="onPrevious()"
          style="width: 9em"
          class="d-flex justify-center"
        >
          <v-icon v-if="!isMobile">mdi-chevron-left</v-icon>
          Previous
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="col-md-2 d-flex justify-end">
        <v-btn
          outlined
          color="#424242"
          :disabled="disableNext"
          @click="onNext()"
          style="width: 9em"
          class="d-flex justify-center"
        >
          Next
          <v-icon v-if="!isMobile">mdi-chevron-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">{{ question }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div
          class="
            d-flex
            flex-column flex-md-row
            align-center
            justify-center
            contest-info
          "
        >
          <div class="d-flex align-center justify-center flex-wrap">
            <div>
              <flip-countdown
                v-if="isContestRunning"
                :deadline="deadline"
                :showDays="false"
                countdownSize="32px"
                labelSize="14px"
              />
              <span v-else class="title ml-3"><b>{{ stage }}</b></span>
            </div>
          </div>
          <v-btn text href="#" color="primary" class="mx-16">
            <v-icon left dark>mdi-gamepad-variant</v-icon>
            Game rules
          </v-btn>
          <div class="d-flex align-center">
            <span class="title">Total bets (sats): {{ pot }}</span>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="!isLogged">
      <v-col class="text-center"
        ><h3>You need to be logged to play</h3>
        <v-btn
          color="blue lighten-1"
          class="mx-2 my-3 white--text"
          @click="handleLoginClick"
        >
          <v-icon left dark> mdi-twitter </v-icon>
          login with twitter
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3 class="mb-4">Your bets</h3>
        <user-bets-table
          :userBets="userBets"
          :waitingForEnd="isContestRunning"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import FlipCountdown from 'vue2-flip-countdown'
import { mapState } from 'vuex'

export default {
  components: { FlipCountdown },
  props: {
    name: {
      type: String,
      default: ''
    },
    age: {
      type: Number,
      default: 0
    },
    question: {
      type: String,
      required: true
    },
    deadline: {
      type: Date | String,
      required: true
    },
    stage: {
      validator(value) {
        if (!value) return true
        return [
          'MAIN', 'EXTENSION',
          'DISQUALIFIED',
          'COMPLETE', 'CANCELLED'
        ].includes(value)
      },
      required: true
    },
    userBets: {
      type: Array,
      default: []
    },
    pot: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleLoginClick() {
      this.$axios
        .get('/api/oauthlogin?platform=twitter')
        .then((res) => res.data)
        .then((data) => {
          const { request_token, authorization_url, platform } =
            data.data
          console.log({ request_token, authorization_url, platform })
          window.location.replace(authorization_url)
        })
    },
    onPrevious() {
      this.$store.dispatch('getStoreContest', {
        name: this.name,
        age: 1
      })
    },
    onNext() {
      this.$store.dispatch('getStoreContest', {
        name: this.name,
        age: -1
      })
    },
    isContestRunning() {
      return ['MAIN', 'EXTENSION'].includes(this.stage)
    },
    isContestClosed() {
      return ['DISQUALIFIED', 'COMPLETE', 'CANCELLED'].includes(this.stage)
    },
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    ...mapState({
      isLogged(state) {
        if (state.loginStatus.user) return state.loginStatus.user.logged
        else return false
      },
    }),
    disableNext() {
      if (this.stage) {
        return this.stage === 'MAIN' || this.stage === 'EXTENSION'
      }
      return false
    },
  }
}
</script>