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
          <v-divider class="mb-1" />

          <div class="py-2 text-left">
            <span>voted by</span>
            <div class="d-flex flex-wrap align-center storeVotes.votes-voted-container">
              <v-menu
                v-for="n in 8"
                :key="`votes-${n}`"
                top
                open-on-hover
                rounded
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-btn icon x-large v-on="on">
                    <v-avatar size="32" class="storeVotes.votes-votes-avatar">
                      <img :src="votes[n].profile.image" />
                    </v-avatar>
                  </v-btn>
                </template>
                <v-card>
                  <v-list-item-content>
                    <div class="mx-auto text-left px-4">
                      <div class="d-flex align-center">
                        <v-avatar color="brown" size="38">
                          <img :src="votes[n].profile.image" />
                        </v-avatar>
                        <div class="ml-2">
                          <h3 class="mb-1">{{ votes[n].profile.name }}</h3>
                          <p class="text-caption mb-0">
                            {{ votes[n].profile.handle }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </v-list-item-content>
                </v-card>
              </v-menu>

              <v-btn icon x-large v-on="on">
                <v-avatar
                  size="28"
                  class="storeVotes.votes-votes-avatar"
                  color="blue-grey darken-4"
                >
                  <span class="white--text text-caption">+20</span>
                </v-avatar>
              </v-btn>
            </div>

            <v-divider class="mb-2" />
            <span>Bets</span>
            <div class="d-flex flex-wrap storeVotes.votes-voted-container">
              <v-menu
                v-for="n in 8"
                :key="`bet-${n}`"
                top
                open-on-hover
                min-width="140px"
                rounded
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-btn icon x-large v-on="on">
                    <v-avatar size="32" class="storeVotes.votes-votes-avatar">
                      <img :src="bets[n].profile.image" />
                    </v-avatar>
                  </v-btn>
                </template>
                <v-card>
                  <v-list-item-content>
                    <div class="mx-auto text-left px-4">
                      <div class="d-flex align-center">
                        <v-avatar color="brown" size="38">
                          <img :src="bets[n].profile.image" />
                        </v-avatar>
                        <div class="ml-2">
                          <h3 class="mb-1">{{ bets[n].profile.name }}</h3>
                          <p class="text-caption mb-0">
                            {{ bets[n].profile.handle }}
                          </p>
                        </div>
                      </div>
                      <v-chip class="ma-2" color="amber darken-4" text-color="white">
                        <v-avatar left class="amber darken-3">
                          {{ bets[n].wager }}
                        </v-avatar>
                        Sats betted
                      </v-chip>
                    </div>
                  </v-list-item-content>
                </v-card>
              </v-menu>

              <v-btn icon x-large v-if="bets.length > 8">
                <v-avatar
                  size="32"
                  class="storeVotes.votes-votes-avatar"
                  color="blue-grey darken-4"
                >
                  <span class="white--text text-caption">+{{ bets.length - 8 }}</span>
                </v-avatar>
              </v-btn>
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
