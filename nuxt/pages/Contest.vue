<template>
    <v-container
        ><v-row>
            <v-col class="col-md-2">
                <v-btn
                    outlined
                    color="#424242"
                    :class="isActivePrevious ? 'isActive' : ''"
                    @click="handlePreviousContentStore()"
                >
                    Previous
                </v-btn>
            </v-col>
            <v-col class="col-md-8">
                <h1 class="text-center">What's your favorite project?</h1>
            </v-col>
            <v-col class="col-md-2 text-right">
                <v-btn
                    outlined
                    color="#424242"
                    :class="isActivePrevious ? '' : 'isActive'"
                    @click="handleResetContentStore()"
                >
                    Now
                </v-btn>
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
                    :waitingForEnd="isContestClosed"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col><v-divider class="mt-8" /></v-col>
        </v-row>
        <template v-if="false">
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
    data() {
        return {
            countPrevious: 0,
            isActivePrevious: false,
        }
    },
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
            return this.storeContest.userVote?.choice
        },
        isContestClosed() {
            switch (this.stage) {
                case 'DISQUALIFIED':
                case 'COMPLETE':
                case 'CANCELLED':
                    return true
                default:
                    return false
            }
        },
        votes() {
            if (this.isContestClosed) {
                return this.storeContest.stores.map((store) => {
                    return {
                        store,
                        votes:
                            this.storeContest.votes?.filter(
                                (vote) => vote.choice === store.id
                            ) || [],
                        bets:
                            this.storeContest.bets?.filter(
                                (bet) => bet.choice === store.id
                            ) || [],
                    }
                })
            }
            return []
        },
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
        handlePreviousContentStore() {
            this.countPrevious = this.countPrevious + 1
            this.$store.dispatch('previousStoreContest', this.countPrevious)
            this.$store.dispatch('getStoreContest')
            this.isActivePrevious = true
        },
        handleResetContentStore() {
            this.countPrevious = 0
            this.$store.dispatch('previousStoreContest', 0)
            this.$store.dispatch('getStoreContest')
            this.isActivePrevious = false
        },
    },

    beforeMount() {
        this.$store.dispatch('getStoreContest')
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
.isActive {
    background: #424242;
    border: 1px solid #424242;
    color: white !important;
}
</style>
