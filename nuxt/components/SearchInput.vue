<template>
  <div class="input-container d-flex align-center">
    <v-progress-circular
      indeterminate
      color="amber"
      class="mr-4"
      v-if="isLoading"
    ></v-progress-circular>
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
    >
    </v-text-field>
    <div class="text-center btn-pop">
      <v-btn rounded class="btn-pop mt-4 mt-lg-0" to="searches" color="#fcb919"
        >Popular Searches</v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false,
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
      this.$emit('click', arguments)
    },
  },
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 1264px) {
  .input-container {
    position: relative;
    .btn-pop {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
  }
}
</style>
