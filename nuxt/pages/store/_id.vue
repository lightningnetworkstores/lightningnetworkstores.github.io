<template>
  <div class="store-info">
    <div>
      <v-breadcrumbs :items="breadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <v-container>
      <v-row justify="center" v-if="selectedStore">
        <v-col
          cols="12"
          sm="9"
          xl="6"
        >
          <v-row justify="center">
            <v-col cols="12" sm="12">
              <v-card class="pa-0 mb-3">
                <div v-if="selectedStore.images.number > 1">
                  <v-carousel v-model="imageCarousel" hide-delimiters height="auto">
                    <v-carousel-item
                      v-for="(img, i) in selectedStore.images.number"
                      :key="i"
                      class="carousel-style"
                    >
                      <v-img
                        :src="`${baseURL}thumbnails/${
                          i > 0
                            ? `${selectedStore.id}_${i + 1}`
                            : `${selectedStore.id}`
                        }.png`"
                        @click="openImage(i)"
                        class="text-right"
                      >
                        <div v-if="i === 0">
                          <v-chip
                            v-if="isNewStore(selectedStore)"
                            color="green"
                            text-color="white"
                            class="ma-2"
                          >
                            New
                          </v-chip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-chip
                                v-if="selectedStore.trending > 0"
                                color="purple"
                                text-color="white"
                                v-on="on"
                              >
                                {{ selectedStore.trending }}%

                                <v-icon v-on="on" pr-2 small right
                                  >fa-fire</v-icon
                                >
                              </v-chip>
                            </template>
                            <span>Trending score</span>
                          </v-tooltip>

                          <v-chip
                            v-if="hasNewComment(selectedStore)"
                            color="blue"
                            text-color="white"
                            class="ma-2"
                          >
                            New comment
                          </v-chip>
                        </div>
                      </v-img>
                    </v-carousel-item>
                  </v-carousel>
                </div>
                <div v-else>
                  <v-img
                    :src="`${baseURL}thumbnails/${selectedStore.id}.png`"
                    class="text-right"
                    max-height="500px"
                    aspect-radio="1.6"
                    position="top center"
                    @click="openImage"
                  >
                    <v-chip
                      v-if="isNewStore(selectedStore)"
                      color="green"
                      text-color="white"
                      class="ma-2"
                    >
                      New
                    </v-chip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-chip
                          v-if="selectedStore.trending > 0"
                          color="purple"
                          text-color="white"
                          v-on="on"
                        >
                          {{ selectedStore.trending }}%
                          <v-icon v-on="on" pr-2 small right>fa-fire</v-icon>
                        </v-chip>
                      </template>
                      <span>Trending score</span>
                    </v-tooltip>

                    <v-chip
                      v-if="hasNewComment(selectedStore)"
                      color="blue"
                      text-color="white"
                      class="ma-2"
                    >
                      New comment
                    </v-chip>
                  </v-img>
                </div>
                <v-row class="pa-5">
                  <v-col class="pb-1">
                    <div class="headline d-flex">
                      <h3 class="mt-1">
                        <a class="" @click.stop :href="selectedStore.href">
                          {{ selectedStore.name }}

                          <v-icon class="ml-1" color="blue darken-2">
                            mdi-open-in-new
                          </v-icon>
                        </a>
                      </h3>
                      <edit-store-modal
                        v-if="selectedStore.logged"
                        :store="selectedStore"
                        :editAttribute="editStoreName"
                        class="ml-2"
                      ></edit-store-modal>
                    </div>
                    <edit-tags :store="selectedStore"></edit-tags>
                    <v-row class="pt-0">
                      <v-col>
                        <div class="d-flex">
                          <p class="mt-2">
                            {{ selectedStore.description }}
                          </p>
                          <edit-store-modal
                            v-if="selectedStore.logged"
                            :store="selectedStore"
                            :editAttribute="{label: 'Description', value: selectedStore.description, key: 'description' }"
                            class="ml-2"
                          />
                        </div>
                        <div
                          v-if="
                            selectedStore.uri &&
                            selectedStore.uri.toLowerCase() != 'unknown'
                          "
                          class="px-0"
                        >
                          <div class="d-flex">
                            <span class="break-word mt-2"
                              ><b>Node:&nbsp;</b
                              ><a
                                :href="
                                  'https://1ml.com/node/' +
                                  selectedStore.uri.split('@')[0]
                                "
                                >{{ selectedStore.uri }}</a
                              ></span
                            >
                            <edit-store-modal
                              v-if="selectedStore.logged"
                              :store="selectedStore"
                              :editAttribute="{label: 'Node URI', value: selectedStore.uri, key: 'uri' }"
                              class="ml-2"
                            />
                          </div>
                        </div>

                        <div class="px-0">
                          <b>Date added:&nbsp;</b
                          ><span v-if="selectedStore.added">
                            {{
                              new Date(
                                selectedStore.added * 1000
                              ).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            }}</span
                          ><a v-else>24/Feb/2018</a>
                        </div>

                        <div class="px-0">
                          <b>Likes: &nbsp;</b>
                          <like-store-button :store="store" />
                        </div>

                        <div
                          v-if="
                            selectedStore.sector &&
                            selectedStore.sector.length > 0
                          "
                          class="px-0"
                        >
                          <b>Lifetime score: &nbsp;</b
                          ><span v-if="selectedStore.lifetime">
                            {{ Number(selectedStore.lifetime).toLocaleString() }}</span
                          ><span v-else>0</span>
                        </div>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>
                        <vote-line
                          :store="selectedStore"
                          :isInfo="true"
                        ></vote-line>
                      </v-col>
                    </v-row>

                    <v-row class="pl-2 pr-2 pt-3 d-flex justify-space-between">
                      <div class="d-flex">
                        <v-btn
                          text
                          icon
                          color="blue"
                          :disabled="!selectedStore.social.twitter"
                          :href="getSocialHref(selectedStore.social.twitter)"
                        >
                          <v-icon>fab fa-twitter</v-icon>
                        </v-btn>
                        <edit-store-modal
                          v-if="selectedStore.logged && selectedStore.social.twitter"
                          :store="selectedStore"
                          :editAttribute="{label: 'Twitter', value: selectedStore.social.twitter.href, key: 'twitter' }"
                          class="ml-2"
                        />
                        <v-btn
                          text
                          icon
                          color="blue darken-3"
                          :disabled="!selectedStore.social.facebook"
                          :href="getSocialHref(selectedStore.social.facebook)"
                        >
                          <v-icon>fab fa-facebook</v-icon>
                        </v-btn>
                        <edit-store-modal
                          v-if="selectedStore.logged && selectedStore.social.facebook"
                          :store="selectedStore"
                          :editAttribute="{label: 'Facebook', value: selectedStore.social.facebook.href, key: 'facebook' }"
                          class="ml-2"
                        />
                        <v-btn
                          text
                          icon
                          color="orange darken-2"
                          :disabled="!selectedStore.social.reddit"
                          :href="getSocialHref(selectedStore.social.reddit)"
                        >
                          <v-icon>fab fa-reddit</v-icon>
                        </v-btn>
                        <edit-store-modal
                          v-if="selectedStore.logged && selectedStore.social.reddit"
                          :store="selectedStore"
                          :editAttribute="{label: 'Reddit', value: selectedStore.social.reddit.href, key: 'reddit' }"
                          class="ml-2"
                        />
                      </div>

                      <div class="d-flex">
                        <embed-modal
                          :store="selectedStore"
                          :baseURL="baseURL"
                          class="ml-2"
                        ></embed-modal>
                        <ban-store-modal
                          :store="selectedStore"
                          class="ml-2"
                        ></ban-store-modal>
                      </div>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col sm="3" xl="2" class="pa-0 mt-3">
          <v-col cols="0" sm="12" md="12" class="pa-0 d-flex flex-column justify-center">
            <v-btn
              v-if="!selectedStore.logged"
              @click="requestLogin"
              class="mx-3 mb-3 py-6 mt-3" large style="background: white">
              <b>Login as owner</b>
            </v-btn>
            <v-btn v-else @click="requestLogout"
              class="mx-3 mb3 py-6 mt-3" large style="background: white">
              <b>Logout</b>
            </v-btn>
            <div v-if="hasExternal" class="ma-3 headline font-weight-medium">External</div>
            <v-card
              v-for="(external, propertyName, index) in selectedStore.external"
              :key="index"
              class="mx-3 mb-3 py-2"
            >
              <v-layout row class="py-2">
                <v-flex shrink>
                  <v-img
                    :src="`https://lightningnetworkstores.com/external/${propertyName}.svg`"
                    class="external-image"
                    @click="() => handleExternalClick(external.href)"
                  >
                  </v-img>
                </v-flex>
                <v-flex grow class="external-text">
                  <b>{{ propertyName }}</b>
                </v-flex>
                <v-flex shrink class="mr-4 mt-1 d-flex">
                  <edit-store-modal
                    v-if="selectedStore.logged"
                    :store="selectedStore"
                    :editAttribute="{label: propertyName, value: external.href, key: propertyName }"
                  />
                  <delete-external-modal
                    :store="selectedStore"
                    :field="propertyName"
                  />
                </v-flex>
              </v-layout>
            </v-card>
            <v-card class="mx-3 py-2">
              <v-layout row class="py-2 d-flex" justify-center>
                <v-flex shrink class="mt-1">
                  <add-external-modal
                    :store="selectedStore"
                  />
                </v-flex>
              </v-layout>
            </v-card>
          </v-col>
        </v-col>
      </v-row>
      <v-row justify="center" v-if="relatedStores.length>0">
        <v-col
          cols="11"
          sm="9"
        >
          <v-layout class="mt-4 mb-2" justify-center>
            <h1>Similar</h1>
          </v-layout>
          <v-row no-gutters justify="center">
            <v-col cols="10" sm="8" md="7" xl="6">
              <store-card
                class="mb-4"
                v-for="store in relatedStores.slice(0, maxSimilarToShow)"
                :key="'store-' + store.id"
                :store="store"
              >
              </store-card>
            </v-col>
          </v-row>
          <v-layout justify-center="true" v-if="relatedStores.length > 1">
            <v-btn @click="toggleMoreSimilar()" color="primary">
              {{ maxSimilarToShow > 1 ? 'Hide Similar' : 'Show more' }}
            </v-btn>
          </v-layout>
        </v-col>
        <v-col cols="0" sm="3" xl="2" class="pa-0">
        </v-col>
      </v-row>
      <v-row justify="center" v-if="selectedStore">
        <v-col
          cols="12"
          sm="9"
          xl="6"
        >
          <v-card class="my-8 pa-2">
            <v-card-title primary-title class="pa-3">
              <div>
                <div class="headline font-weight-medium">Reviews</div>
              </div>
            </v-card-title>
            <v-card-text class="body-1">
              <v-row>
                <v-flex px-3 pb-3
                  >To leave a review, up or downvote the selectedStore.</v-flex
                >
              </v-row>
              <v-row pa-2 class="text-center">
                <v-flex grow justify-center pa-3
                  ><v-btn
                    fab
                    @click="filter('positive')"
                    :outlined="currentFilter !== 'positive'"
                    color="success"
                    class="mb-2"
                    ><v-icon
                      :color="currentFilter == 'positive' ? 'white' : 'success'"
                      large
                      >mdi-thumb-up</v-icon
                    ></v-btn
                  >
                  <h4>
                    Positive:
                    {{
                      selectedStore.reviews.filter(
                        (review) =>
                          review[0].score > 0
                      ).length
                    }}
                  </h4>
                </v-flex>
                <v-flex grow justify-center pa-3
                  ><v-btn
                    fab
                    @click="filter('all')"
                    :outlined="currentFilter !== 'all'"
                    color="blue"
                    class="mb-2"
                    ><v-icon
                      :color="currentFilter == 'all' ? 'white' : 'blue'"
                      large
                      >mdi-thumbs-up-down</v-icon
                    ></v-btn
                  >
                  <h4>
                    All:
                    {{
                      selectedStore.reviews.length
                    }}
                  </h4></v-flex
                >
                <v-flex grow justify-center pa-3
                  ><v-btn
                    fab
                    @click="filter('negative')"
                    :outlined="currentFilter !== 'negative'"
                    color="error"
                    class="mb-2"
                    ><v-icon
                      :color="currentFilter == 'negative' ? 'white' : 'error'"
                      large
                      >mdi-thumb-down</v-icon
                    ></v-btn
                  >
                  <h4>
                    Negative:
                    {{ selectedStore.reviews.filter(review => review[0].score &lt; 0).length }}
                  </h4></v-flex
                >
              </v-row>
            </v-card-text>
          </v-card>
          <v-dialog v-model="imageModal" width="900">
            <ImageModal
              :id="selectedStore.id"
              :images="selectedStore.images.number"
              :baseURL="baseURL"
              :currentImage="imageCarousel"
            />
          </v-dialog>
          <Review
            v-for="review in reviews"
            :key="review[0].id"
            :comment="review[0]"
            :comments="review"
            :store="selectedStore"
          ></Review>
        </v-col>
        <v-col cols="0" sm="3" xl="2" class="pa-0">
        </v-col>
      </v-row>
    </v-container>
    <login-modal
      :enabled="showLoginModal"
      :onCancel="closeDialog"
      :onCaptchaToken="onCaptchaToken"
      :email="storeEmail"
      :rooturl="selectedStore.rooturl"
      :loginResponse="loginResponse"
    />
    <logout-modal
      :enabled="showLogoutModal"
      :onCancel="handleCancelLogout"
      :onConfirm="handleLogoutConfirm">
    </logout-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AddExternalModal from '~/components/AddExternalModal.vue'

