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
            announcement.title
          }}</v-card-title>
          <v-card-text>
            <div>
              <p v-html="htmlBody" class="text-md-body-1"></p>
              <img
                v-if="announcement.image"
                :src="announcement.image"
                :alt="announcement.title"
              />
              <div class="text-center">
                <v-btn
                  v-if="announcement.href"
                  color="blue darken-1"
                  class="text-md-h6"
                  text
                  x-large
                  href="announcement.href"
                  >Learn More</v-btn
                >
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="showModal = false">
              Cancel
            </v-btn>

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
      announcementsConfig: {},
    }
  },

  computed: {
    htmlBody() {
      const body = this.announcement.body.replace(/(?:\r\n|\r|\n)/g, '<br>')
      console.log(body)
      return body
    },

    ...mapState({
      announcement: (state) => {
        const [announcement] = [...state.announcements].sort(
          (ann1, ann2) => ann2.id - ann1.id
        )
        return announcement
      },
    }),
  },

  methods: {
    submitAnnounce() {
      this.announcementsConfig.lastAnnouncementSeen = this.announcement.id
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

      const defaultConfig = {
        enabled: true,
        lastAnnouncementSeen: 0,
        lastVersionWarning: 0,
      }

      this.announcementsConfig =
        JSON.parse(localStorage.getItem('announcements_config')) ??
        defaultConfig

      if (this.announcementsConfig.enabled) {
        const openDialog =
          this.announcement.id > this.announcementsConfig.lastAnnouncementSeen

        this.showModal = openDialog
      }
    },
  },

  watch: {
    announcement() {
      if (this.initModal) {
        this.setIsModalOpen()
        this.initModal = false
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
