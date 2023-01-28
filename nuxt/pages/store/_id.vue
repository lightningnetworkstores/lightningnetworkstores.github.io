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
        <v-col cols="12" sm="9" xl="6">
          <v-alert v-if="selectedStore.new" text type="warning">
            Store is new and additional images are being fetched. Please wait a
            few minutes to change your images.
          </v-alert>
          <v-row justify="center">
            <v-btn
              v-if="isLogged"
              @click="toggleEditing"
              color="primary"
              class="mx-3 mb-3 py-6 mt-3"
              min-width="200"
              :elevation="editButtonElevation"
              large
            >
              <v-icon left> mdi-pencil </v-icon>
              Edit
            </v-btn>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" sm="12">
              <inactivity-alert :inactivityData="selectedStore.inactivity" />
              <v-card class="pa-0 mb-3">
                <store-carousel
                  @imageClicked="handleImageClick"
                  :selectedStore="selectedStore"
                  :logged="editingSelectedStore === true"
                />
                <v-row class="pa-5">
                  <v-col class="pb-1">
                    <div class="headline d-flex">
                      <h3 class="mt-1">
                        <a @click.stop :href="getStoreLink(selectedStore.href)">
                          {{ selectedStore.name }}

                          <v-icon class="ml-1" color="blue darken-2">
                            mdi-open-in-new
                          </v-icon>
                        </a>
                      </h3>
                      <edit-store-modal
                        v-if="editingSelectedStore"
                        :store="selectedStore"
                        :editAttribute="editStoreName"
                        class="ml-2"
                      ></edit-store-modal>
                    </div>
                    <edit-tags :store="selectedStore"></edit-tags>
                    <store-info-section></store-info-section>
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
                        <div
                          v-for="(name, index) in Object.keys(selectedStore.social)"
                          :key="index"
                          class="d-flex flex-column align-center"
                        >
                          <v-btn
                            text
                            icon
                            :color="social[name].color"
                            :href="getSocialHref(selectedStore.social[name])"
                          >
                            <v-icon>fab fa-{{ name }}</v-icon>
                          </v-btn>
                          <span
                            v-show="getPopularityValue(name) !== 0"
                            class="text-caption"
                            style="line-height: 1;"
                          >
                            {{ getPopularityValue(name) }}
                          </span>
                        </div>
                        <edit-social-media-modal
                          v-if="editingSelectedStore"
                          :store="selectedStore"
                        />
                      </div>

                      <div class="d-flex">
                        <share-modal :store="selectedStore" />
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
          <v-col
            cols="0"
            sm="12"
            md="12"
            class="pa-0 d-flex flex-column justify-center"
          >
            <v-btn
              v-if="!editingSelectedStore"
              @click="requestLogin"
              class="mx-3 mb-3 py-6 mt-3"
              large
              style="background: white"
            >
              <b>Login as owner</b>
            </v-btn>
            <v-btn
              v-else
              @click="requestLogout"
              class="mx-3 mb3 py-6 mt-3"
              large
              style="background: white"
            >
              <b>Logout</b>
            </v-btn>
            <div v-if="showSettings" class="d-flex w100">
              <v-btn
                class="mx-3 mb3 py-6 mt-3 flex-grow-1"
                color="white"
                large
                @click="openSettingsModal"
              >
                <v-icon class="mr-2" color="grey darken-1">mdi-cog</v-icon>
              </v-btn>
              <settings-modal :store="selectedStore" />
            </div>
            <div v-if="hasExternal" class="ma-3 headline font-weight-medium">
              External
            </div>
            <v-card
              v-for="(external, propertyName, index) in selectedStore.external"
              :key="index"
              @click="() => handleExternalClick(external.href)"
              class="mx-3 mb-3 py-2 external-link"
            >
              <v-layout row class="py-2">
                <v-flex shrink>
                  <v-img
                    :src="`https://bitcoin-stores.com/external/${propertyName}.svg`"
                    class="external-image"
                  >
                  </v-img>
                </v-flex>
                <v-flex grow class="external-text pr-2 d-flex justify-space-between">
                  <b>{{ propertyName }}</b>
                  <b
                    v-show="getPopularityValue(propertyName) !== 0"
                    class="grey--text"
                  >
                    {{ getPopularityValue(propertyName) }}
                  </b>
                </v-flex>
                <v-flex shrink class="mr-4 mt-1 d-flex">
                  <edit-store-modal
                    v-if="editingSelectedStore"
                    :store="selectedStore"
                    :editAttribute="{
                      label: propertyName,
                      value: external.href,
                      key: propertyName,
                    }"
                  />
                  <delete-external-modal
                    v-if="editingSelectedStore"
                    :store="selectedStore"
                    :field="propertyName"
                  />
                </v-flex>
              </v-layout>
            </v-card>
            <add-external-modal
              :store="selectedStore"
              v-if="editingSelectedStore"
            />
            <div class="mx-3 mt-3 py-2">
              <AddEventModal
                v-if="editingSelectedStore"
                :storeId="selectedStore.id"
              />
              <div
                v-if="
                  selectedStore.event && Object.keys(selectedStore.event).length
                "
              >
                <div class="ma-3 headline font-weight-medium">
                  Ongoing Event
                </div>
                <EventCard :event="selectedStore.event" />
              </div>
            </div>

            <builder-stores
              :paramsId="paramsId"
              :storeId="selectedStore.id"
              v-if="builderStore.length > 0 || editingSelectedStore"
            />
          </v-col>
        </v-col>
      </v-row>

      <v-row justify="center" v-if="selectedStore && discussions.length > 0">
        <v-col cols="12" sm="9" xl="6">
            <v-layout justify-center class="mt-4 mb-2"
              ><h1>Discussions</h1></v-layout
            >
          <div class="mb-3">
            <discussion-threads :expand="false" :displayDetailLink="true" :threads="discussions" />
          </div>
        </v-col>
        <v-col sm="3" xl="2" cols="0" class="pa-0"></v-col>
      </v-row>  

      <v-row class="justify-center" v-if="relatedStores.length > 0">
        <v-col cols="12" sm="9" xl="6">
          <v-layout class="mt-4 mb-2" justify-center>
            <h1>Similar</h1>
          </v-layout>
          <v-layout class="wrap justify-center">
            <v-flex
              class="my-3 mx-sm-3 similar-item"
              v-for="store in relatedStores.slice(0, maxSimilarToShow)"
              :key="'store-' + store.id"
            >
              <store-card :store="store"> </store-card>
            </v-flex>
          </v-layout>
          <v-layout
            justify-center="true"
            v-if="relatedStores.length > minSimilarToShow"
          >
            <v-btn @click="toggleMoreSimilar()" color="primary">
              {{ showSimilarBtnMessage }}
            </v-btn>
          </v-layout>
        </v-col>
        <v-col sm="3" xl="2" cols="0" class="pa-0"></v-col>
      </v-row>
      <v-row justify="center" v-if="selectedStore">
        <v-col cols="12" sm="9" xl="6">
          <v-card class="my-8 pa-2">
            <v-card-title primary-title class="pa-3">
              <div>
                <div class="headline font-weight-medium">Reviews</div>
              </div>
            </v-card-title>
            <v-card-text class="body-1">
              <v-row>
                <five-star-review
                  :reviews="this.selectedStore.reviews2"
                  @filterChange="filterReviewsWithStars"
                  class="my-3"
                />
              </v-row>
              <v-row>
                <v-col v-if="isLogged" cols="12">
                  <five-star-review-modal :storeID="storeId" />
                </v-col>
                <v-col v-else cols="12" class="d-flex justify-center">
                  Login to leave a review
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <review-list
                    @toggleHelpful="toggleHelpful"
                    :reviews="this.selectedStore.reviews2"
                    :storeId="selectedStore.id"
                    :showReviewsWithStars="showReviewsWithStars"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-dialog v-model="imageModal" width="900">
            <ImageModal
              :id="selectedStore.id"
              :mediaArray="selectedStore.media.main"
              :baseURL="baseURL"
              :selectedMedia="selectedMediaIndex"
            />
          </v-dialog>
        </v-col>
        <v-col cols="0" sm="3" xl="2" class="pa-0"> </v-col>
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
      :onConfirm="handleLogoutConfirm"
    >
    </logout-modal>
    <v-row>
      <v-col>
        <AddDiscussModal :default-store-id="this.selectedStore.id" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { numify } from 'numify'
