<template>
  <div class="">
    <v-btn color="secondary" fab x-small dark class="mt-2">
      <v-icon class="float-left" @click.stop="showTutorialDialog = true"
        >fa-question</v-icon
      >
    </v-btn>
    <!-- <v-icon @click.stop="showTutorialDialog = true">help</v-icon> -->

    <!-- Ban store modal -->
    <v-dialog
      v-model="showTutorialDialog"
      max-width="800"
      :dark="$vuetify.theme.dark"
    >
      <template v-if="showTutorialDialog">
        <v-card class="pa-2">
          <v-card-title class="headline"
            >How to use LightningNetworkStores.com</v-card-title
          >

          <v-carousel :cycle="false" :light="!$vuetify.theme.dark">
            <v-carousel-item>
              <p class="pl-3 pt-3 pr-3 subheading">
                1. This website lists stores that accept bitcoin through the
                lightning network. Any user can vote up or down on the stores
                listed. To actively participate you should have a
                <a :href="`${baseUrl}wallets`"
                  >lightning-enabled bitcoin wallet</a
                >.
              </p>
              <v-img :src="`${baseUrl}tutorial/video1.gif`" alt="" />
            </v-carousel-item>
            <v-carousel-item>
              <p class="pl-3 pt-3 pr-3 subheading">
                2. Anyone can add a store that accepts bitcoin through
                lightning. The store is tweeted after being added.
              </p>
              <v-img :src="`${baseUrl}tutorial/video2.gif`" alt="" />
            </v-carousel-item>
            <v-carousel-item>
              <p class="pl-3 pt-3 pr-3 subheading">
                3. Users can suggest updates on the store information, this
                update can be accepted by the website owner.
              </p>
              <v-img :src="`${baseUrl}tutorial/video3.gif`" alt="" />
            </v-carousel-item>
          </v-carousel>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              text
              @click="showTutorialDialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
//@ts-ignore
// import VuetifyLazyImage from 'vuetify-lazy-image'

export default {
  components: {
    // VuetifyLazyImage,
  },
  data() {
    return {
      showTutorialDialog: false,
      baseUrl: '',
    }
  },

  mounted() {
    this.baseUrl = this.$nuxt.isDev
      ? 'https://lightningnetworkstores.com:8443/'
      : 'https://lightningnetworkstores.com/'
  },
}
</script>

<style scoped></style>
