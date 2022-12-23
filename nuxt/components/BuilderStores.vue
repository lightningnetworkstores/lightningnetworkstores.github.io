<template>
  <div class="mx-3 mt-3 py-2">
    <div
      :class="[
        isMobile ? 'justify-center' : 'justify-space-between',
        'd-flex align-center',
      ]"
    >
      <h2>Builder</h2>
      <v-tooltip v-if="loginStatus.isAdmin" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            elevation="2"
            fab
            v-bind="attrs"
            v-on="on"
            color="#fcb919"
            small
            @click="hideForm = !hideForm"
          >
            <v-icon> mdi-plus </v-icon>
          </v-btn>
        </template>
        <span>Add Builder</span>
      </v-tooltip>
    </div>

    <v-card v-if="hideForm" class="mt-3 pa-md-2 text-right">
      <user-search @userSelected="handleUserSelected" />
      <div v-if="loginStatus.isAdmin" class="text-end">
        <v-btn color="#fcb919" @click="addBuilders">Add</v-btn>
      </div>
    </v-card>

    <div :class="[isMobile ? 'justify-center' : '', 'd-flex flex-wrap mt-3']">
      <v-tooltip v-for="avatar of builderStore" :key="avatar.id" bottom>
        <template v-slot:activator="{ on, attrs }">
          <div
            :style="{
              position: 'relative',
            }"
          >
            <v-avatar class="mt-2 ma-1" v-bind="attrs" v-on="on">
              <img :src="avatar.image" :alt="avatar.name" />
            </v-avatar>
            <v-btn
              v-if="loginStatus.isAdmin"
              :style="{
                position: 'absolute',
                top: 0,
                left: '37px',
                zIndex: 1,
                width: '24px',
                height: '24px',
              }"
              fab
              elevation="2"
              dark
              color="error"
              @click="deleteBuilders(avatar.id)"
            >
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>
        </template>
        <span>@{{ avatar.handle }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    paramsId: {
      type: String,
      default: '',
    },
    storeId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      userBuilder: null,
      hideForm: false,
    }
  },
  computed: {
    ...mapState(['builderStore', 'loginStatus']),
    isMobile() {
      return this.$vuetify.breakpoint.name === 'xs'
    },
  },
  methods: {
    handleUserSelected(recipient) {
      this.userBuilder = recipient
    },
    async getBuilders() {
      await this.$store.dispatch('getStoreBuilder', { id: this.paramsId })
    },
    async addBuilders() {
      try {
        const dataBuilder = await this.$axios.post(
          `/api/builder?storeID=${this.storeId}&userID=${this.userBuilder.value}`
        )

        if (dataBuilder.data.status === 'success') {
          await this.getBuilders()
        }
      } catch (error) {
        console.error(error)
      }
    },
    async deleteBuilders(avatarId) {
      try {
        const dataBuilder = await this.$axios.delete(
          `/api/builder?storeID=${this.storeId}&userID=${avatarId}`
        )

        if (dataBuilder.data.status === 'success') {
          await this.getBuilders()
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style></style>
