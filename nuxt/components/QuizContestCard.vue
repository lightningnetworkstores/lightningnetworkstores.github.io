<template>
    <v-card
        hover
        class="quizCard"
        :class="{ 'selected-card' : selected }"
    >
        <v-card-title>{{ option }}</v-card-title>
        <v-card-actions>
            <v-btn
                text
                color="blue-grey"
                class="mx-2 white--text"
                :disabled="selected"
                @click="chooseOption"
            >
                <v-icon left dark> mdi-star </v-icon>
                {{ selected ? 'chosen' : 'chose' }}
            </v-btn>
          <v-spacer></v-spacer>
          <place-bet-button
            contestType="quiz" 
            :contestId="contestId"
            :minAmount="minBet"
            :choice="option"
            :isLogged="isLogged"
          />
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: ['option', 'isLogged', 'contestId', 'selected', 'minBet'],
    data() {
        return {
            openAmountModal: false,
        }
    },

    computed: {},

    methods: {
        chooseOption() {
            this.checkUserLogged() && this.$store
                .dispatch('choseOption', {
                    contestID: this.contestId,
                    choice: this.option,
                })
                .then(() => {
                    this.$store.dispatch('getQuizContest')
                })
        },
        checkUserLogged() {
          if (this.isLogged) return true

          this.$store.dispatch('modals/openSettingsModal')

          return false ;
        }
    },
}
</script>

<style>
.quizCard {
    width: 100%;
}
.selected-card {
  background: '#FFFDE7';
  box-shadow: 0 0 20px rgba(11, 67, 236, 0.9) !important;
  -webkit-box-shadow: 0 0 20px rgba(38, 85, 223, 0.9) !important;
}
</style>
