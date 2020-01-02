<template>
    <div class="about">
        <v-layout justify-center>
            <v-flex xs12 md12 lg10 xl8>
                <v-container class="wrap-text">
                    <v-layout row>
                        <h1>About</h1>
                    </v-layout>
                    <v-layout row>
                        <h2>Goal</h2>
                    </v-layout>

                    <v-layout row>
                        <p>
                            The goal of this website is to track the adoption of the lightning network by merchants and to inform bitcoin users where they can spend their bitcoin through lightning. It
                            tries to be most complete repository of lightning merchants, while also providing a comprehensive list of lightning mobile wallets.
                        </p>
                    </v-layout>

                    <v-layout row>
                        <h2>Contact</h2>
                    </v-layout>

                    <v-layout row>
                        <p>Main developer/maintainer: Pedro FR</p>
                    </v-layout>
                    <v-layout row>
                        <p>Email: lightningnetworkstores@gmail.com</p>
                    </v-layout>
                    <v-layout row>
                        <p>Twitter: <a href="https://twitter.com/bitcoinLNS">@bitcoinLNS </a></p>
                    </v-layout>
                    <v-layout row>
                        <p>Telegram: <a href="https://t.me/LNstores">LNstores</a> (public group), <a href="https://t.me/bitcoinLNS"> @bitcoinLNS</a> (username)</p>
                    </v-layout>
                    <v-layout row>
                        <p>
                            Git repository:
                            <a href="https://github.com/lightningnetworkstores/lightningnetworkstores.github.io">https://github.com/lightningnetworkstores/lightningnetworkstores.github.io</a>
                        </p>
                    </v-layout>
                    <v-layout row>
                        <p>Our node (using Strike from Acinq): 03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f@34.239.230.56:9735</p>
                    </v-layout>

                    <v-layout row>
                        <h2>F.A.Q.</h2>
                    </v-layout>
                    <v-layout row>
                        <h4>I don't understand this website, how do I use it?</h4>
                    </v-layout>
                    <v-layout row>
                        <p>Check our quick tutorial here: <tutorial-modal></tutorial-modal></p>
                    </v-layout>
                    <v-layout row>
                        <h4>How to get a store listed?</h4>
                    </v-layout>
                    <v-layout row>
                        <p>
                            A store can get instantly added by using the
                            <v-btn color="green" dark fab small>
                                <v-icon>add</v-icon>
                            </v-btn>
                            button on the <a href="/">main page.</a><br />
                            If you are trustworthy or plan on adding several stores, ask for a coupon code so you can add stores without paying the small entry fee.
                        </p>
                    </v-layout>
                    <v-layout row>
                        <p>
                            In the rare scenario where the button doesn't work or you can't route a payment, you can make a pull request to
                            <a href="https://github.com/lightningnetworkstores/lightningnetworkstores.github.io/blob/master/sites.json">sites.json</a>
                            or send an email to lightningnetworkstores@gmail.com
                        </p>
                    </v-layout>

                    <v-layout row>
                        <h4>How to edit or remove a store?</h4>
                    </v-layout>
                    <v-layout row>
                        <p>Use the <i class="fas fa-edit"></i> and <i class="fas fa-ban"></i> icons on the store page.</p>
                    </v-layout>
                    <v-layout row>
                        <h4>How to add/edit/remove a wallet/service/donation-address?</h4>
                    </v-layout>
                    <v-layout row>
                        <p>
                            If you are used to working with git, make a pull request to
                            <a href="https://github.com/lightningnetworkstores/lightningnetworkstores.github.io/blob/master/wallets.json">wallets.json</a>,
                            <a href="https://github.com/lightningnetworkstores/lightningnetworkstores.github.io/blob/master/services.json">services.json</a> or
                            <a href="https://github.com/lightningnetworkstores/lightningnetworkstores.github.io/blob/master/donationAddresses.json">donationAddresses.json</a>
                        </p>
                    </v-layout>
                    <v-layout row>
                        <h4>How are the trending and controversial scores calculated?</h4>
                    </v-layout>
                    <v-layout row>
                        <p>
                            Controversial scores are calculated like
                            <a href="https://www.reddit.com/r/NoStupidQuestions/comments/433ayh/how_does_reddit_determine_what_is_controversial/czfbxk4/">reddit does</a>. Trending scores are
                            calculated using the formula: (S-EMA)/max(40000000, min(20000,S)), where S is the current score of the store in satoshis (upvotes-downvotes) and EMA is the exponential
                            moving average of the score. The half-life of the EMA is currently set to 4 days. This formula may be tweaked in the future.
                        </p>
                    </v-layout>
                    <v-layout row>
                        <h4>When are stores tweeted in <a href="https://twitter.com/bitcoinLNS">@bitcoinLNS?</a></h4>
                    </v-layout>
                    <v-layout row>
                        <p>
                            Currently every new store and trending stores (trending score &gt;= 30) are tweeted. A store can be tweeted again if: it hasn't been tweeted for 8 days, it's score has been
                            increased by at least 100000 satoshis (1 mBTC) since the last tweet and has a trending score no lower than 30. Only payments can trigger tweets, no matter how small or the
                            direction. These rules are subject to change and might even be held secret if people start abusing them.
                        </p>
                    </v-layout>
                    <v-layout row>
                        <h2>Acknowledgements</h2>
                    </v-layout>
                    <v-layout row>
                        <p>
                            A big Thanks for all the people that add new lightning stores as they get announced! If you are frequent contributor, ask for a coupon code to add stores without paying the
                            small entry fee.
                        </p>
                    </v-layout>
                </v-container>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import TutorialModal from "@/components/TutorialModal.vue";

@Component({ components: { TutorialModal } })
export default class About extends Vue {
    created() {}
}
</script>

<style scoped lang="scss">
.wrap-text {
    -ms-word-break: break-all;
    word-break: break-all;
    word-break: break-word;
}
</style>