import StoreCard from '~/components/StoreCard'
import LikeStoreButton from '../../components/LikeStoreButton.vue'

export default {
  components: { StoreCard, LikeStoreButton, AddExternalModal },
  head() {
    return {
      title: this.selectedStore.name + ' | Lightning Network Stores',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.selectedStore.description,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.selectedStore.name + ' | Lightning Network Stores',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.selectedStore.description,
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: this.selectedStore.name + ' | Lightning Network Stores',
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: this.selectedStore.description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: '/thumbnails/' + this.selectedStore.id + '_0.png',
        },
      ],
    }
  },
  data() {
    return {
      breadcrumb: [],
      currentFilter: 'all',
      imageCarousel: 0,
      imageModal: false,
      maxSimilarToShow: 1,
      showLoginModal: false,
      showLogoutModal: false,
      loginResponse: null
    }
  },
  async asyncData({ params, store }) {

    const selectedStore = await store.dispatch('getStore', { id: params.id })
    store.dispatch('setStore', selectedStore)
    
    const storeId = selectedStore.id

    //let reviews = sortReviewThreads(selectedStore.reviews); can't use sortReviewThreads() here why?
    let reviews = JSON.parse(JSON.stringify(selectedStore.reviews)).sort((a, b) => {
        if (Math.abs(b[0].score) !== Math.abs(a[0].score)) {
          return Math.abs(b[0].score) - Math.abs(a[0].score)
        }
        return b[0].timestamp - a[0].timestamp
      });

    return { selectedStore, reviews, storeId }
  },

  async mounted() {
    await this.$store.dispatch('getStatus', { storeId: this.storeId })
    this.breadcrumb = [
      {
        text: 'Stores',
        disabled: false,
        href: '/',
      },
      {
        text: this.selectedStore.name,
        disabled: false,
        href: location.href,
      },
    ]
  },
  computed: {
    baseURL() {
      return this.$store.state.baseURL
    },
    hasExternal() {
      return Object.keys(this.selectedStore.external).length > 0
    },
    relatedStores() {
      //Removes store with the same id
      return this.selectedStore.related.filter(
        (store) => store.id !== this.selectedStore.id
      )
    },
    storeEmail() {
      return this.selectedStore.email
    },
    editStoreName() {
      return [
        {label: 'Store Name', value: this.selectedStore.name, key: 'name' },
        {label: 'URL', value: this.selectedStore.href, key: 'href' }
      ]
    },
    ...mapState(['likedStores', 'store']),
  },

  methods: {
    sortReviewThreads(reviewThreads){ //can't use?
        reviewThreads.sort((a, b) => {
        if (Math.abs(b[0].score) !== Math.abs(a[0].score)) {
          return Math.abs(b[0].score) - Math.abs(a[0].score)
        }
        return b[0].timestamp - a[0].timestamp
      })
      return reviewThreads;
    },  
    toggleMoreSimilar() {
      this.maxSimilarToShow =
        this.maxSimilarToShow !== 1 ? 1 : this.relatedStores.length
    },
    getSocialHref(social) {
      if (social && social.href) return social.href

      return ''
    },
    isNewStore() {
      return (
        new Date(this.selectedStore.added * 1000 + 1000 * 60 * 60 * 24 * 8) >
        new Date()
      )
    },
    hasNewComment(store) {
      return (
        new Date(this.selectedStore.last_commented + 1000 * 60 * 60 * 24 * 8) >
        new Date()
      )
    },
    filter(filter) {
      this.currentFilter = filter
      switch (filter) {
        case 'all':
          this.reviews = this.selectedStore.reviews.filter(r=>true);
          break
        case 'negative':
          this.reviews = this.selectedStore.reviews.filter(
            (review) => review[0].score < 0
          )
          break
        case 'positive':
          this.reviews = this.selectedStore.reviews.filter(
            (review) => review[0].score > 0
          )
          break
        default:
          this.reviews = this.selectedStore.reviews.filter(r=>true);
          break
      }
      this.reviews.sort((a, b) => {
        if (Math.abs(b[0].score) !== Math.abs(a[0].score)) {
          return Math.abs(b[0].score) - Math.abs(a[0].score)
        }
        return b[0].timestamp - a[0].timestamp
      });
    },
    openImage(i) {
      this.imageModal = true
      if (i) {
        this.imageCarousel = i
      }
    },
    requestLogin() {
      this.showLoginModal = true
    },
    closeDialog() {
      this.showLoginModal = false
    },
    onCaptchaToken(token, recipient) {
      const payload = {
        token: token,
        storeId: this.selectedStore.id
      };
      if (recipient) {
        payload['recipient'] = recipient;
      }
      this.$store.dispatch('login', payload)
        .then(data => this.loginResponse = data)
        .catch(err => {
          console.error(err);
          this.closeDialog();
        });
    },
    handleExternalClick(url) {
      window.open(url, '_blank', 'noopener');
    },
    handleLogoutConfirm() {
      this.$store.dispatch('logout')
        .then(() => this.showLogoutModal = false)
        .catch(err => {
          console.error(err);
          this.showLogoutModal = false;
        })
    },
    requestLogout() {
      this.showLogoutModal = true;
    },
    handleCancelLogout() {
      this.showLogoutModal = false;
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.store-link {
  &:hover {
    text-decoration: underline;
  }
}
.link-icon {
  text-decoration: none;
}
.store-image-link {
  text-decoration: none;
}

.tag-icon {
  cursor: pointer;
  &:hover {
    filter: brightness(120%);
  }
}
.external-image {
  width: 24px;
  height: 24px;
  margin: 10px 10px 10px 25px;
  cursor: pointer;
}
.external-text {
  line-height: 44px;
}
@media only screen and (min-width: 600px) {
  .external-title {
    margin-top: 200px !important;
  }
}
</style>
