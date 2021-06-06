<template>
  <div class="ban-store-modal">
    <v-btn text icon color="grey darken-2" @click.stop="showEmbedDialog = true">
      <v-icon>fa-code</v-icon>
    </v-btn>
    <!-- Ban store modal -->
    <v-dialog v-model="showEmbedDialog" max-width="500">
      <v-form @submit.prevent="submitBan" ref="banform">
        <v-card>
          <v-card-title class="headline">Embed code</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="pa-3">
                <img
                  src="@/assets/images/snippet.svg"
                  height="50px"
                  style="cursor: pointer"
              /></v-col>
              <v-col cols="12" class="pa-3">
                <v-text-field
                  :value="html"
                  label="html snippet"
                  type="text"
                  id="embedhtml"
                  ref="embedhtml"
                  append-icon="fa-copy"
                  @click:append="copy"
                ></v-text-field>
                <!-- append-icon="fa-copy" -->
                <!-- @click:append="copy" -->
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="showEmbedDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script lang="ts">
export default {
  props: ['store'],
  data() {
    return {
      html: null,
      showEmbedDialog: false,
    }
  },
  computed: {
    baseURL() {
      return this.$store.state.baseURL
    },
  },

  methods: {
    copy() {
      this.$refs.embedhtml.focus()

      document.execCommand('SelectAll')
      document.execCommand('copy')
    },
  },
  mounted() {
    this.html = `<div id="lns-snippet"><a href="${this.baseURL}store/${this.store.id}"><img src="${this.baseURL}img/snippet.svg" height="45px"></a></div>`
  },
}
</script>

<style scoped lang="scss">
</style>
