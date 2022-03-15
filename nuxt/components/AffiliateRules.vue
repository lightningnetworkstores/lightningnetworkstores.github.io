<template>
    <v-card>
        <v-card-title> Affiliate Program </v-card-title>
        <v-card-text v-if="affiliate">
            You will currently earn {{ affiliate.reward_per_referral }} for
            every unique user you refer to our website. Your affiliate code is
            <strong @click="copyAffiliate" class="affiliate-code">{{
                affiliate.affiliate_code
            }}</strong
            >, and you can use it in any page, eg.
        </v-card-text>
        <v-card-text v-if="affiliate">
            <ul>
                <li>
                    <a
                        :href="restoringPath(affiliate.affiliate_link_example)"
                        >{{
                            restoringPath(affiliate.affiliate_link_example)
                        }}</a
                    >
                    <v-btn
                        class="mx-3"
                        icon
                        x-small
                        @click="
                            () =>
                                copyURL(
                                    restoringPath(
                                        affiliate.affiliate_link_example
                                    )
                                )
                        "
                    >
                        <v-icon>mdi-content-copy</v-icon>
                    </v-btn>
                </li>
                <li>
                    <a
                        :href="restoringPath(affiliate.affiliate_link_example2)"
                        >{{
                            restoringPath(affiliate.affiliate_link_example2)
                        }}</a
                    >
                    <v-btn
                        class="mx-3"
                        icon
                        x-small
                        @click="
                            () =>
                                copyURL(
                                    restoringPath(
                                        affiliate.affiliate_link_example2
                                    )
                                )
                        "
                    >
                        <v-icon>mdi-content-copy</v-icon>
                    </v-btn>
                </li>
                <li>
                    <a
                        :href="restoringPath(affiliate.affiliate_link_example3)"
                        >{{
                            restoringPath(affiliate.affiliate_link_example3)
                        }}</a
                    >
                    <v-btn
                        class="mx-3"
                        icon
                        x-small
                        @click="
                            () =>
                                copyURL(
                                    restoringPath(
                                        affiliate.affiliate_link_example3
                                    )
                                )
                        "
                    >
                        <v-icon>mdi-content-copy</v-icon>
                    </v-btn>
                </li>
            </ul>
        </v-card-text>
        <v-card-text v-if="affiliate">
            <p class="my-0">Pending Payout: {{ affiliate.pending }}</p>
            <p class="my-0">Minimum payout: {{ affiliate.payout_every }}</p>
            <p class="my-0">Total Paid: {{ affiliate.paid }}</p>
        </v-card-text>
        <v-card-text v-if="affiliate">
            <p class="my-0">
                Current reward per unique human referral:
                {{ affiliate.reward_per_referral }}
            </p>
            <p class="my-0">
                Traffic quality: {{ affiliate.quality_score }}%
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            small
                            color="#d6d6d6"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>mdi-information</v-icon>
                        </v-btn>
                    </template>
                    <span
                        >Measures if your referrals are real users or bots</span
                    >
                </v-tooltip>
            </p>
            <v-progress-linear
                :value="affiliate.quality_score"
                style="width: 8em"
            ></v-progress-linear>
            <p class="my-0">
                Repeat Rate: {{ affiliate.repeat_rate }}%
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            small
                            color="#d6d6d6"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>mdi-information</v-icon>
                        </v-btn>
                    </template>
                    <span
                        >Measures if your referrals are unique or not. A high
                        value is bad.</span
                    >
                </v-tooltip>
            </p>
            <v-progress-linear
                color="red"
                :value="affiliate.repeat_rate"
                style="width: 8em"
            ></v-progress-linear>
            <p class="my-0">
                Current adjusted reward per referral:
                {{
                    Math.max(
                        1,
                        Math.round(
                            (affiliate.reward_per_referral *
                                (100 - affiliate.repeat_rate) *
                                affiliate.quality_score) /
                                10000
                        )
                    )
                }}
            </p>
        </v-card-text>
        <v-snackbar v-model="showSnackbar" class="text-center" :timeout="2e3">
            {{ snackbarMessage }}
            <template v-slot:action="{ attrs }">
                <v-btn
                    color="primary"
                    text
                    v-bind="attrs"
                    @click="showSnackbar = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-card>
</template>
<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            showSnackbar: false,
            snackbarMessage: '',
        }
    },
    methods: {
        copyAffiliate(e) {
            navigator.clipboard.writeText(this.affiliate.affiliate_code)
            this.showSnackbar = true
            this.snackbarMessage = 'Referral code copied!'
        },
        copyURL(url) {
            navigator.clipboard.writeText(url)
            this.showSnackbar = true
            this.snackbarMessage = 'URL copied!'
        },
        restoringPath(url, code = 'af') {
            const urlString = String(url).split(`?${code}=`)

            const getSliceUrl =
                urlString[0].substr(-1) === '/'
                    ? urlString[0].substring(0, urlString[0].length - 1)
                    : urlString[0]
            const newUrl = `${getSliceUrl}/${code}/${urlString[1]}`
            return newUrl
        },
    },
    computed: {
        ...mapState('wallet', ['affiliate']),
    },
}
</script>
<style scoped>
.affiliate-code {
    cursor: pointer;
}
</style>
