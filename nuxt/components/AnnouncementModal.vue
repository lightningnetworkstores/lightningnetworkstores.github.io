<template>
  <div class="ban-store-modal">
    <v-btn text icon color="grey darken-2" @click.stop="showModal = true">
      <v-icon>fa-ban</v-icon>
    </v-btn>

    <!-- Ban store modal -->
    <template v-if="announcement">
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
              <div v-if="notification.tweet" class="tweet-box">
                <blockquote class="twitter-tweet">
                  <a :href="notification.tweet"></a>
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
      notification: {},
      newVersionMessage: {
        title: 'Warning: the website you are seeing is outdated',
        body: `Please refresh your browser's cache. You can easily do this by pressing CTRL+R`,
      },
      warningMessage: false,
    }
  },

  computed: {
    htmlBody() {
      const body = this.notification.body?.replace(/(?:\r\n|\r|\n)/g, '<br>')
      return body
    },

    ...mapState({
      announcement: (state) => {
        const [announcement] = [...state.announcements].sort(
          (ann1, ann2) => ann2.id - ann1.id
        )
        return announcement
      },
      configuration: 'configuration',
    }),
  },

  methods: {
    submitAnnounce() {
      if (!this.warningMessage) {
        this.announcementsConfig.lastAnnouncementSeen = this.announcement.id
      } else {
        this.announcementsConfig.lastVersionWarning = this.announcement.version
      }

      this.showModal = false
      localStorage.setItem(
        'announcements_config',
        JSON.stringify(this.announcementsConfig)
      )
    },

    setIsModalOpen() {
      if (this.excludedRoutes.includes(this.$route.name)) {
        return
      }

      if (this.announcement.important) {
        this.showModal = true
        return
      }

      this.announcementsConfig =
        JSON.parse(localStorage.getItem('announcements_config')) ??
        this.announcementsConfig

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

    setNotificationMessage() {
      const announcementVersion = this.announcement.version
      const configurationVersion = this.configuration?.version

      if (announcementVersion > configurationVersion) {
        this.notification = this.newVersionMessage
        this.warningMessage = true
      } else if (configurationVersion) {
        this.notification = this.announcement
      }
    },
  },

  watch: {
    announcement() {
      if (this.initModal) {
        this.setNotificationMessage()
        this.setIsModalOpen()
        this.initModal = false
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
</style>
