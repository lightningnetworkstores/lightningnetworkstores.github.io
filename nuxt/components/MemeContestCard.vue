<template>
  <v-card
    hover
    class="d-flex flex-column justify-space-between"
  >
    <v-img
      :aspect-ratio="4 / 3"
      max-height="200px"
      :src="url"
      class="text-right"
    />
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        text
        color="blue-grey"
        class="mx-2 white--text"
        style="min-width: 10em"
        :disabled="selected"
      >
        <v-icon left dark> fa-badge-check </v-icon>
        {{ selected ? 'chosen' : 'chose' }}
      </v-btn>
      <v-btn
        text
        color="orange darken-1"
        class="ma-2 white--text"
        @click="showBetModal = true"
      >
        <v-icon left dark> fa-bitcoin </v-icon>
        Place a bet
      </v-btn>
    </v-card-actions>
    <place-bet-modal
      :isOpen.sync="showBetModal"
      :contestId="id"
      :option="id"
      :minAmount="20"
      type="store"
    />
  </v-card>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required:true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showBetModal: false
    }
  }
}
</script>