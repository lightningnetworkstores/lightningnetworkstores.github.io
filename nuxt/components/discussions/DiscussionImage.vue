<template>
  <v-dialog v-model="showDialog" :max-width="maxWidth">
    <template v-slot:activator="{ on, attrs }">
      <v-img
        width="100%"
        max-height="100%"
        max-width="100%"
        aspect-ratio="1"
        position="center center"
        :lazy-src="url"
        :src="url"
        :style="{
          borderRadius: '5px',
        }"
        v-bind="attrs"
        v-on="on"
      >
      </v-img>
    </template>
    <v-card
      class="mx-auto secondary"
    >
      <v-img
        height="100%"
        contain
        :lazy-src="url"
        :src="url"
        object-fit="contain"
      >
      </v-img>
    </v-card>
    <v-btn @click="showDialog = false" fab fixed right top>
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-dialog>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showDialog: false
    }
  },
  computed: {
    maxWidth() {
      return "90vh";
    }
  }
}
</script>