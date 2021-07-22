<template>
  <div class="input-container">
    <v-text-field
      v-model="searchQuery"
      class="search"
      flat
      outlined
      label="Type to search"
      solo
      prepend-inner-icon="mdi-magnify"
      hide-details
      :append-icon="$vuetify.breakpoint.lgAndUp ? '' : 'mdi-filter'"
      @click:append="inputClick"
    ></v-text-field>
    <v-btn rounded class="btn-pop" to="searches" color="#fcb919"
      >Popular Searches</v-btn
    >
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    searchQuery: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
  methods: {
    inputClick() {
      this.$$emit('click', arguments)
    },
  },
}
</script>

<style lang="scss" scoped>
.input-container {
  position: relative;
  .btn-pop {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
}
</style>
