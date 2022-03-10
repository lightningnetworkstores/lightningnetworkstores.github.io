<template>
  <v-card hover class="d-flex flex-column justify-space-between quizCard">
    <v-card-title>{{ option }}</v-card-title>
    <v-divider class="mb-1" />
    <v-card-text class="px-2 py-1">
      <div class="d-flex flex-wrap user-voted-container">
        <v-menu
          v-for="n in 5"
          :key="n"
          top
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
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      sampleUser: {
        image:
          "https://pbs.twimg.com/profile_images/1480757562354159617/btO-pmbJ_normal.jpg",
        name: "Kevin Aguilar ⚛",
        handle: "_aguilarkevin_",
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
  margin-right: -18px;
}

.user-vote-avatar {
  border: 2px solid white;
}

.quizCard {
  width: 100%;
}
</style>
