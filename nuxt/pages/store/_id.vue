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
          <v-row justify="center">
            <v-col cols="12" sm="12">
              <inactivity-alert :inactivityData="selectedStore.inactivity" />
              <v-card class="pa-0 mb-3">
                <store-carousel
                  @imageClicked="handleImageClick"
                  :selectedStore="selectedStore"
                  :logged="selectedStore.logged === true"
                />
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
                        <v-btn
                          v-for="(name, index) in Object.keys(
                            selectedStore.social
                          )"
                          :key="index"
                          text
                          icon
                          :color="social[name].color"
                          :href="getSocialHref(selectedStore.social[name])"
                        >
                          <v-icon>fab fa-{{ name }}</v-icon>
                        </v-btn>
                        <edit-social-media-modal
                          v-if="selectedStore.logged"
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
              v-if="!selectedStore.logged"
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
            <v-card class="ma-3 d-flex justify-center headline font-weight-medium">
              <settings-modal v-if="selectedStoreSettings" :store="selectedStore"/>
            </v-card>
            <div v-if="hasExternal" class="ma-3 headline font-weight-medium">
              External
            </div>
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
                    :editAttribute="{
                      label: propertyName,
                      value: external.href,
                      key: propertyName,
                    }"
                  />
                  <delete-external-modal
                    v-if="selectedStore.logged"
                    :store="selectedStore"
                    :field="propertyName"
                  />
                </v-flex>
              </v-layout>
            </v-card>
            <v-card v-if="selectedStore.logged" class="mx-3 mt-3 py-2">
              <v-layout row class="py-2 d-flex" justify-center>
                <v-flex shrink class="mt-1">
                  <add-external-modal :store="selectedStore" />
                </v-flex>
              </v-layout>
            </v-card>
            <div class="mx-3 mt-3 py-2">
              <AddEventModal
                v-if="selectedStore.logged"
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
          </v-col>
        </v-col>
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
                <v-flex px-3 pb-3
                  >To leave a review, up or downvote the selected store.</v-flex
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
                        (review) => review[0].score > 0
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
                    {{ selectedStore.reviews.length }}
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
              :mediaArray="selectedStore.media.main"
              :baseURL="baseURL"
              :selectedMedia="selectedMediaIndex"
            />
          </v-dialog>
          <Thread
            v-for="review in reviews"
            :key="review[0].id"
            :comment="review[0]"
            :comments="review"
            :store="selectedStore"
            :type="'comment'"
          ></Thread>

          <div v-if="discussions.length>0" class="headline font-weight-medium"> <v-layout justify-center class="mt-4 mb-2"><h2>Discussions</h2></v-layout></div>
          <div v-for="(discussion, index) in discussions" :key="index">
            <Thread
              :comment="discussion[0]"
              :comments="discussion.slice(1)"
              :store="selectedStore"
              :type="'discussion'"
              :onlyShowLast="2"
            ></Thread>
          </div>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AddExternalModal from '~/components/AddExternalModal.vue'
import DeleteImageModal from '~/components/DeleteImageModal.vue'
import StoreCarousel from '~/components/StoreCarousel.vue'
import StoreCard from '~/components/StoreCard'
import EventCard from '~/components/EventCard'
import AddEventModal from '~/components/AddEventModal.vue'
import LikeStoreButton from '../../components/LikeStoreButton.vue'
import StoreInfoSection from '~/components/StoreInfoSection.vue'
import SocialMedia from '~/mixins/social-media'
import InactivityAlert from '~/components/store-page/InactivityAlert.vue'
import SettingsModal from '~/components/SettingsModal.vue'

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
    SettingsModal
  },
  mixins: [SocialMedia],
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
          hid: 'image',
          property: 'image',
          content:
            this.baseURL + 'thumbnails/' + this.selectedStore.id + '_0.png',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content:
            this.baseURL + 'thumbnails/' + this.selectedStore.id + '_0.png',
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content:
            this.baseURL + 'thumbnails/' + this.selectedStore.id + '_0.png',
        },
      ],
    }
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
    }
  },
  async asyncData({ params, store, error }) {
    try {
      const selectedStore = await store.dispatch('getStore', { id: params.id })

      const storeId = selectedStore.id

      //let reviews = sortReviewThreads(selectedStore.reviews); can't use sortReviewThreads() here why?
      let reviews = JSON.parse(JSON.stringify(selectedStore.reviews)).sort(
        (a, b) => {
          if (Math.abs(b[0].score) !== Math.abs(a[0].score)) {
            return Math.abs(b[0].score) - Math.abs(a[0].score)
          }
          return b[0].timestamp - a[0].timestamp
        }
      )

    let discussions = JSON.parse(JSON.stringify(selectedStore.discussions))

    return { reviews, storeId, discussions }
    } catch(err) {
      error(err)
    }
  },

  async mounted() {
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
  },
  computed: {
    showSimilarBtnMessage() {
      return this.similarExpanded ? 'Hide Similar' : 'Show more'
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
        { label: 'Store Name', value: this.selectedStore.name, key: 'name' },
        { label: 'URL', value: this.selectedStore.href, key: 'href' },
      ]
    },
    ...mapState(['likedStores', 'selectedStore', 'selectedStoreSettings']),
  },
  methods: {
    sortReviewThreads(reviewThreads) {
      //can't use?
      reviewThreads.sort((a, b) => {
        if (Math.abs(b[0].score) !== Math.abs(a[0].score)) {
          return Math.abs(b[0].score) - Math.abs(a[0].score)
        }
        return b[0].timestamp - a[0].timestamp
      })
      return reviewThreads
    },
    toggleMoreSimilar() {
      this.similarExpanded = !this.similarExpanded
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
