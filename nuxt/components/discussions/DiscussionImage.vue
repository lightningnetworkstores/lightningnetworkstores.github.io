<template>
  <v-dialog v-model="showDialog" max-width="500">
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
      <v-card class="mx-auto secondary">
        <v-img
          :lazy-src="url"
          :src="url"
        >
          <div class="d-flex justify-end">
            <v-btn @click="showDialog = false" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>            
          </div>
        </v-img>
      </v-card>
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
  }
}
</script>