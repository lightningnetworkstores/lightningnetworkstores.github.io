<template>
  <v-card hover>
    <v-card-text class="pa-0">
      <div class="detail">
        <div class="screenshot">
          <v-img
            :aspect-ratio="4 / 3"
            max-height="200px"
            :src="`${baseURL}thumbnails/${store.id}.jpg`"
            class="text-right"
            @click.native="gotoStore(store.id)"
          >
            <v-chip
              v-if="isNewStore(store)"
              color="green"
              text-color="white"
              class="ma-2"
              >New</v-chip
            >
            <v-chip
              v-if="store.trending >= 10"
              color="purple"
              text-color="white"
              class="ma-2"
              >Trending</v-chip
            >
            <v-chip
              v-if="hasNewComment(store)"
              color="blue"
              text-color="white"
              class="ma-2"
              >New comment</v-chip
            >
          </v-img>
        </div>
        <div class="score">
          <vote-button :isUpvoting="true" :store="store" />
          <span> {{ store.upvotes | splitNumber }}</span>
          <vote-button :isUpvoting="false" :store="store" />
        </div>
        <div class="content pa-2 pl-5" @click="gotoStore(store.id)">
          <div class="title">
            <a :href="store.href" class="font-weight-regular">
              {{ store.name }}
              <v-icon class="ml-1" color="blue darken-2"
                >mdi-open-in-new</v-icon
              >
            </a>
          </div>
          <div class="description">{{ store.description }}</div>
          <div>
            <div class="tag-container">
              <v-chip
                v-if="store.tags[0]"
                color="primary"
                outlined
                small
                class="mr-2 my-1"
              >
                <b>{{ store.tags[0] }}</b>
              </v-chip>
              <v-menu open-on-hover top offset-y v-if="store.tags.length > 1">
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
                        store.tags.length - 1 == 1 ? '' : 's'
                      }}</b
                    >
                  </v-chip>
                </template>

                <v-list>
                  <v-list-item
                    v-for="(tag, index) in store.tags.slice(1, 5)"
                    :key="index"
                    class="my-0"
                  >
                    <v-chip color="primary" outlined small class="mr-2 my-0">
                      <b>{{ tag }}</b>
                    </v-chip>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="btn-actions">
              <div class="comments" v-if="store.total_comments">
                <v-icon small>fa-comment</v-icon> {{ store.total_comments }}
              </div>
              <div class="likes" @click.stop="handleLike(store.id)">
                <v-icon small :color="storeIsLiked ? `red` : `gray`"
                  >fa-heart</v-icon
                >
                {{ store.likes }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import VoteButton from '../components/VoteButton.vue'
export default {
  props: ['store'],
  components: { VoteButton },
  data() {
    return {
      likedStores: JSON.parse(localStorage.getItem(`lns_likes`)) ?? [],
    }
  },

  methods: {
    gotoStore(store_id) {
      this.$router.push('/store/' + store_id)
    },
    isNewStore(store) {
      return new Date(store.added * 1000 + 1000 * 60 * 60 * 24 * 8) > new Date()
    },
    hasNewComment(store) {
      return (
        new Date(store.last_commented + 1000 * 60 * 60 * 24 * 8) > new Date()
      )
    },
    handleLike(storeId) {
      const isLiked = this.likedStores.some((id) => id === storeId)
      console.log(`Like Request... ${isLiked}`)
      if (isLiked) {
        this.$store.dispatch(`likeStore`, { storeId, remove: true })
        this.likedStores.pop(storeId)
      } else {
        this.$store.dispatch(`likeStore`, { storeId, remove: false })
        this.likedStores.push(storeId)
      }
    },
  },
  computed: {
    baseURL() {
      return this.$store.state.baseURL
    },
    storeIsLiked() {
      if (this.likedStores) {
        return this.likedStores.some((id) => id === this.store.id)
      }

      return false
    },
  },
}
</script>
