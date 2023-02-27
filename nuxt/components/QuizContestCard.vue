<template>
    <v-card
        hover
        class="quizCard"
        :class="{ selected: selected }"
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
.selected {
    box-shadow: 0px 0px 10px 0px #00e1ff;
}

.quizCard {
    width: 100%;
}
</style>
