<template>
  <v-container class="mb-0 pb-0">
    <v-row>
      <v-col :cols="isMobile ? 12 : 7">
        <div class="text-h6 font-weight-bold" style="flex-grow: 1"
          :inner-html.prop="discussionHeader.title"
        />
        <div
          class="text-body-1 comment-title"
          :inner-html.prop="discussionHeader.comment | toHtml | tagUser"
        />
      </v-col>
      <v-col :cols="isMobile ? 0 : 5" class="d-flex flex-row justify-end mr-0 pr-0">
        <div v-if="discussionHeader.store" class="flex-grow-1">
          <StorePreview class="hidden-sm-and-down" :store="discussionHeader.store"/>
        </div>
        <div class="d-flex justify-end flex-grow-0" style="min-width: 3em">
          <v-chip x-small class="mx-0 px-1">
            <v-icon class="mr-1">mdi-message-reply</v-icon>
            {{ repliesCount }}
          </v-chip>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import StorePreview from './StorePreview'
export default {
  components: {
    StorePreview
  },
  props: {
    discussionHeader: {
      type: Object,
      required: true
    },
    repliesCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    }
  }
}
</script>