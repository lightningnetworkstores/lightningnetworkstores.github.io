<template>
  <v-card class="d-flex flex-column justify-space-between">
    <v-card-text class="pa-0">
      <div class="detail">
        <div>
          <v-img
            :aspect-ratio="4 / 3"
            max-height="200px"
            :src="`${baseURL}thumbnails/${store.id}.jpg`"
            class="text-right"
            @click.native="gotoStore(store)"
          />
        </div>
        <div class="px-5 py-2">
          <div @click="gotoStore(store)">
            <div class="mb-2 title">
              <a :href="getStoreLink(store.href)" class="font-weight-regular text-h5">
                {{ store.name }}
                <v-icon class="ml-1" color="blue darken-2">mdi-open-in-new</v-icon>
              </a>
            </div>
            <div class="description">{{ store.description }}</div>
          </div>
          <v-divider class="mb-1" />
          <div class="px-5 py-2">
            <div class="py-0 text-left" style="min-height: 73px">
              <span class="text-caption text--secondary">Voted by</span>
              <vote-summary :votes="votes"/>
            </div>
          </div>
          <v-divider class="mb-0" />
          <div class="px-5 py-2">
            <div class="py-0 text-left" style="min-height: 73px">
              <span class="text-caption text--secondary">Bets</span>
              <bet-summary :bets="bets"/>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["store", "votes", "bets"],
  computed: {
    ...mapState(['baseURL']),
  },
  methods: {
    getStoreLink(link) {
      const url = new URL(link);
      const baseUrl = new URL(this.baseURL);
      url.searchParams.append("utm_source", baseUrl.host);
      return url.toString();
    },
    gotoStore(store) {
      const { id, rootUrl } = store;

      this.$route.meta.storeId = id;
      this.$router.push("/store/" + rootUrl);
    },
  },
};
</script>

<style>
.storeVotes.votes-voted-container {
  display: flex;
  width: 100%;
}

.storeVotes.votes-voted-container > * {
  margin-right: -18px;
}

.storeVotes.votes-votes-avatar {
  border: 2px solid white;
}
</style>
