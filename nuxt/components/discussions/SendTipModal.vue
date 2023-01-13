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

        <!-- SnackBar Message -->
        <!-- <v-snackbar
            v-model="snackbar_message.open"
            :timeout="2e3"
            :color="snackbar_message.color"
        >
            <b>{{ snackbar_message.text }}</b>

            <template v-slot:action="{ attrs }">
                <v-btn
                    color="white"
                    text
                    v-bind="attrs"
                    @click="snackbar_message.open = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar> -->
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
            snackbar_message: {
                open: false,
                text: 'My timeout is set to 2000.',
                color: '#424242',
            },
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
                    const delta =  -1 * parseInt(this.amountTip)
                    this.$store.dispatch('updateBalance', delta)
                }
                // if (result) {
                //     this.snackbar_message.text = 'Tip Successful'
                //     this.snackbar_message.color = 'success'
                //     this.closeModal()
                // } else {
                //     this.snackbar_message.text =
                //         'Error while performing internal transfer'
                //     this.snackbar_message.color = 'red accent-2'
                //     this.closeModal()
                // }
                // this.snackbar_message.open = true
                this.closeModal()
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