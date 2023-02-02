<template>
  <div class="pa-8">
    <v-container>
      <h1 style='text-align:center'>Contributor leaderboard</h1>
      <br />
      <v-data-table
        :headers="headers"
        :items="contributions"
        :custom-sort="customSort"
      >
        <template v-slot:[`item.user`]="{ item }">
          <UserTransferWidget :user="item.user" />
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import Head from '~/mixins/Head'

export default {
  data() {
    return {
      headers: [
        { text: 'User', value: 'user' },
        { text: 'Listings', value: 'listings' },
        { text: 'Delistings', value: 'delistings' },
        { text: 'Tagging', value: 'tagging' },
        { text: 'Edits', value: 'edits' },
        { text: 'Builders', value: 'builders' },
        { text: 'Images', value: 'images' },
        { text: 'Sats stacked', value: 'paid' },
      ],
    }
  },
  mixins: [Head],
  head(){
    return this.getMetadata('LNS Contributors', 'The top contributors to LightningNetworkStores.com', '/ogimage.png')
  },
  computed: {
    contributions() {
      const dataContributions =
        this.$store.state.contributions?.top_contributors ?? []

      return dataContributions.map((top) => ({
        user: {
          name: top.name,
          image: top.image,
          handle: top.handle,
          is_default: top.is_default,
        },
        ...top.contributions,
      }))
    },
  },
  methods: {
    customSort(items) {
      let sortting = this.compareSort()
      return items.sort((a, b) => sortting(b) - sortting(a))
    },
    compareSort() {
      return (a) => a.tagging + a.listings + a.delistings + a.builders + a.edits + a.images
    },
  },
  created() {
    this.$store.dispatch('getContributions')
  },
}
</script>

<style></style>
