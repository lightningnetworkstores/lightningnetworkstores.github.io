<template>
    <div>
        <v-dialog v-model="toogleModals" max-width="300">
            <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on" class="mt-4">
                    <v-avatar size="36" color="primary">
                        <v-icon dark> mdi-account-circle </v-icon>
                    </v-avatar>
                </v-btn>
            </template>
            <v-card class="d-flex flex-column justify-center align-center">
                <v-card-title class="text-h5"> Login </v-card-title>
                <v-card-text>
                   <TwitterLoginButton /> 
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import TwitterLoginButton from './TwitterLoginButton.vue'

export default {
    computed: {
        ...mapState('modals', ['isSettingsModalOpen']),
        toogleModals: {
            get() {
                return this.isSettingsModalOpen
            },
            set() {
                this.closeSettingsModal()
            },
        },
    },

    methods: {
        ...mapActions('modals', ['closeSettingsModal']),
    },
}
</script>
