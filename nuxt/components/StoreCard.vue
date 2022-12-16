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
            @click.native="gotoStore(store)"
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
            <v-chip
              v-if="store.event"
              color="blue"
              text-color="white"
              class="ma-2"
              >Event</v-chip
            >
          </v-img>
        </div>
        <div class="score">
          <vote-button :isUpvoting="true" :store="store" />
          <span>
            {{ Number(store.upvotes - store.downvotes).toLocaleString() }}</span
          >
          <vote-button :isUpvoting="false" :store="store" />
        </div>
        <div class="content pa-2 pl-5">
          <div @click="gotoStore(store)">
            <div class="title">
              <a @click.stop :href="getStoreLink(store.href)" class="font-weight-regular asdad">
                {{ store.name }}
                <v-icon class="ml-1" color="blue darken-2"
                  >mdi-open-in-new</v-icon
                >
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
                <b
                  @click="updateTagSearch(store.tags[0], 0)"
                  class="tag-link"
                  >{{ store.tags[0] }}</b
                >
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
                      <b
                        @click="updateTagSearch(tag, index)"
                        class="tag-link"
                        >{{ tag }}</b
                      >
                    </v-chip>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div
              :class="{
                'btn-actions': true,
                'sm-btn-actions': $vuetify.breakpoint.mobile,
              }"
            >
              <like-store-button :store="store" />
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import VoteButton from '../components/VoteButton.vue'
import LikeStoreButton from './LikeStoreButton.vue'

export default {
  props: ['store', 'changeUrl', 'setFromRoute'],
  components: { VoteButton, LikeStoreButton },
  computed: {
    ...mapState({
      baseURL(state) {
        return state.baseURL
      },
    }),
  },
  methods: {
    getStoreLink(link) {
      const url = new URL(link)
      const baseUrl = new URL(this.baseURL)
      url.searchParams.append('utm_source', baseUrl.host)

      return url.href
    },
    gotoStore(store) {
      const { id, rooturl } = store

      this.$route.meta.storeId = id
      this.$router.push('/store/' + rooturl)
    },
    updateTagSearch(tag) {
      this.$store.dispatch('selectOneTag', tag)
    },
    isNewStore(store) {
      return new Date(store.added * 1000 + 1000 * 60 * 60 * 24 * 8) > new Date()
    },
    hasNewComment(store) {
      return (
        new Date(store.last_commented + 1000 * 60 * 60 * 24 * 8) > new Date()
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.detail {
  color: #000000de;
  display: grid;
  grid-template-rows: 200px 150px;
  grid-template-columns: 80px 1fr;
  row-gap: 4px;

  .screenshot {
    grid-column: 1 / 3;
  }
  .score {
    display: grid;
    grid: 1fr;
    justify-items: center;
    padding: 5px;
    font-size: 15px !important;

    span {
      display: block;
    }
    .arrow {
      border: 1px solid;
      border-radius: 50%;
      padding: 5px;

      &.up:hover {
        background-color: rgba(76, 175, 80, 0.12);
      }
      &.down:hover {
        background-color: rgba(255, 82, 82, 0.12);
      }
    }
  }
  .content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    .title {
      font-size: 1.7rem !important;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      a {
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
    .description {
      font-size: 14px !important;
      margin-top: 5px;
    }
    .tag-container {
      position: absolute;
      bottom: 8px;
      padding-right: 40px;
      background-color: white;
    }
    .btn-actions {
      display: flex;
      gap: 8px;
      position: absolute;
      bottom: 5px;
      right: 5px;
      margin: 0.5em;
      font-size: 14px !important;
      .likes .v-icon:hover {
        color: #f44336;
      }
      &.sm-btn-actions {
        font-size: 24px !important;
        .v-icon {
          font-size: 24px !important;
        }
      }
    }
  }
}
</style>
