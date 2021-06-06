<template>
  <div class="ban-store-modal">
    <v-btn text icon color="grey darken-2" @click.stop="showBanDialog = true">
      <v-icon>fa-ban</v-icon>
    </v-btn>

    <!-- Ban store modal -->
    <v-dialog v-model="showBanDialog" max-width="500" persistent>
      <v-form @submit.prevent="submitBan" ref="banform">
        <v-card>
          <v-card-title class="headline"
            >Suggest banning {{ store.name }}</v-card-title
          >
          <v-card-text>
            <v-layout row>
              <v-flex pl-3 pr-3>
                <v-textarea
                  v-model="banDialogForm.motivation"
                  label="Motivation"
                  hint="eg. Its a scam! Because..."
                  :rules="[(v) => !!v || 'Motivation is required']"
                >
                </v-textarea>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="showBanDialog = false">
              Cancel
            </v-btn>

            <v-btn color="green darken-1" text type="submit"> Submit </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-snackbar v-model="banSnackbar" color="info" :timeout="3000">
      Ban suggestion recorded
      <template v-slot:action="{ attrs }">
        <v-btn dark text @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
export default {
  props: ['store'],
  data() {
    return {
      showBanDialog: false,
      banDialogForm: { motivation: '' },
      banSnackbar: false,
    }
  },

  methods: {
    submitBan() {
      this.$refs.banform.validate()
      if (this.store.id && this.store.name && this.banDialogForm.motivation) {
        this.$store
          .dispatch('suggestBan', {
            id: this.store.id,
            name: this.store.name,
            message: this.banDialogForm.motivation,
          })
          .then(
            (response) => {
              this.banDialogForm.motivation = ''
              this.showBanDialog = false
              this.banSnackbar = true
            },
            (error) => {
              console.error(error)
            }
          )
      }
    },
  },
}
</script>

<style scoped lang="scss">
</style>
