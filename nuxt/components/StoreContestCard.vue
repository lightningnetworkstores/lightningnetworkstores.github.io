<template>
  <v-card
    :disabled="disabled"
    hover
    class="d-flex flex-column justify-space-between"
    :class="{'selected-card': selected}"
  >
    <v-card-text class="pa-0">
      <div class="detail">
        <div>
          <v-img
            :aspect-ratio="4 / 3"
            max-height="200px"
            :src="`${baseURL}thumbnails/${store.id}.jpg`"
            class="text-right"
            @click.native="gotoStore(store)"
          />
        </div>

        <div class="pa-2 pl-5">
          <div @click="gotoStore(store)">
            <div class="mb-2 title">
              <a
                :href="getStoreLink(store.href)"
                class="font-weight-regular text-h5"
              >
                {{ store.name }}
                <v-icon class="ml-1" color="blue darken-2"
                  >mdi-open-in-new</v-icon
                >
              </a>
            </div>
            <div class="description">{{ store.description }}</div>
          </div>
          <div>
            <div class="tag-container">
              <v-chip
                v-if="store.tags[0]"
                color="primary"
                outlined
                small
                class="mr-2 my-1"
              >
                <b
                  @click="updateTagSearch(store.tags[0], 0)"
                  class="tag-link"
                  >{{ store.tags[0] }}</b
                >
              </v-chip>
              <v-menu
                open-on-click
                top
                offset-y
                v-if="store.tags.length > 1"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    v-bind="attrs"
                    v-on="on"
                    color="primary"
                    outlined
                    small
                    class="mr-2 my-1"
                  >
                    <b
                      >+{{ store.tags.length - 1 }} tag{{
                        store.tags.length - 1 == 1
                          ? ''
                          : 's'
                      }}</b
                    >
                  </v-chip>
                </template>

                <v-list>
                  <v-list-item
                    v-for="(tag, index) in store.tags.slice(
                      1,
                      5
                    )"
                    :key="index"
                    class="my-0 tags-container"
                  >
                    <v-chip
                      color="primary"
                      outlined
                      small
                      class="mr-2 my-0"
                    >
                      <b
                        @click="
                          updateTagSearch(tag, index)
                        "
                        class="tag-link"
                        >{{ tag }}</b
                      >
                    </v-chip>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        color="blue-grey"
        class="mx-2 white--text"
        style="min-width: 10em"
        :disabled="selected"
        @click="voteStore"
      >
        <v-icon left dark> fa-badge-check </v-icon>
        {{ selected ? 'voted' : 'vote' }}
      </v-btn>
      <v-spacer></v-spacer>
      <place-bet-button
        contestType="store" 
        :contestId="contestId"
        :minAmount="minBet"
        :choice="store.id"
        :isLogged="isLogged"
      /> 
    </v-card-actions>
    <blocked-voter-modal
      :isOpen.sync="openBlockedVoterModal"
    />
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import VoteButton from './VoteButton.vue'
import LikeStoreButton from './LikeStoreButton.vue'

export default {
  props: ['store', 'disabled', 'contestId', 'selected', 'minBet', 'isLogged'],
  components: { VoteButton, LikeStoreButton },
  data() {
    return {
      openBlockedVoterModal: false
    }
  },
  computed: {
    ...mapState(['loginStatus', 'baseURL']),
    isVoter() {
      return this.loginStatus?.user?.voter
    }
  },
  methods: {
    getStoreLink(link) {
      const url = new URL(link)
      const baseUrl = new URL(this.baseURL)
      url.searchParams.append('utm_source', baseUrl.host)
      return url.toString()
    },
    gotoStore(store) {
      const { id, rootUrl } = store

      this.$route.meta.storeId = id
      this.$router.push('/store/' + rootUrl)
    },
    voteStore() {
      if (!this.checkUserLogged()) return;

      if (this.isVoter) {
        this.$store.dispatch('choseOption', {
          contestID: this.contestId,
          choice: this.store.id,
        })
      } else {
        this.openBlockedVoterModal = true
      }
    },
    checkUserLogged() {
      if (this.isLogged) return true

      this.$store.dispatch('modals/openSettingsModal')

      return false ;
    }
  },
}
</script>

<style scoped>
.title {
  min-height: 50px;
  max-height: 50px;
}
.description {
  min-height: 40px;
}

.tag-container {
  min-height: 30px;
}
.selected-card {
  background: '#FFFDE7';
  box-shadow: 0 0 20px rgba(11, 67, 236, 0.9) !important;
  -webkit-box-shadow: 0 0 20px rgba(38, 85, 223, 0.9) !important;
}
</style>
