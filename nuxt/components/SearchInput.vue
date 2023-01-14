<template>
  <div
    :class="{
      'input-container d-flex align-center': true,
      'flex-column': !$vuetify.breakpoint.lgAndUp,
    }"
  >
    <v-progress-circular
      indeterminate
      color="amber"
      class="mr-4"
      v-if="isLoading"
    ></v-progress-circular>
    <div class="d-flex align-center wSearch">
      <v-text-field
        v-model="searchQuery"
        class="search limitSearch"
        flat
        outlined
        label="Type to search"
        solo
        prepend-inner-icon="mdi-magnify"
        hide-details
        v-resize="onResizeWidth"
      >
        <template v-slot:append>
          <v-btn
            rounded
            :class="!showTextButton ? 'd-none' : ''"
            to="searches"
            color="#fcb919"
            v-if="windowSizeX < 720"
            @mouseover="onMouseText"
            @mouseleave="onMouseTextOut"
          >
            <span v-if="showTextButton">Popular Searches</span>
            <v-icon v-else color="secondary">mdi-magnify</v-icon>
          </v-btn>
          <v-btn
            rounded
            class="btn-pop mt-lg-0"
            to="searches"
            color="#fcb919"
            v-else
            >Popular Searches</v-btn
          >
        </template>
      </v-text-field>
      <v-btn
        fab
        class="mx-3 buttonFilter"
        v-if="isMobile"
        @click="inputClick"
        elevation="2"
      >
        <v-icon color="secondary">mdi-filter</v-icon>
      </v-btn>
    </div>
    <!--div class="text-center btn-pop">
      <v-btn
        rounded
        class="btn-pop mt-4 mt-lg-0"
        to="searches"
        color="#fcb919"
        >Popular Searches</v-btn
      >
    </div-->
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
  data() {
    return {
      windowSizeX: 0,
      showTextButton: false,
    }
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
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
  },
  methods: {
    inputClick() {
      this.$emit('click', arguments)
    },
    onResizeWidth() {
      this.windowSizeX = window.innerWidth
    },
    onMouseText() {
      this.showTextButton = true
    },
    onMouseTextOut() {
      this.showTextButton = false
    },
  },
  mounted() {
    this.onResizeWidth()
  },
}
</script>

<style lang="scss" scoped>
.wSearch {
  width: 100%;
  max-width: 100%;
  position: relative;
  & .v-text-field {
    // Input component/icons (above details)
    .v-input__slot {
      width: 66%;
      max-width: 66% !important;
    }
  }
}

.buttonFilter {
  margin-right: 0px !important;
}

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
