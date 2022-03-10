<template>
  <v-card hover class="d-flex flex-column justify-space-between quizCard">
    <v-card-title>{{ option }}</v-card-title>
    <v-divider class="mb-1" />

    <v-card-text class="px-4 py-2 text-left">
      <span>voted by</span>
      <div class="d-flex flex-wrap align-center user-voted-container">
        <v-menu v-for="n in 10" :key="n" top open-on-hover rounded offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon x-large v-on="on">
              <v-avatar size="32" class="user-vote-avatar">
                <img :src="sampleUser.image" />
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content>
              <div class="mx-auto text-left px-4">
                <div class="d-flex align-center">
                  <v-avatar color="brown" size="38">
                    <img :src="sampleUser.image" />
                  </v-avatar>
                  <div class="ml-2">
                    <h3 class="mb-1">{{ sampleUser.name }}</h3>
                    <p class="text-caption mb-0">
                      {{ sampleUser.handle }}
                    </p>
                  </div>
                </div>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>

        <v-btn icon x-large v-on="on">
          <v-avatar size="28" class="user-vote-avatar" color="blue-grey darken-4">
            <span class="white--text text-caption">+20</span>
          </v-avatar>
        </v-btn>
      </div>

      <v-divider class="mb-2" />
      <span>Bets</span>
      <div class="d-flex flex-wrap user-voted-container">
        <v-menu
          v-for="n in 10"
          :key="n"
          top
          open-on-hover
          min-width="140px"
          rounded
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn icon x-large v-on="on">
              <v-avatar size="32" class="user-vote-avatar">
                <img :src="sampleUser.image" />
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content>
              <div class="mx-auto text-left px-4">
                <div class="d-flex align-center">
                  <v-avatar color="brown" size="38">
                    <img :src="sampleUser.image" />
                  </v-avatar>
                  <div class="ml-2">
                    <h3 class="mb-1">{{ sampleUser.name }}</h3>
                    <p class="text-caption mb-0">
                      {{ sampleUser.handle }}
                    </p>
                  </div>
                </div>
                <v-chip class="ma-2" color="amber darken-4" text-color="white">
                  <v-avatar left class="amber darken-3"> 20 </v-avatar>
                  Sats betted
                </v-chip>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>

        <v-btn icon x-large v-on="on">
          <v-avatar size="32" class="user-vote-avatar" color="blue-grey darken-4">
            <span class="white--text text-caption">+20</span>
          </v-avatar>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      sampleUser: {
        image: "https://www.tbstat.com/wp/uploads/2021/10/CryptoPunk-6046.png",
        name: "Kevin Aguilar ⚛",
        handle: "aguilarkevin",
      },
    };
  },
  props: {
    option: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      required: true,
    },
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
  row-gap: 4px;
  width: 100%;
}

.user-voted-container > * {
  margin-inline: -12px;
}

.user-vote-avatar {
  border: 2px solid white;
}

.quizCard {
  width: 100%;
}
</style>
