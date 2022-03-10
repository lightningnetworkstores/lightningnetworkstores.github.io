<template>
  <v-card hover class="d-flex flex-column justify-space-between">
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
          <v-divider class="my-4" />

          <div class="d-flex flex-wrap user-voted-container">
            <v-menu
              v-for="n in 5"
              :key="n"
              bottom
              open-on-hover
              min-width="140px"
              rounded
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-btn icon x-large v-on="on">
                  <v-avatar size="40" class="user-vote-avatar">
                    <img :src="sampleUser.image" />
                  </v-avatar>
                </v-btn>
              </template>
              <v-card>
                <v-list-item-content>
                  <div class="mx-auto text-left px-4">
                    <v-avatar color="brown">
                      <img :src="sampleUser.image" />
                    </v-avatar>
                    <h3 class="mt-1">{{ sampleUser.name }}</h3>
                    <p class="text-caption mt-1">
                      {{ sampleUser.handle }}
                    </p>
                  </div>
                </v-list-item-content>
              </v-card>
            </v-menu>
            <v-btn icon x-large v-on="on">
              <v-avatar size="40" class="user-vote-avatar" color="blue-grey darken-4">
                <span class="white--text">+20</span>
              </v-avatar>
            </v-btn>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      store: {
        trending: 0,
        total_comments: 0,
        upvotes: 225,
        added: 1519419592,
        scores: {},
        lifetime: 5000,
        description: "UK bitcoin exchange.",
        likely_tags: [],
        downvotes: 5,
        uri:
          "032271efcb35188ef00e3f28469a2bb18b50a5f2f325bd130bdac341af24e9b5f0@37.221.209.222:9735",
        rooturl: "bitbargain.co.uk",
        tags: ["exchange"],
        digital_goods: "yes",
        score: 220,
        sorting: 220,
        name: "Bitbargain",
        rank: 165,
        id: 5,
        href: "https://bitbargain.co.uk/",
        last_commented: 0,
        sector: "exchange",
        likes: 0,
      },
      sampleUser: {
        image:
          "https://pbs.twimg.com/profile_images/1480757562354159617/btO-pmbJ_normal.jpg",
        name: "Kevin Aguilar ⚛",
        handle: "_aguilarkevin_",
      },
    };
  },
  computed: {
    ...mapState({
      baseURL(state) {
        return state.baseURL;
      },
    }),
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
.user-voted-container {
  display: flex;
  width: 100%;
}

.user-voted-container > * {
  margin-right: -18px;
}

.user-vote-avatar {
  border: 2px solid white;
}
</style>
