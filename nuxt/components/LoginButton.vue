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
                    <v-btn color="primary" dark block @click="handleLoginClick">
                        <v-icon color="white darken-2" class="mr-3">
                            mdi-twitter
                        </v-icon>
                        LOGIN WITH TWITTER
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
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
        handleLoginClick() {
            this.$axios
                .get('/api/oauthlogin?platform=twitter')
                .then((res) => res.data)
                .then((data) => {
                    const { request_token, authorization_url, platform } =
                        data.data
                    window.location.replace(authorization_url)
                })
        },
    },
}
</script>
