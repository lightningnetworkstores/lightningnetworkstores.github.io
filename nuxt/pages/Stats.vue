<template>
  <div class="stats">
    <v-row class="justify-center mt-5">
      <v-flex xs12 md12 lg10 xl8>
        <v-container>
         <v-layout justify-center mx-4 row>
            <h2>Lightning Network Stats</h2>
            <iframe src="https://amboss.space/embed/networkStats?theme=light&unit=BTC&noBackground=true" width="100%" height="100px" style="overflow: hidden" scrolling="no" />
          </v-layout>
          <v-layout justify-center mx-4 row>
            <h1>Merchant adoption of the lightning network</h1>
          </v-layout>

          <v-layout row pt-4 wrap>
            <v-flex grow class="text-xs-center" pa-4>
              <v-card>
                <v-card-title primary-title class="justify-center">
                  <div>
                    <h3 class="headline text--accent-2">
                      Number of stores: {{ this.$store.state.statistics.added_times.length }}&nbsp;
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

            <v-layout row pt-4 wrap>
            <v-flex grow class="text-xs-center" pa-4>
              <v-card>
                <v-card-title primary-title class="justify-center">
                  <div>
                    <h3 class="headline text--accent-2">
                      Total faucet claims: {{ claimsChartData[claimsChartData.length-1][1] }}&nbsp;, &nbsp; Total faucet users: {{ this.$store.state.statistics.faucet_users
.length}}
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
          </v-layout>
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
  async asyncData({ store }) {
    await store.dispatch('getStatistics')

    return {
      lightningStoreRatio: 0,

      merchantChartOptions: {
        chart: {
          title: 'Number of merchants',
        },
        height: 500,
        width: '100%',
        colors: ['#3c3d3c'],
        legend: { position: 'bottom'},
        chartArea: {
          left: 45, width: '100%'
        }
      },
      merchantChartData: [['Time', 'Stores']],

      claimsChartOptions: {
        chart: {
          title: 'Number of claims',
        },
        height: 500,
        width: '100%',
        colors: ['#3c3d3c', '#323aa8'],
        legend: { position: 'bottom'},
        chartArea: {
          left: 45, width: '100%'
        }
      },
      claimsChartData: [['Time', 'Claims', 'Users']],
      claims: [],
    }
},
  async mounted() {
    this.getStatsData()
    this.$store.state.statistics.faucet_chart.slice(0).map((d)=>[new Date(d[0]), d[1], d[2]]).forEach((s)=>this.claimsChartData.push(s))
  },

  methods: {
    getStatsData() {
      //chart
      let addedTimes = this.$store.state.statistics.added_times.slice(0)
      addedTimes.sort()

      let count = [...Array(addedTimes.length).keys()].map((x) => x + 1)
      count
        .map((x) => [new Date(addedTimes[x - 1] * 1000), x])
        .forEach((count) => {
          this.merchantChartData.push(count)
        })
    },
  },
  computed: {
    
  },
}
</script>

<style scoped lang="scss"></style>
