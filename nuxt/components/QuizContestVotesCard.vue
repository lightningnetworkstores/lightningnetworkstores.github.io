<template>
    <v-card hover class="d-flex flex-column justify-space-between quizCard">
        <v-card-title>{{ option }}</v-card-title>
        <v-divider class="mb-1" />

        <v-card-text class="px-4 py-2 text-left">
            <span>voted by</span>
            <div
                class="
                    d-flex
                    flex-wrap
                    align-center
                    storeVotes.votes-voted-container
                "
            >
                <v-menu
                    v-for="n in votesLengthForUsers"
                    :key="`votes-${n}`"
                    top
                    open-on-hover
                    rounded
                    offset-y
                >
                    <template v-slot:activator="{ on }">
                        <v-btn icon x-large v-on="on">
                            <v-avatar
                                size="32"
                                class="storeVotes.votes-votes-avatar"
                            >
                                <img :src="votesProfileImage((n-1))" />
                            </v-avatar>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-list-item-content>
                            <div class="mx-auto text-left px-4">
                                <div class="d-flex align-center">
                                    <v-avatar color="brown" size="38">
                                        <img :src="votesProfileImage((n-1))" />
                                    </v-avatar>
                                    <div class="ml-2">
                                        <h3 class="mb-1">
                                            {{ votesProfileName((n-1)) }}
                                        </h3>
                                        <p class="text-caption mb-0">
                                            {{ votesProfileHandle((n-1)) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </v-list-item-content>
                    </v-card>
                </v-menu>

                <v-btn v-if="(votesLengthForUsers > 8)" icon x-large v-on="on">
                    <v-avatar
                        size="28"
                        class="storeVotes.votes-votes-avatar"
                        color="blue-grey darken-4"
                    >
                        <span class="white--text text-caption">+20</span>
                    </v-avatar>
                </v-btn>
            </div>

            <v-divider class="mb-2" />
            <span>Bets</span>
            <div class="d-flex flex-wrap storeVotes.votes-voted-container">
                <v-menu
                    v-for="n in betsLengthForUsers"
                    :key="`bet-${n}`"
                    top
                    open-on-hover
                    min-width="140px"
                    rounded
                    offset-y
                >
                    <template v-slot:activator="{ on }">
                        <v-btn icon x-large v-on="on">
                            <v-avatar
                                size="32"
                                class="storeVotes.votes-votes-avatar"
                            >                                
                                <img :src="betsProfileImage((n-1))" />
                            </v-avatar>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-list-item-content>
                            <div class="mx-auto text-left px-4">
                                <div class="d-flex align-center">
                                    <v-avatar color="brown" size="38">
                                        <img :src="betsProfileImage((n-1))" />
                                    </v-avatar>
                                    <div class="ml-2">
                                        <h3 class="mb-1">
                                            {{ betsProfileName((n-1)) }}
                                        </h3>
                                        <p class="text-caption mb-0">
                                            {{ betsProfileHandle((n-1)) }}
                                        </p>
                                    </div>
                                </div>
                                <v-chip
                                    class="ma-2"
                                    color="amber darken-4"
                                    text-color="white"
                                >
                                    <v-avatar left class="amber darken-3">
                                        {{ betsProfileWager((n-1)) }}
                                    </v-avatar>
                                    Sats betted
                                </v-chip>
                            </div>
                        </v-list-item-content>
                    </v-card>
                </v-menu>

                <v-btn v-if="(betsLengthForUsers > 8)" icon x-large>
                    <v-avatar
                        size="32"
                        class="storeVotes.votes-votes-avatar"
                        color="blue-grey darken-4"
                    >
                        <span class="white--text text-caption"
                            >+{{ bets.length - 8 }}</span
                        >
                    </v-avatar>
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: ['option', 'votes', 'bets'],
    computed: {
        ...mapState({
            baseURL(state) {
                return state.baseURL
            },
        }),
        votesProfileImage() {
            return (n) => this.votes[n]?.profile.image ?? ""
        },
        votesProfileName() {
            return (n) => this.votes[n]?.profile.name ?? ""
        },
        votesProfileHandle() {
            return (n) => this.votes[n]?.profile.handle ?? ""
        },
        betsProfileImage() {
            return (n) => this.bets[n]?.profile.image ?? ""
        },
        betsProfileName() {
            return (n) => this.bets[n]?.profile.name ?? ""
        },
        betsProfileHandle() {
            return (n) => this.bets[n]?.profile.handle ?? ""
        },
        betsProfileWager() {
            return (n) => this.bets[n]?.wager ?? ""
        },
        votesLengthForUsers() {
            return (this.votes.length > 0) ? ((this.votes.length > 8) ? 8 : this.votes.length) : 0 
        },
        betsLengthForUsers() {
            return (this.bets.length > 0) ? ((this.bets.length > 8) ? 8 : this.bets.length) : 0
        },
    },
    methods: {
        getStoreLink(link) {
            const url = new URL(link)
            const baseUrl = new URL(this.baseURL)
            url.searchParams.append('utm_source', baseUrl.host)
            return url.toString()
        },
        gotoStore(store) {
            const { id, rootUrl } = store

            this.$route.meta.storeId = id
            this.$router.push('/store/' + rootUrl)
        },
    },
}
</script>

<style>
.user-voted-container {
    display: flex;
    row-gap: 4px;
    width: 100%;
}

.user-voted-container > * {
    margin-inline: -12px;
}

.user-vote-avatar {
    border: 2px solid white;
}

.quizCard {
    width: 100%;
}
</style>
