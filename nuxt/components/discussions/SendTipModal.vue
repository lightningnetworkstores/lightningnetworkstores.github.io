<template>
    <div>
        <v-dialog v-model="toogleModal" persistent max-width="300">
            <v-card>
                <v-card-title class="text-h5"> Send Tip </v-card-title>
                <v-card-title>
                    <v-chip
                        small
                        :color="colorTip"
                        text-color="white"
                        class="mx-0 padingLeft-1 pr-2"
                    >
                        <v-avatar v-if="hasProfilePicture" class="mx-0">
                            <v-img
                                :src="imageTip"
                                max-height="21"
                                max-width="21"
                                class="mx-0 px-0"
                            ></v-img>
                        </v-avatar>
                        <v-icon v-else class="ml-3 pr-3" size="25" color="white"
                            >mdi-account-circle</v-icon
                        >
                        <div class="ml-2">
                            {{ username | capitalize }}
                        </div>
                    </v-chip>
                </v-card-title>
                <v-card-text class="mt-4">
                    <v-text-field
                        label="Tip"
                        solo
                        type="number"
                        step="1"
                        min="0"
                        v-model="amountTip"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-grey darken-4" text @click="closeModal">
                        close
                    </v-btn>
                    <v-btn depressed color="primary" @click="mSendTip">
                        Send Tip
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        toogleDialog: Boolean,
        hasProfilePicture: String,
        username: String,
        capitalize: String,
        colorTip: String,
        imageTip: String,
        userId: String,
    },
    data() {
        return {
            amountTip: 0,
        }
    },
    computed: {
        toogleModal: {
            get() {
                return this.toogleDialog
            },
            set() {
                this.amountTip = 0
                this.$emit('close-dialog', false)
            },
        },
    },
    methods: {
        closeModal() {
            this.amountTip = 0
            this.$emit('close-dialog', false)
        },
        async mSendTip() {
            if (this.amountTip > 0 && this.userId != '') {
                const result = await this.$store.dispatch('wallet/transfer', {
                    to: this.userId,
                    amount: this.amountTip,
                })

                if (result) {
                    this.closeModal()
                }
            }
        },
    },
}
</script>

<style scoped>
.padingLeft-1 {
    padding-left: 1px;
}
</style>