<template>
  <v-row class="pa-2">
    <v-col class="pb-1">
      <div
        v-if="editingSelectedStore && tagScore"
        class="my-2 d-flex align-center"
      >
        <b class="mr-1">Sum of tag scores:</b>
        <span>{{ tagScore.total }}</span>
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              color="white"
              fab
              x-small
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-information-outline</v-icon>
            </v-btn>
          </template>
          <span>A tag is good if it's used by a small group of projects. 
            A tag that is assigned to all projects or just one is not good as it doesn't provide any information that helps classify that project. 
            Tags are now colored according to this metric, red meaning the tag is too frequent or only used once; and green meaning a tag that is very useful because is used a few times. 
            NOTE: This is an experimental metric, it can't tell you if the tag is a well fit for that project. It only tells you how good it is according to its frequency. A store having
            multiple red tags is not a problem, but missing a green tag is a bad sign. If you create a tag that was never used before, it will be red and that's OK as long as it's not redundant. However, if that new tag is also assigned to another similar project, the tag 
            will become green.</span>
        </v-tooltip>
      </div>
      <v-hover v-for="(tag, index) in store.tags" :key="index">
        <v-chip
          slot-scope="{ hover }"
          :color="getTagColor({ tagName: tag, defaultColor: 'primary' })"
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
        <v-chip
          slot-scope="{ hover }"
          :color="getTagColor({ tagName: likely_tag, defaultColor: 'grey lighten-1' })"
          outlined
        >
          <v-icon
            v-if="hover"
            left
            class="tag-icon mr-1"
            @click="upvoteTag(likely_tag)"
            >mdi-plus-circle</v-icon
          ><b>{{ likely_tag }}</b>
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
import { mapState } from 'vuex'

export default {
  props: [
    'store',
    'isEditingStore',
  ],
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
      tagScore: undefined,
    }
  },
  computed: {
    ...mapState([
      'editingSelectedStore',
    ]),
  },
  watch: {
    editingSelectedStore: {
      async handler (isEditing) {
        if (isEditing) {
          this.tagScore = await this.$store.dispatch('getTagScore', {
            storeId: this.store.id
          })
        }
      },
      immediate: true,
    },
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

    getTagColor ({ tagName, defaultColor }) {
      if (this.editingSelectedStore && this.tagScore) {
        const score = this.tagScore.tags[tagName] || 0
        const maxPossibleScore = 50
        const normalizedScore = Math.min(maxPossibleScore, score)
        const percentage = normalizedScore / maxPossibleScore
        const red = Math.floor((1 - percentage) * 255)
        const green = Math.floor(percentage * 255)
        return `rgba(${red}, ${green}, 0, 1)`
      } else {
        return defaultColor
      }
    },
  },
}
</script>
