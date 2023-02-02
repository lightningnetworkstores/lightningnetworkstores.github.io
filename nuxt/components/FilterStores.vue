<template>
  <v-list>
    <v-subheader class="title mb-3 filter-label">Filter</v-subheader>
    <favorites-store-filter />
    <v-text-field
      class="search tag-search-block p-10 mb-4"
      v-model="tagSearchQuery"
      flat
      outlined
      label="Type to search"
      solo
      prepend-inner-icon="mdi-magnify"
      hide-details
    ></v-text-field>
    <v-list-item
      v-for="(tag, index) in tags"
      :key="index"
      class="my-0 py-0 tag"
    >
      <div class="checkbox-container" :for="tag">
        <v-simple-checkbox
          :id="tag.name"
          color="#fdb919"
          :value="selectedTags.includes(tag.name)"
          @input="handleTagState(tag.name)"
          :indeterminate="excludeTags.includes(tag.name)"
          :class="{
            indeterminate: excludeTags.includes(tag.name),
          }"
          :ripple="false"
        />
        <span @click="handleTagState(tag.name)" class="tag-label clickable"
          >{{ tag.name }} ({{ tag.quantity }})</span
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
.tag-label {
  font-family: 'Roboto', Helvetica, Arial;
  color: rgba(0, 0, 0, 0.6);
}
.filter-label {
  height: 10px;
}
</style>

<script>
import { mapState } from 'vuex'
import FavoritesStoreFilter from './FavoritesStoreFilter.vue'

export default {
  components: {
    FavoritesStoreFilter,
  },
  props: {
    filterTags: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {
      tagSearchQuery: '',
      filteredByFavorites: false,
    }
  },

  computed: {
    ...mapState({
      excludeTags: (state) => state.excludedTags,

      selectedTags: (state) => state.selectedTags,
    }),

    tags() {
      if (this.tagSearchQuery) {
        return this.filterTags.filter(({ name }) => {
          return name.toLowerCase().includes(this.tagSearchQuery.toLowerCase())
        })
      }

      return this.filterTags.filter(({name}) => name != 'nostr')
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
  },
}
</script>
