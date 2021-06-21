<template>
  <div class="wallets pa-3">
    <v-layout justify-center>
      <v-flex xs12 md12 lg10 xl8>
        <v-container>
					<v-layout row>
						<v-flex pa-3>
							<v-alert
								class="text-center"
								type="success"
							>
								<nuxt-link class="wallets-link" to="/?tags=wallet">Wallets can also be found by tag filtering</nuxt-link>
							</v-alert>
						</v-flex>
					</v-layout>
          <v-layout row>
            <v-flex pa-3>
              <v-alert class="text-center" type="success">
                Wallets can also be found by
                <nuxt-link class="tag-link" to="/?tags=wallet"
                  >filtering via tags</nuxt-link
                >
              </v-alert>
            </v-flex>
          </v-layout>
          <v-layout row>
            <h1>Lightning mobile wallets</h1>
          </v-layout>

          <v-layout row>
            <i
              >Warning: some recent wallets might be scams. Be carefull when
              experimenting with new wallets.</i
            >
          </v-layout>

          <v-layout row pt-3 class="datatable-layout" justify-center>
            <v-data-table
              :headers="headers"
              :items="wallets"
              :options="tableOptions"
              :footer-props="{ 'items-per-page-options': [50, 100, 500] }"
              class="white"
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

              <template v-slot:item.name="{ item }">
                <a v-if="item.name" :href="item.page">{{ item.name }}</a>
              </template>

              <template v-slot:item.open_source="{ item }">
                <a v-if="item.open_source" :href="item.open_source">yes</a>
                <span v-else>no</span>
              </template>
              <template v-slot:item.requires_node="{ item }">
                <span v-if="item.requires_node">{{ item.requires_node }}</span>
                <span v-else>no</span>
              </template>
              <template v-slot:item.custodial="{ item }">
                <span v-if="item.custodial">{{ item.custodial }}</span>
                <span v-else>no</span>
              </template>
              <template v-slot:item.web_wallet="{ item }">
                <a v-if="item.web_wallet" :href="item.web_wallet">yes</a>
                <span v-else>no</span>
              </template>
              <template v-slot:item.mainnet="{ item }">
                <a v-if="item.android" :href="item.android">android</a>
                <a v-else-if="item.android_closed" :href="item.android_closed"
                  >android closed-beta</a
                >&nbsp;
                <a v-if="item.iOS" :href="item.iOS">iOS</a>
                <a v-else-if="item.iOS_closed" :href="item.iOS_closed"
                  >iOS closed-beta</a
                >
              </template>
              <template v-slot:item.testnet="{ item }">
                <a v-if="item.android_testnet" :href="item.android_testnet"
                  >android</a
                >
                <a
                  v-else-if="item.android_testnet_closed"
                  :href="item.android_testnet_closed"
                  >android closed-beta</a
                >
                &nbsp;<a v-if="item.iOS_testnet" :href="item.iOS_testnet"
                  >iOS</a
                >
                <a
                  v-else-if="item.iOS_testnet_closed"
                  :href="item.iOS_testnet_closed"
                  >iOS closed-beta</a
                >
              </template>
            </v-data-table>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
export default {
    
  head(){return {
      title:'Lightning Network wallets',
      meta: [{
          hid: 'description',
          name: 'description',
          content: 'List of wallets that support the bitcoin Lightning Network',
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Lightning Network wallets',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'List of wallets that support the bitcoin Lightning Network',
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: 'Lightning Network wallets',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: 'List of wallets that support the bitcoin Lightning Network',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: '/ogimage.png',
        },
         {
        hid: 'twitter:image:src',
        property: 'twitter:image:src',
        content: '/ogimage.png',
      }]
  };},
  data() {
    return {
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: true,
          value: 'name',
        },
        { text: 'Open source', value: 'open_source', align: 'center' },
        { text: 'Requires own node', value: 'requires_node', align: 'center' },
        { text: 'Custodial', value: 'custodial', align: 'center' },
        { text: 'Mainnet launch date', value: 'release', align: 'right' },
        { text: 'Web wallet', value: 'web_wallet', align: 'center' },
        { text: 'Mainnet', value: 'mainnet', align: 'right' },
        { text: 'Testnet', value: 'testnet', align: 'right' },
      ],
      tableOptions: {
        itemsPerPage: 50,
      },
    }
  },

  computed: {
    wallets() {
      return this.$store.state.wallets
    },
  },
  created() {
    this.$store.dispatch('getWallets')
  },
}
</script>

<style scoped lang="scss">
.wallets-link {
	color: white;
}
</style>
