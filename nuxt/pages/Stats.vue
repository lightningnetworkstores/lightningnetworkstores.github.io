<template>
  <div class="stats">
    <v-row class="justify-center mt-5">
      <v-flex xs12 md12 lg10 xl8>
        <v-container>
          <v-layout row>
            <h1>Merchant adoption of the lightning network</h1>
          </v-layout>

          <v-layout row pt-4 wrap>
            <v-flex grow class="text-xs-center" pa-4>
              <v-card>
                <v-card-title primary-title class="justify-center">
                  <div>
                    <h3 class="headline text--accent-2">
                      Number of stores: {{ trendingStores.length }}&nbsp;
                    </h3>
                  </div>
                </v-card-title>
                <v-card-text>
                  <GChart
                    type="LineChart"
                    :data="merchantChartData"
                    :options="merchantChartOptions"
                    v-if="merchantChartData.length > 1"
                  />
                  <v-overlay v-else>
                    <v-progress-circular
                      indeterminate
                      size="64"
                      color="#fdb919"
                    ></v-progress-circular>
                  </v-overlay>
                </v-card-text> </v-card
            ></v-flex>
          </v-layout>

          <v-layout row wrap pt-3>
            <v-flex xs12 sm6 class="text-center" pa-4>
              <v-card>
                <v-card-title primary-title class="justify-center">
                  <div>
                    <h3 class="headline text--accent-2">
                      <a href="/?sort=trending">Trending stores</a>
                    </h3>
                  </div>
                </v-card-title>
                <v-list
                  v-for="(store, index) in trendingStores"
                  v-show="index < 4"
                  :key="store.id"
                >
                  <a :href="store.href">{{ store.name }}</a>
                </v-list>
              </v-card>
            </v-flex>

            <v-flex xs12 sm6 class="text-center" pa-4>
              <v-card>
                <v-card-title primary-title class="justify-center">
                  <div>
                    <h3 class="headline text--accent-2">
                      <a href="/?sort=newest">Newest stores</a>
                    </h3>
                  </div>
                </v-card-title>
                <v-list
                  v-for="(store, index) in newestStores"
                  v-show="index < 4"
                  :key="store.id"
                >
                  <a :href="store.href">{{ store.name }}</a>
                </v-list>
              </v-card>
            </v-flex>

            <!-- <v-layout row pt-4 wrap>
            <v-flex grow class="text-xs-center" pa-4>
              <v-card>
                <v-card-title primary-title class="justify-center">
                  <div>
                    <h3 class="headline text--accent-2">
                      Number of faucet claims: {{ claimsChartData.length-1 }}&nbsp;
                    </h3>
                  </div>
                </v-card-title>
                <v-card-text>
                  <GChart
                    type="LineChart"
                    :data="claimsChartData"
                    :options="claimsChartOptions"
                    v-if="claimsChartData.length > 1"
                  />
                  <v-overlay v-else>
                    <v-progress-circular
                      indeterminate
                      size="64"
                      color="#fdb919"
                    ></v-progress-circular>
                  </v-overlay>
                </v-card-text> </v-card
            ></v-flex>
          </v-layout> -->


          </v-layout>
        </v-container>
      </v-flex>
    </v-row>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'

export default {
  components: { GChart },
  head: {
    title: 'Lightning Network Merchant Adoption Statistics',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content:
          'Check the adoption of lightning payments by merchants as well as the latest and trending merchants.',
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Lightning Network Merchant Adoption Statistics',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'Check the adoption of lightning payments by merchants as well as the latest and trending merchants.',
      },
      {
        hid: 'twitter:title',
        property: 'twitter:title',
        content: 'Lightning Network Merchant Adoption Statistics',
      },
      {
        hid: 'twitter:description',
        property: 'twitter:description',
        content:
          'Check the adoption of lightning payments by merchants as well as the latest and trending merchants.',
      },
    ],
  },
  data() {
    return {
      lightningStoreRatio: 0,

      trendingStores: [],
      newestStores: [],

      merchantChartOptions: {
        chart: {
          title: 'Number of merchants',
        },
        height: 500,
        colors: ['#3c3d3c'],
      },
      merchantChartData: [['Time', 'Stores']],

      claimsChartOptions: {
        chart: {
          title: 'Number of claims',
        },
        height: 500,
        colors: ['#3c3d3c', '#323aa8'],
      },
      claimsChartData: [['Time', 'Claims', 'Users']],
      claims: []
    }
  },

  async mounted() {
    await this.$store.dispatch('getStores')
    let faucetStats = await this.$store.dispatch('getFaucetStats');
    //claims = faucetStats.claims

    let stores = this.$store.state.stores

    this.trendingStores = stores.slice(0).sort((a, b) => {
      return b.trending - a.trending;
    })

    this.newestStores = stores
      .slice(0)
      .sort((a, b) => {
        return a.added - b.added
      })
      .reverse()

    this.getStatsData()
    this.getFaucetStatsData()
  },

  methods: {
    getStatsData() {
      //chart
      let addedTimes = []
      this.getStores.forEach((store) => {
        if (store.added == null) {
          addedTimes.push(1519419592)
        } else if (!isNaN(store.added)) {
          addedTimes.push(store.added)
        }
      })

      addedTimes.sort()

      let count = [...Array(addedTimes.length).keys()].map((x) => x + 1)
      count
        .map((x) => [new Date(addedTimes[x - 1] * 1000), x])
        .forEach((count) => {
          this.merchantChartData.push(count)
        })
    },
    getFaucetStatsData(){
        let claims = this.$store.state.faucetStats.claims;
        let users = this.$store.state.faucetStats.users;
        
        let count = [...Array(claims.length).keys()].map((x) => x + 1)
        
        count.map((x) => [new Date(claims[x - 1] * 10000000), x, users.filter((t)=>t<=claims[x-1]).length])
        .forEach((i) => this.claimsChartData.push(i))
    }
  },
  computed: {
    getStores() {
      return this.$store.getters.getStores({ sector: null, digitalGoods: null })
    },
  },
}
</script>

<style scoped lang="scss"></style>
