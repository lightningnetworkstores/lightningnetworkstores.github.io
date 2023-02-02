<template>
  <div class="about">
    <v-layout justify-center>
      <v-flex xs12 md12 lg10 xl8 class="pa-6">
        <v-container class="wrap-text">
          <v-layout row>
            <h1>About</h1>
          </v-layout>
          <v-layout row>
            <h2>Summary</h2>
          </v-layout>

          <v-layout row>
            <p>
              This website is a repository of NOSTR (Notes and Other Stuff Transmitted by Relays) projects. 
              It's a fork of <a href="https://LightningNetworkStores.com">Lightning Network Stores</a> and therefore inherits most of its features. 
            </p>
          </v-layout>

          <v-layout row>
            <h2>Contact</h2>
          </v-layout>

          <v-layout row>
            <p>
              Team:
              <a href="https://twitter.com/pedr0fr" target="_blank" rel="noreferrer noopener">Pedro Fernandes</a>
              (founder),
              <a href="https://twitter.com/BitcoinBram" target="_blank" rel="noreferrer noopener">BitcoinBram</a>
              (frontend development) and
              <a href="https://twitter.com/bilthon" target="_blank" rel="noreferrer noopener">Bilthon</a>
              (frontend development)
            </p>
          </v-layout>
          <v-layout row>
            <p>Email: hi@lightningnetworkstores.com</p>
          </v-layout>
          <v-layout row>
            <p>
              Twitter: <a href="https://twitter.com/bitcoinLNS">@bitcoinLNS </a>
            </p>
          </v-layout>
          <v-layout row>
            <p>
              Telegram: <a href="https://t.me/LNstores">LNstores</a> (public
              group)
            </p>
          </v-layout>
          <v-layout row>
            <p>
              Development slack: <a href="https://lnstores.slack.com">LNstores</a> (ask us for an invitation)
            </p>
          </v-layout>
          <v-layout row>
            <p>
              Git repository:
              <a
                href="https://github.com/lightningnetworkstores/lightningnetworkstores.github.io"
                >https://github.com/lightningnetworkstores/lightningnetworkstores.github.io</a
              > (nostr branches)
            </p>
          </v-layout>
          <v-layout row>
            <p>
              Our node (using OpenNode):
              <a href='https://1ml.com/node/0259f78fc608eba4d974177493deb68b885c1016ab8fbf69bc87a8edd7e3739894'>0259f78fc608eba4d974177493deb68b885c1016ab8fbf69bc87a8edd7e3739894@178.62.81.192:9735</a>
            </p>
          </v-layout>

          <v-layout row>
            <h2>F.A.Q.</h2>
          </v-layout>
          <v-layout row>
            <h4>I don't understand this website, how do I use it?</h4>
          </v-layout>
          <v-layout row>
            <p>
              Check our quick tutorial here:
              <tutorial-modal></tutorial-modal>
            </p>
          </v-layout>
          <v-layout row>
            <h4>Why do votes disappear/decrease over time?</h4>
          </v-layout>
          <v-layout row>
            <p>
              For about 18 months the votes didn't disappear but the increase in
              bitcoin's price made it harder and harder for new users to make a
              visible impact, making the website look always the same and
              boring. To compensate for this, after
              <a
                href="https://twitter.com/bitcoinLNS/status/1225889074680139777"
                >polling</a
              >
              our users, we decided that the best solution would be to gradually
              decrease the weight of each vote.
            </p>
          </v-layout>
          <v-layout row>
            <h4>How do votes disappear/decrease over time?</h4>
          </v-layout>
          <v-layout row>
            <p>
              Immedialy after being cast, votes are worth the amount of satoshis
              paid. After 270 days (about 9 months), they are worth half of
              their original value, and after another 270 days they are worth
              one fourth of their original value. This very slow exponential
              decrease is updated about every 10 minutes. This rate of
              evaporation is equivalent to losing about 7.4% of their value per
              month or 60% of their value per year.
            </p>
          </v-layout>
          <v-layout row>
            <h4>How to get a store listed?</h4>
          </v-layout>
          <v-layout row>
            <p>
              A store can get instantly added by using the
              <v-btn color="green" dark fab small class="ma-2">
                <v-icon small>mdi-plus</v-icon>
              </v-btn>
              button on the <a href="/">main page.</a><br />
              If you are trustworthy or plan on adding several stores, ask for a
              contributor code so you can add stores without paying the anti-spam listing fee.
            </p>
          </v-layout>
          <v-layout row>
            <p>
              If you have any issue you can send us an email: hi@lightningnetworkstores.com
            </p>
          </v-layout>

          <v-layout row>
            <h4>How to edit or remove a store?</h4>
          </v-layout>
          <v-layout row>
            <p>
              Website owners can updated their information by logging in on the website with a link sent to their company email.
              They can request this link by clicking "Login as owner" from their own page.
              You can suggest for a store to be banned by clicking the <v-icon small>fa-ban</v-icon> icon on the store page.
            </p>
          </v-layout>
          <v-layout row>
            <h4>How are the trending and controversial scores calculated?</h4>
          </v-layout>
          <v-layout row>
            <p>
              Controversial scores are calculated like
              <a
                href="https://www.reddit.com/r/NoStupidQuestions/comments/433ayh/how_does_reddit_determine_what_is_controversial/czfbxk4/"
                >reddit does</a
              >. Trending scores are calculated using the formula:
              (S-EMA)/max(40000000, min(20000,S)), where S is the current score
              of the store in satoshis (upvotes-downvotes) and EMA is the
              exponential moving average of the score. The half-life of the EMA
              is currently set to 4 days. This formula may be tweaked in the
              future.
            </p>
          </v-layout>
          <v-layout row>
            <h4>
              When are stores tweeted in
              <a href="https://twitter.com/bitcoinLNS">@bitcoinLNS?</a>
            </h4>
          </v-layout>
          <v-layout row>
            <p>
              Currently every new store and trending stores (trending score
              &gt;= 10) are tweeted. A store can be tweeted again if: it hasn't
              been tweeted for 8 days, it's score has been increased by at least
              100000 satoshis (1 mBTC) since the last tweet and has a trending
              score no lower than 10. Only payments can trigger tweets, no
              matter how small or the direction. These rules are subject to
              change and might even be held secret if people start abusing them.
            </p>
          </v-layout>
          <v-layout row>
            <h4>
              Why do you have a bitcoin faucet?
            </h4>
          </v-layout>
          <v-layout row>
            <p>
              We think that it's much better to have a faucet than to spend money on advertising. We aim to always give away at least 
              1 satoshi. Most faucets so far have failed or been emptied due to poor abuse prevention measures. Our faucet was designed to distribute 
              bitcoin to many users while blocking robots and users abusive users.
            </p>
          </v-layout>

          <v-layout row>
            <h2>Acknowledgements</h2>
          </v-layout>
          <v-layout row>
            <p>
              A big Thanks for all the people that add new lightning stores as
              they get announced! If you are frequent contributor, ask for a
              coupon code to add stores without paying the small entry fee.
            </p>
          </v-layout>

          <v-layout row>
            <h2>Terms of use and privacy policy</h2>
          </v-layout>
          <v-layout row>
            <p>
             We are quite tolerante with what is acceptable on the website but we reserve the right to remove comments that we consider spam.
           
            </p>
            <p>
                 This site is protected by reCAPTCHA and the Google
                <a href="https://policies.google.com/privacy">Privacy Policy</a> and
                <a href="https://policies.google.com/terms">Terms of Service</a> apply. 
            </p>
            <p>
                This site is protected by hCaptcha and its
                <a href="https://hcaptcha.com/privacy">Privacy Policy</a> and
                <a href="https://hcaptcha.com/terms">Terms of Service</a> apply.
            </p>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import TutorialModal from '../components/TutorialModal.vue'
import Head from '~/mixins/Head'

export default {
  components: { TutorialModal },
  mixins: [Head],
  head() { return this.getMetadata('Nostrich.fun about page',
  'Learn more about the website: goal, contact information, FAQ, Acknowledgements.', '/og/index.jpg')},
  created() {},
}
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
.wrap-text {
  -ms-word-break: break-all;
  word-break: break-all;
  word-break: break-word;
}
</style>
