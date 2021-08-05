<template>
  <div class="announcement-modal">
    <template v-if="notification">
      <v-dialog v-model="showModal" max-width="700" persistent>
        <v-card>
          <v-card-title class="headline justify-center">{{
            notification.title
          }}</v-card-title>
          <v-card-text>
            <div>
              <p v-html="htmlBody" class="text-md-body-1"></p>
              <img
                v-if="notification.image"
                :src="notification.image"
                :alt="notification.title"
                class="w-100"
              />
              <iframe
                v-if="notification.video"
                class="video-box"
                :src="notificationEmbedVideo"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
              <div v-if="notification.tweet" class="tweet-box">
                <blockquote class="twitter-tweet" data-cards="hidden">
                  <a :href="notification.tweet" data-height="300"></a>
                </blockquote>
                <script
                  async
                  src="https://platform.twitter.com/widgets.js"
                  charset="utf-8"
                ></script>
              </div>

              <div class="text-center">
                <v-btn
                  v-if="notification.href"
                  color="blue darken-1"
                  class="text-md-h6"
                  text
                  x-large
                  :href="notification.href"
                  >Learn More</v-btn
                >
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-checkbox
              v-if="!notification.important && !warningMessage"
              v-model="announcementsConfig.enabled"
              label="I want to keep seeing these notifications"
            ></v-checkbox>
            <v-spacer></v-spacer>
            <div class="move-buttons" v-if="!warningMessage">
              <v-btn
                v-if="isThereNextAd"
                color="green darken-1"
                text
                @click="nextAnnounce"
              >
                Previous
              </v-btn>
              <v-btn
                v-if="isTherePreviousAd"
                color="green darken-1"
                text
                @click="prevAnnounce"
              >
                Next
              </v-btn>
            </div>
            <v-btn color="green darken-1" text @click="submitAnnounce">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showModal: false,
      initModal: true,
      excludedRoutes: ['test'],
      announcementsConfig: {
        enabled: true,
        lastAnnouncementSeen: 0,
        lastVersionWarning: 0,
      },
      lastNotificationSeen: 0,
      notification: {},
      newVersionMessage: {
        title: 'Warning: the website you are seeing is outdated',
        body: `Please refresh your browser's cache. You can easily do this by pressing CTRL+R`,
      },
      warningMessage: false,
    }
  },

  computed: {
    ...mapState({
      announcement: (state) => {
        const [announcement] = [...state.announcements.items].sort(
          (ann1, ann2) => ann2.id - ann1.id
        )

        return Boolean(announcement) ? announcement : {}
      },
      announcementReqConfig: (state) => state.announcements.configuration,
      announcements: (state) => state.announcements.items,
      configuration: 'configuration',
    }),

    actualAdIndex() {
      return this.announcements.findIndex(
        (ad) => ad.id === this.notification.id
      )
    },

    htmlBody() {
      const body = this.notification.body?.replace(/(?:\r\n|\r|\n)/g, '<br>')
      return body
    },

    isTherePreviousAd() {
      const prevIndex = this.actualAdIndex - 1

      return prevIndex >= 0
    },

    isThereNextAd() {
      const prevIndex = this.actualAdIndex + 1

      return prevIndex > 0 && prevIndex < this.announcements.length
    },

    notificationEmbedVideo() {
      return this.$createEmbedLink(this.notification.video)
    },
  },

  methods: {
    submitAnnounce() {
      if (!this.warningMessage) {
        this.announcementsConfig.lastAnnouncementSeen =
          this.lastNotificationSeen
      } else {
        this.announcementsConfig.lastVersionWarning =
          this.announcementReqConfig.version
      }

      this.showModal = false
      localStorage.setItem(
        'announcements_config',
        JSON.stringify(this.announcementsConfig)
      )
    },

    prevAnnounce() {
      this.notification = this.announcements[this.actualAdIndex - 1]
    },

    nextAnnounce() {
      this.notification = this.announcements[this.actualAdIndex + 1]
    },

    setIsModalOpen() {
      this.announcementsConfig =
        JSON.parse(localStorage.getItem('announcements_config')) ??
        this.announcementsConfig

      if (
        this.excludedRoutes.includes(this.$route.name) ||
        !this.configuration
      ) {
        return
      }

      if (this.announcement?.important || this.warningMessage) {
        this.showModal = true
        return
      }

      const isWarningLastVersion =
        this.warningMessage &&
        this.announcement.version ===
          this.announcementsConfig.lastVersionWarning

      if (isWarningLastVersion) {
        return
      }

      if (this.announcementsConfig.enabled) {
        const openDialog =
          this.announcement.id > this.announcementsConfig.lastAnnouncementSeen

        this.showModal = openDialog
      }
    },

    async setNotificationMessage() {
      const announcementVersion = this.announcementReqConfig?.version
      const configurationVersion = this.configuration?.version

      if (announcementVersion && configurationVersion) {
        if (announcementVersion > configurationVersion) {
          this.notification = this.newVersionMessage
          this.warningMessage = true
        } else if (configurationVersion) {
          this.notification = this.announcement
          this.lastNotificationSeen = this.announcement.id
        }
        this.setIsModalOpen()
      }
    },
  },
  mounted() {
    this.setNotificationMessage()
  },
  watch: {
    async configuration(newValue, oldValue) {
      if (!oldValue.version) {
        await this.$store.dispatch('getAnnouncements')
        this.setNotificationMessage()
      }
    },
  },
}
</script>

<style scoped lang="scss">
.w-100 {
  width: 100%;
}
.tweet-box {
  width: 75%;
  margin: auto;
}
.video-box {
  width: 100%;
  height: 370px;
}
</style>
