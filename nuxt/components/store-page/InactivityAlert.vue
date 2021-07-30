<template>
    <v-layout v-if="isDead" mb-4>
        <v-flex>
            <v-alert
                type="error"
                transition="scale-transition"
                class="mb-0"
            >
                This project is dead or currently inactive.
            </v-alert>
        </v-flex>
         <v-snackbar v-model="snackbar" class="m-3">
                Suggestion recorded.
            <v-btn color="red" text @click="snackbar = false"> Close </v-btn>
      </v-snackbar>
    </v-layout>
    <v-layout v-else-if="isFlagged" mb-4>
        <v-flex>
            <v-alert
                type="error"
                transition="scale-transition"
                class="mb-0"
            >
                This project is flagged for removal. Is it dead? - <a @click="removalOpinion('dead', true)">yes</a> ///// <a @click="removalOpinion('dead', false)">no</a>. 
                Did it stop accepting bitcoin though the lightning network? - <a @click="removalOpinion('btcln', true)">yes</a> ///// <a @click="removalOpinion('btcln', false)">no</a>.
            </v-alert>
        </v-flex>
        <v-snackbar v-model="snackbar" class="m-3">
                Suggestion recorded.
            <v-btn color="red" text @click="snackbar = false"> Close </v-btn>
      </v-snackbar>
    </v-layout>
</template>

<script>

export default {
    props: {
        inactivityData: {
            type: Object,
            default: () => {return {dead: false, flagged: false}}
        }
    },
    data(){ return{
        snackbar: false
    }
    },
    computed: {
        isDead() {
            return this.inactivityData && this.inactivityData.dead
        },
        isFlagged() {
            return this.inactivityData && this.inactivityData.flagged
        },
    },
    methods: {
        removalOpinion(opinion, remove){
             this.$axios.post(`${this.$store.state.baseURL}api/removal?storeID=${this.$store.state.selectedStore.id}&opinion=${opinion}&remove=${remove}`)
             .then(response => {
                this.snackbar = true
             })
             .catch(response => console.log(response))
            
    }
    }
}
</script>