import { mapState } from 'vuex'
import AddExternalModal from '~/components/AddExternalModal.vue'
import DeleteImageModal from '~/components/DeleteImageModal.vue'
import StoreCarousel from '~/components/StoreCarousel.vue'
import StoreCard from '~/components/StoreCard'
import EventCard from '~/components/EventCard'
import AddEventModal from '~/components/AddEventModal.vue'
import LikeStoreButton from '../../components/LikeStoreButton.vue'
import StoreInfoSection from '~/components/StoreInfoSection.vue'
import SocialMedia from '~/mixins/SocialMedia'
import InactivityAlert from '~/components/store-page/InactivityAlert.vue'
import SettingsModal from '~/components/SettingsModal.vue'
import DiscussionThreads from '~/components/discussions/DiscussionThreads'
import Head from '~/mixins/Head'
import AddDiscussModal from '@/components/discussions/AddDiscussModal'

export default {
  components: {
    StoreCard,
    LikeStoreButton,
    AddExternalModal,
    DeleteImageModal,
    StoreCarousel,
    StoreInfoSection,
    InactivityAlert,
    EventCard,
    AddEventModal,
    SettingsModal,
    DiscussionThreads,
    AddDiscussModal
  },
  mixins: [SocialMedia, Head],
  head() {
    return this.getMetadata(
      `${this.selectedStore.name} | Lightning Network Stores`,
      this.selectedStore.description,
      this.baseURL + 'thumbnails/' + this.selectedStore.id + '_0.png'
    )
  },
  data() {
    return {
      breadcrumb: [],
      currentFilter: 'all',
      selectedMediaIndex: 0,
      imageModal: false,
      showLoginModal: false,
      showLogoutModal: false,
      loginResponse: null,
      similarExpanded: false,
      showReviewsWithStars: [1, 2, 3, 4, 5],
    }
  },
  async asyncData({ params, store, error }) {
    try {
      const selectedStore = await store.dispatch('getStore', { id: params.id })
      const storeId = selectedStore.id
      let discussions = JSON.parse(JSON.stringify(selectedStore.discussions))

      let paramsId = params.id
      return { storeId, discussions, paramsId }
    } catch (err) {
      error(err)
    }
  },

  async mounted() {
    this.$store.dispatch('discussions/getLogStatus')
    await this.$store.dispatch('getStatus', { storeId: this.selectedStore.id })
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
    this.$recaptcha.init()
    setInterval(() => this.$recaptcha.init(), 2 * 60 * 1000)
  },
  computed: {
    ...mapState(['stores', 'loginStatus']),
    ...mapState('review', ['reviews']),
    editButtonElevation() {
      if (this.editingSelectedStore) return 0
      return 8
    },
    isLogged() {
      return this.loginStatus?.user?.logged
    },
    showSettings() {
      return (
        this.selectedStoreSettings.email &&
        this.selectedStoreSettings.notifications &&
        this.selectedStoreSettings.notifications.new_reviews !== null &&
        this.editingSelectedStore
      )
    },
    showSimilarBtnMessage() {
      return this.similarExpanded ? 'Hide Similar' : 'Show more'
    },
    showReviewsNegativeLength() {
      return this.selectedStore.reviews.filter((review) => review[0].score < 0)
        .length
    },
    maxSimilarToShow() {
      if (this.similarExpanded) {
        return this.relatedStores.length
      }
      return this.minSimilarToShow
    },
    minSimilarToShow() {
      return this.$vuetify.breakpoint.lgAndUp ? 2 : 1
    },
    baseURL() {
      return this.$store.state.baseURL
    },
    hasExternal() {
      return Object.keys(this.selectedStore.external).length > 0
    },
    relatedStores() {
      return this.stores.filter(({ id }) =>
        this.selectedStore.related.includes(id)
      )
    },
    storeEmail() {
      return this.selectedStore.email
    },
    editStoreName() {
      return [
        { label: 'Store Name', value: this.selectedStore.name, key: 'name' },
        { label: 'URL', value: this.selectedStore.href, key: 'href' },
      ]
    },
    ...mapState([
      'likedStores',
      'selectedStore',
      'selectedStoreSettings',
      'editingSelectedStore',
      'builderStore',
    ]),
  },
  methods: {
    toggleHelpful(payload) {
      this.$store.dispatch('toggleHelpful', payload)
    },
    toggleEditing() {
      this.$store.dispatch('toggleEditing')
    },
    openSettingsModal() {
      this.$store.dispatch('modals/openSettingsModal')
    },
    toggleMoreSimilar() {
      this.similarExpanded = !this.similarExpanded
    },
    getSocialHref(social) {
      if (social && social.href) return social.href
      return ''
    },
    getStoreLink(link) {
      const url = new URL(link)
      const baseUrl = new URL(this.baseURL)

      url.searchParams.append('utm_source', baseUrl.host)

      return url.href
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
          this.reviews = this.selectedStore.reviews.filter((r) => true)
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
          this.reviews = this.selectedStore.reviews.filter((r) => true)
          break
      }
      this.reviews.sort((a, b) => {
        if (Math.abs(b[0].score) !== Math.abs(a[0].score)) {
          return Math.abs(b[0].score) - Math.abs(a[0].score)
        }
        return b[0].timestamp - a[0].timestamp
      })
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
        storeId: this.selectedStore.id,
      }
      if (recipient) {
        payload['recipient'] = recipient
      }
      this.$store
        .dispatch('login', payload)
        .then((data) => (this.loginResponse = data))
        .catch((err) => {
          console.error(err)
          this.closeDialog()
        })
    },
    handleExternalClick(url) {
      window.open(url, '_blank', 'noopener')
    },
    handleLogoutConfirm() {
      this.$store
        .dispatch('logout')
        .then(() => (this.showLogoutModal = false))
        .catch((err) => {
          console.error(err)
          this.showLogoutModal = false
        })
    },
    requestLogout() {
      this.showLogoutModal = true
    },
    handleCancelLogout() {
      this.showLogoutModal = false
    },
    handleImageClick(index) {
      this.imageModal = true
      this.selectedMediaIndex = index
    },
    filterReviewsWithStars(selected) {
      this.showReviewsWithStars = selected
    },
    getPopularityValue (key = '') {
      const formattedKey = key.toUpperCase()
      if(!this.selectedStore.popularity) return 0;
      const popularityCount = this.selectedStore.popularity[formattedKey]
        ? this.selectedStore.popularity[formattedKey]
        : 0
      return numify(popularityCount)
    },
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'discuss' && !to.query.sort_reviews) {
      return next({
        ...to,
        query: { sort_reviews: 'new' },
      })
    } else {
      return next()
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.similar-item {
  min-width: 330px;
  max-width: 500px;
  flex: 1 1 0px;
}

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
.external-link {
  cursor: pointer;
}
.external-image {
  width: 24px;
  height: 24px;
  margin: 10px 10px 10px 25px;
}
.external-text {
  line-height: 44px;
}
@media only screen and (min-width: 600px) {
  .external-title {
    margin-top: 200px !important;
  }
}
.store_craousel {
  .v-sheet {
    position: relative;
    max-height: 500px;
  }
  .v-image__image {
    max-height: 500px;
    background-size: 100% 500px;
  }
}
</style>
