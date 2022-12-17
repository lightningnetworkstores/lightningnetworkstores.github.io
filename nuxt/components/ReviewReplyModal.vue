<template>
  <div class="text-center">
    <v-dialog max-width="500" v-model="showDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon small color="primary">
            mdi-message-text
          </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>Add reply</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="comment"
                  outlined
                  dense
                  label="Enter text"
                  required
                  hide-details
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="showDialog = false" text>
            Close
          </v-btn>
          <v-btn color="green" @click="handleSubmit" text>
            Submit
          </v-btn>
        </v-card-actions>
        <v-progress-linear v-if="isPosting" indeterminate/>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    parent: {
      type: String,
      required: true
    },
    storeId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      comment: '',
      showDialog: false
    }
  },
  methods: {
    async handleSubmit() {
      const body = {
        comment: this.comment,
        storeID: this.storeId,
        parent: this.parent
      }
      try {
        await this.$store.dispatch('review/postReview', body)
      } finally {
        this.showDialog = false
      }
    }
  },
  computed: {
    ...mapState('review', ['isPosting'])
  }
}
</script>