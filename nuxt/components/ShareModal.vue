<template>
  <div>
    <v-btn icon color="gray" @click="openDialog">
      <v-icon>fas fa-share</v-icon>
    </v-btn>
    <v-dialog v-model="showDialog" max-width="500" persistent>
      <v-card>
        <v-card-title>Share</v-card-title>
        <v-slide-group multiple show-arrows>
          <v-slide-item :key="platformName" v-for="platformName in platforms">
            <ShareNetwork
                :network="platformName"
                :url="store.href"
                :title="store.name"
                :description="store.description"
                quote="Found via https://lightningnetworkstores.com/"
              >
              <v-col class="social-media-share-col">
                <v-btn
                  class="ml-3 my-3 d-flex justify-center"
                  fab
                  dark
                  large
                  :color="social[platformName].color"
                >
                  <v-icon dark>{{social[platformName].icon}}</v-icon>
                </v-btn>
                  <div class="d-flex justify-center">{{ platformName | capitalize }}</div>
              </v-col>
            </ShareNetwork>
          </v-slide-item>
        </v-slide-group>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="green"
            @click="closeDialog"
            text
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import SocialMedia from '~/mixins/social-media'
export default {
  mixins: [SocialMedia],
  props: {
    store: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDialog: false,
      platforms: ['facebook','twitter', 'telegram', 'whatsapp']
    }
  },
  methods: {
    openDialog() {
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
    }
  }
}
</script>
<style scoped>
  a {
    color: black;
    text-decoration: none;
  }
</style>