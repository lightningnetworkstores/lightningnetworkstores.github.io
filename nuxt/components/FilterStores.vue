<template>
  <v-list>
    <v-subheader class="title pb-2">Filter</v-subheader>
    <!-- <v-text-field   hide-details  single-line class="pt-0 tag-search-block mt-3 mb-3">Search</v-text-field> -->
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
    <v-list-item v-for="(tag, index) in tags" :key="tag" class="my-0 py-0 tag">
      <v-checkbox
        @change="handleTagState(tag, index)"
        class="tag"
        color="#fdb919"
        :indeterminate="excludeTagsTest.includes(tag)"
        :class="{
          indeterminate: excludeTagsTest.includes(tag),
        }"
        :value="tag"
        :checked="selectedTagsTest.includes(tag)"
        :label="tag + ' ' + storeCountByTag(tag)"
      ></v-checkbox>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    searchQuery: '',
    selectedSort: '',
  },

  data() {
    return {
      tagSearchQuery: '',
    }
  },

  computed: {
    ...mapState({
      excludeTagsTest: (state) => state.excludedTags,

      selectedTagsTest: (state) => state.selectedTags,

      filteredTags: (state) => state.filteredTags,

      filteredStores: (state) => state.filteredStores,
    }),

    tags() {
      const tags =
        this.filteredTags.length !== 0
          ? this.filteredTags
          : this.$store.state.tags

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
      this.$store.dispatch('setSelectedTag2', { tag: value })
      this.$store.dispatch('setFilteredTags')
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

<style lang="scss" scoped></style>
