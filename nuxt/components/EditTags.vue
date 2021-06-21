<template>
  <v-row class="pa-2">
    <v-col class="pb-1">
      <v-hover v-for="(tag, index) in store.tags" :key="index">
        <v-chip
          slot-scope="{ hover }"
          color="primary"
          outlined
          class="mr-1 mb-1"
        >
          <v-icon
            v-if="hover"
            left
            class="tag-icon mr-1"
            @click="upvoteTag(tag)"
            >mdi-plus-circle</v-icon
          ><b>{{ tag }}</b>
          <v-icon
            v-if="hover"
            right
            class="tag-icon ml-1"
            @click="downvoteTag(tag)"
          >
            mdi-minus-circle
          </v-icon>
        </v-chip>
      </v-hover>
      <v-hover
        v-for="(likely_tag, index) in store.likely_tags"
        :key="'tag-' + index"
      >
        <v-chip slot-scope="{ hover }" color="grey lighten-1" outlined>
          <v-icon
            v-if="hover"
            left
            class="tag-icon mr-1"
            @click="upvoteTag(likely_tag)"
            >mdi-plus-circle</v-icon
          >{{ likely_tag }}
          <v-icon
            v-if="hover"
            right
            class="tag-icon ml-1"
            @click="downvoteTag(likely_tag)"
          >
            mdi-minus-circle
          </v-icon>
        </v-chip>
      </v-hover>

      <v-chip color="primary" outlined class="mb-1">
        <b>new tag</b>
        <v-icon right class="tag-icon ml-1" @click="showAddTagDialog = true">
          mdi-plus-circle
        </v-icon>
      </v-chip>

      <v-snackbar v-model="snackbar" class="m-3">
        {{ snackbarText }}

        <v-btn color="red" text @click="snackbar = false"> Close </v-btn>
      </v-snackbar>
    </v-col>

    <!-- Add store modal -->
    <v-dialog v-model="showAddTagDialog" max-width="500" persistent>
      <v-card>
        <!-- paymentRequest && isPaid -->
        <v-card-title class="headline">
          <v-row>
            <v-col>Suggest new tags</v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pb-0 pt-3">
          <v-form @submit.prevent="suggestTags" ref="suggestTagForm">
            <v-row>
              <v-col class="pa-0">
                <v-combobox
                  v-model="newTags"
                  :items="store.configuration.tags"
                  :search-input.sync="search"
                  hide-selected
                  label="Add some tags"
                  multiple
                  persistent-hint
                  small-chips
                  :rules="[(v) => !!v.length || 'Required']"
                >
                  <template v-slot:no-data>
                    <v-list-tile-content>
                      <v-list-tile-title class="px-2"
                        >No results matching "<strong>{{ search }}</strong
                        >". Press <kbd>enter</kbd> to create a new
                        one</v-list-tile-title
                      >
                    </v-list-tile-content>
                  </template>
                </v-combobox>
              </v-col>
            </v-row>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="green darken-1"
                text
                large
                @click="showAddTagDialog = false"
              >
                Close
              </v-btn>

              <v-btn color="green darken-1" text large type="submit">
                Submit
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ['store'],
  data() {
    return {
      search: '',
      snackbarText: '',
      snackbar: false,
      newTags: [],
      showAddTagDialog: false,
      tagSuggestText: 'Tag submitted',
      tagUpvoteText: 'Tag upvoted',
      tagDownvoteText: 'Tag downvoted',
    }
  },
  methods: {
    upvoteTag(tag) {
      this.$store
        .dispatch('suggestTag', { storeId: this.store.id, tag: tag })
        .then(
          (response) => {
            this.snackbarText = this.tagUpvoteText
            this.snackbar = true
          },
          (error) => {
            console.error(error)
          }
        )
    },

    downvoteTag(tag) {
      this.$store
        .dispatch('removeTag', { storeId: this.store.id, tag: tag })
        .then(
          (response) => {
            this.snackbarText = this.tagDownvoteText
            this.snackbar = true
          },
          (error) => {
            console.error(error)
          }
        )
    },

    suggestTags() {
      if (this.$refs.suggestTagForm.validate()) {
        this.$store
          .dispatch('suggestTags', {
            storeId: this.store.id,
            tags: this.newTags,
          })
          .then(
            (response) => {
              this.snackbarText = this.tagSuggestText
              this.snackbar = true
              this.showAddTagDialog = false
            },
            (error) => {
              console.error(error)
            }
          )
      }
    },
  },
}
</script>
