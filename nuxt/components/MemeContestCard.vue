<template>
  <v-card
    hover
    class="d-flex flex-column justify-space-between"
    width="350px"
  >
    <discussion-image
      :url="url"
    />
    <v-card-actions>
      <v-btn
        text
        color="blue-grey"
        class="mx-2 white--text"
        style="min-width: 10em"
        :disabled="selected"
        @click="voteMeme"
      >
        <v-icon left dark> fa-badge-check </v-icon>
        {{ selected ? 'voted' : 'vote' }}
      </v-btn>
      <v-spacer></v-spacer>
      <place-bet-button
        contestType="meme" 
        :contestId="contestId"
        :minAmount="20"
        :choice="id"
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
import DiscussionImage from '~/components/discussions/DiscussionImage.vue'
export default {
  components: { DiscussionImage },
  props: {
    url: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required:true
    },
    selected: {
      type: Boolean,
      default: false
    },
    contestId: {
      type: Number,
      required: true
    },
    isLogged: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      openBlockedVoterModal: false
    }
  },
  computed: {
    ...mapState(['loginStatus']),
    isVoter() {
      return this.loginStatus?.user?.voter
    }
  },
  methods: {
    voteMeme() {
      if (!this.checkUserLogged()) return;

      if (this.isVoter) {
        this.$store.dispatch('voteMeme', {
          contestID: this.contestId,
          choice: this.id,
        })
      } else {
        this.openBlockedVoterModal = true
      }
    },
    checkUserLogged() {
      if (this.isLogged) return true

      this.$store.dispatch('modals/openSettingsModal')

      return false ;
    },
  }
}
</script>
