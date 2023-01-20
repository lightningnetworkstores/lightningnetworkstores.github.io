<template>
  <v-container
    ><v-row>
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
        <h1 class="text-center">What's your favorite project?</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        ><div
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
                v-if="isActuallyContest"
                :deadline="deadline"
                :showDays="false"
                countdownSize="32px"
                labelSize="14px"
              ></flip-countdown>
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
        </div></v-col
      ></v-row
    >

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
          :waitingForEnd="isActuallyContest"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col><v-divider class="mt-8" /></v-col>
    </v-row>
    <template v-if="isContestClosed">
      <v-row>
        <v-col><h2>Contest Results</h2></v-col></v-row
      >
      <v-row>
        <v-col class="text-center">
          <div class="grid-list">
            <store-contest-votes-card
              v-for="storeVote in votes"
              :key="`store-${storeVote.store.id}`"
              :store="storeVote.store"
              :votes="storeVote.votes"
              :bets="storeVote.bets"
            /></div></v-col
      ></v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col><h2>Stores</h2></v-col></v-row
      >
      <v-row>
        <v-col>
          <div class="grid-list">
            <store-contest-card
              v-for="store in storeContest.stores"
              :data-storeId="store.id"
              :key="'store-' + store.id"
              :store="store"
              :contestId="storeContest.contest.id"
              :disabled="!isLogged || isContestClosed"
              :selected="store.id === choice"
              :minBet="minimumBet"
            /></div
        ></v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import FlipCountdown from 'vue2-flip-countdown'

export default {
  components: { FlipCountdown },
  computed: {
    ...mapGetters({
      storeContest: 'getStoreContest',
    }),
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
    deadline() {
      return this.storeContest.contest?.end
        ? new Date(this.storeContest.contest?.end).toLocaleString()
        : '2020-01-01:00:00:00'
    },
    userBets() {
      return (
        this.storeContest?.user_bets?.map(
          ({ wager, choice, prize }) => {
            return {
              choice: this.storeContest.stores?.find(
                (store) => store.id == choice
              )?.name,
              prize: prize,
              wager: wager,
            }
          }
        ) || []
      )
    },
    pot() {
      return this.storeContest.contest?.pot
    },
    minimumBet() {
      return this.storeContest.minimum_bet
    },
    stage() {
      return this.storeContest.contest?.stage
    },
    choice() {
      return parseInt((this.storeContest.user_vote?.choice ?? 0))
    },
    nameContest() {
      return this.storeContest.contest?.name
    },
    isActuallyContest() {
      if (
        ['MAIN', 'EXTENSION', 'ACTIVE'].includes(this.stage)
      ) {
        return true
      }

      return false
    },
    isContestClosed() {
      if (
        ['DISQUALIFIED', 'COMPLETE', 'CANCELLED'].includes(this.stage)
      ) {
        return true
      }

      return false
    },
    votes() {
      if (this.isContestClosed) {
        let votesInfo = this.storeContest.stores.map((store) => {
          return {
            store,
            votes:
              this.storeContest.votes?.filter(
                (vote) => parseInt(this.notIsNaN(vote.choice)) === store.id
              ) || [],
            bets:
              this.storeContest.bets?.filter(
                (bet) => parseInt(this.notIsNaN(bet.choice)) === store.id
              ) || [],
          }
        })
        
        return votesInfo
      }
      return []
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    }
  },
  watch: {
    nameContest(oldName, newName) {
      if (newName) {
        history.pushState({}, null, this.$route.path + '/' + newName)
      }
    }
  },
  methods: {
    notIsNaN (number) {
      if (isNaN(number)) {
        return 0
      }
      return number
    },
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
        name: this.storeContest.contest.name,
        age: 1
      })
    },
    onNext() {
      this.$store.dispatch('getStoreContest', {
        name: this.storeContest.contest.name,
        age: -1
      })
    },
  },
  beforeMount() {
    const payload = { age: 0 }
    if (this.$route.params?.name) {
      payload.name = this.$route.params.name
    }
    this.$store.dispatch('getStoreContest', payload)
  },
}
</script>

<style scoped>
.grid-list {
  gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.user-voted-container {
  gap: 2px;
}
</style>
