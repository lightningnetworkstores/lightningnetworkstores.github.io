<template>
  <div class="wallets pa-3">
    <v-layout justify-center>
      <v-flex xs12 md12 lg10 xl8>
        <v-container>
					<v-layout row>
						<v-flex pa-3>
						</v-flex>
					</v-layout>
          <v-layout row>
            <h1>Trending projects based on social activity</h1>
          </v-layout>
          <v-layout row>
            <i>Data is normalized for the period of one month. </i
            >
          </v-layout>
          <v-layout row pt-3 class="datatable-layout" justify-center>
            <v-data-table
              :headers="headers"
              :items="externallyTrending"
              :options="tableOptions"
              :footer-props="{ 'items-per-page-options': [50, 100, 500] }"
              class="white"
            >

              <template v-slot:item.name="{ item }">
                <span v-if="item.store"><a :href="'/store/' + item.store.rooturl">{{ item.store.name }}</a></span>
              </template>

              <template v-slot:item.site_rank="{ item }">
                <span v-if="item.popularity.SITE_RANK">{{ Math.round(100*item.popularity.SITE_RANK.change_relative) }}% (+{{ item.popularity.SITE_RANK.change_absolute.toLocaleString() }})</span>
              </template>
              
              <!-- <template v-slot:item.site_rank_rel="{ item }">
                <span v-if="item.popularity.SITE_RANK">{{ Math.round(item.popularity.SITE_RANK.change_relative) }}</span>
              </template> -->

              <template v-slot:item.twitter="{ item }">
                <span v-if="item.popularity.TWITTER">{{ Math.round(item.popularity.TWITTER.change_relative*1000)/10 }}% (+{{ item.popularity.TWITTER.change_absolute }})</span>
              </template>

              <!-- <template v-slot:item.twitter_rel="{ item }">
              <span v-if="item.popularity.TWITTER">{{ Math.round(item.popularity.TWITTER.change_relative*1000)/10 }}%</span>
             </template> -->

            </v-data-table>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Head from '~/mixins/Head'
export default {
  mixins: [Head],
  head() {
    return this.getMetadata(
      'Trending lightning projects',
      'Trending lightning network projects based on social activity.',
      '/ogimage.png'
    )
  },
  data() {
    return {
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: true,
          value: 'name',
        },
        { text: 'Site visits', value: 'site_rank', align: 'center' },
        { text: 'Twitter (WoW)', value: 'twitter', align: 'center' },
      ],
      tableOptions: {
        itemsPerPage: 50,
      },
    }
  },

  computed: {
    externallyTrending() {
      return this.$store.state.externallyTrending
    },
  },
  created() {
    this.$store.dispatch('getTrendingExternally')
  },
}
</script>

<style scoped lang="scss">
.wallets-link {
	color: white;
}
</style>
