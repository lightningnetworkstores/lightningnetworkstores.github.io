<template>
  <v-card hover>
    <v-card-text class="pa-0">
      <div class="detail">
        <div class="screenshot">
          <v-img
            :aspect-ratio="4 / 3"
            :src="`${baseURL}thumbnails/${store.id}.jpg`"
            class="v-img text-right"
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
            <div class="top_wrapper">
              <div class="score">
                <vote-button :isUpvoting="true" :store="store" />
                <span style="
                color: white;
                mix-blend-mode: difference;
            ">
                  {{ formatNumberVotes(Number(store.upvotes - store.downvotes)) }}</span>
                <!-- <vote-button :isUpvoting="false" :store="store" /> -->
            
              </div>
              <like-store-button style="padding:10px;" :store="store" />
            </div>
          </v-img>
        </div>

        <div class="detail-bottom">
          <div @click="gotoStore(store)">
            <div class="title">
              <a :href="getStoreLink(store.href)" class="font-weight-regular">
                {{ store.name }}
              </a>
            </div>
            <div class="description">{{ store.description }}</div>
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
    formatNumberVotes() {
      return (value) => {
        if (Math.abs(value) > 999999) {
          return (Math.sign(value)*((Math.abs(value)/1000000).toFixed(1)) + 'M')
        
        } else if((Math.abs(value) > 999)) {
          return (Math.sign(value)*((Math.abs(value)/1000).toFixed(1)) + 'K')
        
        } else {
          return Math.sign(value)*Math.abs(value)
        }
      }
    },
  },
  methods: {
    getStoreLink(link) {
      const url = new URL(link)
      const baseUrl = new URL(this.baseURL)
      url.searchParams.append('utm_source', baseUrl.host)
      return url.toString()
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
  grid-template-rows: 200px 85px;
  grid-template-columns: 80px 1fr;
  row-gap: 4px;
  transition: 0.5s;

  .v-img {
    max-height: 200px;
    transition: 0.5s;

  }

  &:hover {
    grid-template-rows: 120px 160px;

    .v-img {
    max-height: 120px;
  }
        }

  .screenshot {
    grid-column: 1 / 3;
  }

  .detail-bottom {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    grid-column: 1 / 3;
    padding: 5px 50px 5px 20px;

    .title {
      font-size: 1.3rem !important;
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
  }

  .top_wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .score {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 10px;
    font-size: 15px !important;

    span {
      display: block;
      padding-left: 5px;
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
    
    .tag-container {
      position: absolute;
      bottom: 8px;
      padding-right: 40px;
      background-color: white;
    }
    .btn-actions {
      display: flex;
      gap: 8px;
      position: relative;
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
