<template>
  <div class="d-flex flex-column mt-8 align-center">
    <div class="d-flex align-center justify-center contest-info">
      <div class="d-flex align-center">
        <span class="title">Time left:</span>
        <div>
          <flip-countdown
            :deadline="deadline"
            :showDays="false"
            countdownSize="32px"
            labelSize="14px"
          ></flip-countdown>
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

    <v-container class="my-4" v-if="isLogged && userBets">
      <h3 class="mb-4">Your bets</h3>
      <user-bets-table :userBets="userBets" :waitingForEnd="stage !== 'MAIN'" />
    </v-container>

    <h1 class="pt-10">What's your favorite project?</h1>

    <v-container v-if="!isLogged" class="d-flex flex-column mt-8 align-center">
      <h3>You need to be logged to play</h3>
      <v-btn
        color="blue lighten-1"
        class="mx-2 my-3 white--text"
        @click="handleLoginClick"
      >
        <v-icon left dark> mdi-twitter </v-icon>
        login with twitter
      </v-btn>
    </v-container>

    <v-container v-if="false" class="grid-list mt-8">
      <contest-store-card
        v-for="store in storeContest.stores"
        :data-storeId="store.id"
        :key="'store-' + store.id"
        :store="store"
        :contestId="storeContest.contest.id"
        :disabled="!isLogged || isContestClosed"
        :selected="store.id === choice"
        :minBet="minimumBet"
      />
    </v-container>
    <v-container v-else>
      <v-row no-gutters>
        <v-col cols="12" sm="4">Stores </v-col>
        <v-col cols="12" sm="4">votes </v-col>
        <v-col cols="12" sm="4"> bets</v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" sm="4">
          <store-card :data-storeId="sampleStore.id" :store="sampleStore" />
        </v-col>
        <v-col cols="12" sm="4">
          <div>
            <v-avatar v-for="n in 3" :key="n" size="60">
              <img :src="sampleUser.image" alt="John" />
            </v-avatar>
          </div>
        </v-col>
        <v-col cols="12" sm="4"> </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import FlipCountdown from "vue2-flip-countdown";

export default {
  data() {
    return {
      sampleStore: {
        trending: 0,
        total_comments: 0,
        upvotes: 225,
        added: 1519419592,
        scores: {},
        lifetime: 5000,
        description: "UK bitcoin exchange.",
        likely_tags: [],
        downvotes: 5,
        uri:
          "032271efcb35188ef00e3f28469a2bb18b50a5f2f325bd130bdac341af24e9b5f0@37.221.209.222:9735",
        rooturl: "bitbargain.co.uk",
        tags: ["exchange"],
        digital_goods: "yes",
        score: 220,
        sorting: 220,
        name: "Bitbargain",
        rank: 165,
        id: 5,
        href: "https://bitbargain.co.uk/",
        last_commented: 0,
        sector: "exchange",
        likes: 0,
      },
      sampleUser: {
        image:
          "https://pbs.twimg.com/profile_images/1480757562354159617/btO-pmbJ_normal.jpg",
        name: "Kevin Aguilar ⚛",
        handle: "_aguilarkevin_",
      },
    };
  },
  components: { FlipCountdown },
  computed: {
    ...mapGetters({
      storeContest: "getStoreContest",
    }),
    ...mapState({
      isLogged(state) {
        if (state.loginStatus.user) return state.loginStatus.user.logged;
        else return false;
      },
    }),
    deadline() {
      return this.storeContest.contest?.end
        ? new Date(this.storeContest.contest?.end).toLocaleString()
        : "2020-01-01:00:00:00";
    },
    userBets() {
      return (
        this.storeContest?.user_bets?.map(({ wager, choice, prize }) => {
          return {
            choice: this.storeContest.stores?.find((store) => store.id == choice)?.name,
            prize: prize,
            wager: wager,
          };
        }) || []
      );
    },
    pot() {
      return this.storeContest.contest?.pot;
    },
    minimumBet() {
      return this.storeContest.minimum_bet;
    },
    stage() {
      return this.storeContest.contest?.stage;
    },
    choice() {
      return this.storeContest.userVote?.choice;
    },
    isContestClosed() {
      switch (this.stage) {
        case "DISQUALIFIED":
        case "COMPLETE":
        case "CANCELLED":
          return true;
        default:
          return false;
      }
    },
    votes() {
      if (this.isContestClosed) {
        return this.storeContest.stores.map((store) => {
          return {
            store,
            votes:
              this.storeContest.votes?.filter((vote) => vote.choice === store.id) || [],
            bets: this.storeContest.bets?.filter((bet) => bet.choice === store.id) || [],
          };
        });
      }
      return [];
    },
  },
  methods: {
    handleLoginClick() {
      this.$axios
        .get("/api/oauthlogin?platform=twitter")
        .then((res) => res.data)
        .then((data) => {
          const { request_token, authorization_url, platform } = data.data;
          console.log({ request_token, authorization_url, platform });
          window.location.replace(authorization_url);
        });
    },
  },

  beforeMount() {
    this.$store.dispatch("getStoreContest");
  },
};
</script>

<style scoped>
.grid-list {
  gap: 24px;
  display: grid;
  width: 80%;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
</style>
