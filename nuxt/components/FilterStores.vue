<template>
  <div>
    <v-list-item v-for="(tag, index) in tags" :key="tag" class="my-0 py-0 tag">
      <v-checkbox
        hide-details
        @change="selectDeselectTag(tag, index)"
        class="tag"
        color="#fdb919"
        :indeterminate="excludeTag[index].status"
        :class="{ indeterminate: excludeTag[index].status }"
        :value="tag"
        :label="tag + ' ' + storeCountByTag(tag)"
        v-model="tagsCheckbox"
      ></v-checkbox>
    </v-list-item>
  </div>
</template>

<script>
export default {
  props: {
    tagSearchQuery: '',
    searchQuery: '',
    selectedSort: '',
  },
  computed: {
    excludeTag() {
      const excude = []
      this.tags.forEach((e, i) => {
        if (this.excludedTag.includes(e)) {
          this.excludedTag.includes(e)
          console.log(this.excludedTag, e)
          excude.push({ status: true })
        } else {
          excude.push({ status: false })
        }
      })
      return excude
    },
    stores() {
      return this.$store.state.stores
    },
    tags() {
      let tags = this.$store.state.tags
      if (this.tagSearchQuery) {
        return tags.filter((tag) => {
          return tag.toLowerCase().includes(this.tagSearchQuery.toLowerCase())
        })
      }

      return tags
    },
  },
  data() {
    return {
      checkedTags: [],
      excludedTag: [],
      tagsCheckbox: [],
    }
  },
  methods: {
    selectDeselectTag(value, i) {
      console.log({ value, index: i })

      let index = this.checkedTags.indexOf(value)
      if (index !== -1) {
        this.checkedTags.splice(index, 1)
      } else {
        this.checkedTags.push(value)
      }

      if (!this.tagsCheckbox.includes(value)) {
        if (this.excludeTag[i].status) {
          this.excludeTag[i].status = false
        } else {
          this.excludeTag[i].status = true
          this.excludedTag.push(value)
        }

        this.checkedTags.splice(index, 1)
      } else {
        if (this.excludedTag.includes(value)) {
          let index1 = this.tagsCheckbox.indexOf(value)
          this.tagsCheckbox.splice(index1, 1)
          let index2 = this.excludedTag.indexOf(value)
          this.excludedTag.splice(index2, 1)
          this.excludeTag[i].status = false
          let index = this.checkedTags.indexOf(value)
          if (index !== -1) {
            this.checkedTags.splice(index, 1)
          }
        }
      }

      // 1 - agregar un action para esto
      // 1.1 agregar logica en el action para agregar el tag
      // 1.2 verifcar los stores
      this.$store.commit(
        'setSelectedTags',
        this.checkedTags.filter((t) => t)
      )

      // 2 - agregar un action para esto
      this.$store.commit(
        'setExludedTags',
        this.excludedTag.filter((t) => t)
      )
      this.changeQuery()
    },
    storeCountByTag(tag) {
      let count = 0
      this.stores.forEach((item) => {
        if (item.tags.includes(tag)) {
          count++
        }
      })

      return count
    },
    changeQuery() {
      let query = {}
      if (this.checkedTags.filter((x) => x).length) {
        query.tags = this.checkedTags.filter((x) => x).join(',')
      }

      if (this.excludedTag.filter((x) => x).length) {
        query.exclude = this.excludedTag.filter((x) => x).join(',')
      }
      if (this.selectedSort && this.selectedSort != 'best') {
        query.sort = encodeURIComponent(this.selectedSort)
      }
      if (this.searchQuery.length) {
        query.search = encodeURIComponent(this.searchQuery)
      }
      if (this.safeMode) {
        query.safemode = this.safeMode ? this.safeMode.toString() : 'false'
      }

      this.$emit('onQueryChange', query)
    },
  },
  watch: {
    selectedSort() {
      this.changeUrl()
    },
    searchQuery() {
      this.changeUrl()
    },
  },
}
</script>

<style lang="scss" scoped></style>
