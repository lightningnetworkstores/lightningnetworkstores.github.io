<template>
  <v-list>
    <v-subheader class="title pb-2">Filter</v-subheader>
    <v-text-field
      class="search tag-search-block p-10"
      v-model="tagSearchQuery"
      flat
      outlined
      label="Type to search"
      solo
      prepend-inner-icon="mdi-magnify"
      hide-details
    ></v-text-field>
    <br />
    <br />
    <v-list-item
      v-for="(tag, index) in tags"
      :key="index"
      class="my-0 py-0 tag"
    >
      <div class="checkbox-container" :for="tag">
        <v-simple-checkbox
          :id="tag"
          color="#fdb919"
          :value="selectedTags.includes(tag)"
          @input="handleTagState(tag)"
          :indeterminate="excludeTags.includes(tag)"
          :class="{
            indeterminate: excludeTags.includes(tag),
          }"
          :ripple="false"
        />
        <span @click="handleTagState(tag)" class="clickable"
          >{{ tag }} ({{ filterTags[tag] }})</span
        >
      </div>
    </v-list-item>
  </v-list>
</template>

<style scoped>
.checkbox-container {
  display: flex;
}
.clickable {
  cursor: pointer;
}
.v-list-item {
  min-height: 0;
}
</style>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    filterTags: {
      type: Object,
      default: {},
    },
  },

  data() {
    return {
      tagSearchQuery: '',
    }
  },

  computed: {
    ...mapState({
      excludeTags: (state) => state.excludedTags,

      selectedTags: (state) => state.selectedTags,
    }),

    tags() {
      const tags = Object.keys(this.filterTags).sort(
        (tag1, tag2) => this.filterTags[tag2] - this.filterTags[tag1]
      )

      if (this.tagSearchQuery) {
        return tags.filter((tag) => {
          return tag.toLowerCase().includes(this.tagSearchQuery.toLowerCase())
        })
      }

      return tags
    },
  },

  methods: {
    handleTagState(value) {
      if (this.selectedTags.includes(value)) {
        this.$store.dispatch('unsetSelectedTag', value)
        this.$store.dispatch('setExcludedTag', value)
      } else if (this.excludeTags.includes(value)) {
        this.$store.dispatch('unsetExcludedTag', value)
      } else {
        this.$store.dispatch('setSelectedTag', value)
      }
    },

    storeCountByTag(tag) {
      let count = 0
      this.filteredStores.forEach((item) => {
        if (item.tags.includes(tag)) {
          count++
        }
      })

      return count
    },
  },
}
</script>
