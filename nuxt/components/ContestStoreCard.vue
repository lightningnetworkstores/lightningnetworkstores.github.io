<template>
  <div>
    <v-card :disabled="disabled" hover class="d-flex flex-column justify-space-between">
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

          <div class="pa-2 pl-5">
            <div @click="gotoStore(store)">
              <div class="mb-2">
                <a :href="getStoreLink(store.href)" class="font-weight-regular text-h5">
                  {{ store.name }}
                  <v-icon class="ml-1" color="blue darken-2">mdi-open-in-new</v-icon>
                </a>
              </div>
              <div class="description">{{ store.description }}</div>
            </div>
            <div>
              <div class="tag-container">
                <v-chip
                  v-if="store.tags[0]"
                  color="primary"
                  outlined
                  small
                  class="mr-2 my-1"
                >
                  <b @click="updateTagSearch(store.tags[0], 0)" class="tag-link">{{
                    store.tags[0]
                  }}</b>
                </v-chip>
                <v-menu open-on-click top offset-y v-if="store.tags.length > 1">
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      v-bind="attrs"
                      v-on="on"
                      color="primary"
                      outlined
                      small
                      class="mr-2 my-1"
                    >
                      <b
                        >+{{ store.tags.length - 1 }} tag{{
                          store.tags.length - 1 == 1 ? "" : "s"
                        }}</b
                      >
                    </v-chip>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="(tag, index) in store.tags.slice(1, 5)"
                      :key="index"
                      class="my-0 tags-container"
                    >
                      <v-chip color="primary" outlined small class="mr-2 my-0">
                        <b @click="updateTagSearch(tag, index)" class="tag-link">{{
                          tag
                        }}</b>
                      </v-chip>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions
        ><v-btn color="blue-grey" class="ma-2 white--text" @click="choseStore()">
          <v-icon left dark> mdi-star </v-icon>
          chose
        </v-btn>

        <v-btn text color="orange darken-1" class="ma-2 white--text" @click="placeBet()">
          <v-icon left dark> mdi-crown-circle </v-icon>
          Place a bet
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import VoteButton from "../components/VoteButton.vue";
import LikeStoreButton from "./LikeStoreButton.vue";

export default {
  props: ["store", "disabled"],
  components: { VoteButton, LikeStoreButton },
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
      const { id, rooturl } = store;

      this.$route.meta.storeId = id;
      this.$router.push("/store/" + rooturl);
    },
    choseStore() {
      /**TODO*/
    },
    placeBet() {
      /**TODO*/
    },
  },
};
</script>

<style scoped>
.description {
  height: 60px;
  max-height: 60px;
  line-clamp: 3;
  overflow: hidden;
}

.tag-container {
  min-height: 30px;
}
</style>
