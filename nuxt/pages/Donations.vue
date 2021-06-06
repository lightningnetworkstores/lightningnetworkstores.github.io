<template>
  <div class="donations">
    <v-layout justify-center>
      <v-flex xs12 md12 lg10 xl8 class="pa-6">
        <v-container>
          <v-layout row>
            <h1>Lightning donations</h1>
          </v-layout>

          <v-layout row>
            To our knowledge, there isn't any list of on-chain donation
            addresses, so on-chain addresses are also included.
          </v-layout>

          <v-layout row pt-3 justify-center class="datatable-layout">
            <v-data-table
              :headers="headers"
              :items="donations"
              :footer-props="{ 'items-per-page-options': [50, 100, 500] }"
              :options.sync="pagination"
              style="width: 100%"
              sort-by
              :mobile-breakpoint="0"
            >
              <template slot="headerCell" slot-scope="props">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">
                      {{ props.header.text }}
                    </span>
                  </template>
                  <span>
                    {{ props.header.text }}
                  </span>
                </v-tooltip>
              </template>

              <template v-slot:item.entity="{ item }">
                <a>{{ item.entity }}</a>
              </template>
              <template v-slot:item.contributions="{ item }">
                <div v-html="item.contributions"></div>
                <!-- <a :href="'item.entity'">{{ item.entity }}</a> -->
              </template>
              <template v-slot:item.lightning="{ item }">
                <a v-if="item.lightning" :href="item.lightning">link</a>
              </template>
              <template v-slot:item.address="{ item }">
                <template v-if="item.address">
                  <a
                    :href="'https://blockstream.info/address/' + item.address"
                    >{{ item.address }}</a
                  >
                  <a :href="item.address_proof">(proof)</a></template
                >
              </template>
              <template v-slot:item.reddit="{ item }">
                <a :href="'https://reddit.com/u/' + item.reddit">{{
                  item.reddit
                }}</a>
              </template>
              <template v-slot:item.twitter="{ item }">
                <a :href="'https://twitter.com/' + item.twitter">{{
                  item.twitter
                }}</a>
              </template>
              <!-- <template v-slot:items="props">
                <td>
                  <a :href="props.item.link">{{ props.item.entity }}</a>
                </td>
                <td class="text-xs-left">
                  <span v-html="props.item.contributions"></span>
                </td>
                <td class="text-xs-center">
                  <a v-if="props.item.lightning" :href="props.item.lightning"
                    >link</a
                  ><span v-else>-</span>
                </td>
                <td>
                  <a
                    v-if="props.item.address"
                    :href="
                      'https://blockstream.info/address/' + props.item.address
                    "
                  >
                    {{ props.item.address }} (<a
                      :href="props.item.address_proof"
                      >proof</a
                    >)</a
                  ><span v-else>-</span>
                </td>
                <td>
                  <a
                    v-if="props.item.reddit"
                    :href="'https://reddit.com/u/' + props.item.reddit"
                    >{{ props.item.reddit }}</a
                  ><span v-else>-</span>
                </td>
                <td>
                  <a
                    v-if="props.item.twitter"
                    :href="'https://twitter.com/' + props.item.twitter"
                    >{{ props.item.twitter }}</a
                  ><span v-else>-</span>
                </td>
              </template> -->
            </v-data-table>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Bitcoin/Lightning donation addresses',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content:
          'List of people/entities that accept bitcoin/lightning donations.',
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Bitcoin/Lightning donation addresses',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'List of people/entities that accept bitcoin/lightning donations.',
      },
      {
        hid: 'twitter:title',
        property: 'twitter:title',
        content: 'Bitcoin/Lightning donation addresses',
      },
      {
        hid: 'twitter:description',
        property: 'twitter:description',
        content:
          'List of people/entities that accept bitcoin/lightning donations.',
      },
    ],
  },
  data() {
    return {
      pagination: {
        rowsPerPage: 50,
      },

      headers: [
        {
          text: 'Entity',
          align: 'left',
          sortable: true,
          value: 'entity',
        },
        { text: 'Description', value: 'contributions' },
        { text: 'Lightning', value: 'lightning' },
        { text: 'Bitcoin address', value: 'address' },
        { text: 'Reddit', value: 'reddit' },
        { text: 'Twitter', value: 'twitter' },
      ],

      donations: [],
    }
  },

  created() {
    this.$store.dispatch('getDonations').then(
      (response) => {
        this.donations = response
      },
      (error) => {
        console.error(error)
      }
    )
  },
}
</script>

<style>
</style>
