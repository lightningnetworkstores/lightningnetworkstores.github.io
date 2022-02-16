<template>
  <v-card>
    <v-card-title>
      Affiliate Program
    </v-card-title>
    <v-card-text v-if="affiliate">
      You will currently earn {{ affiliate.reward_per_referral }} for every unique user you
      refer to our website. Your affiliate code is
      <strong>{{affiliate.affiliate_code}}</strong>, and you can use it in any page, eg.
    </v-card-text>
    <v-card-text v-if="affiliate">
      <ul>
        <li><a :href="affiliate.affiliate_link_example">{{affiliate.affiliate_link_example}}</a></li>
        <li><a :href="affiliate.affiliate_link_example">{{affiliate.affiliate_link_example2}}</a></li>
      </ul>
    </v-card-text>
    <v-card-text v-if="affiliate">
      <p class="my-0">Pending Payout: {{affiliate.pending}}</p>
      <p class="my-0">Minimum payout (sats): {{affiliate.payout_every}}</p>
      <p class="my-0">Total Paid: {{affiliate.paid}}</p>
    </v-card-text>
    <v-card-text>
      <p class="my-0">Traffic quality: {{affiliate.quality_score}}%</p>
      <p class="my-0">Repeat Rate: {{affiliate.repeat_rate}}%</p>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('wallet', ['affiliate'])
  }
}
</script>