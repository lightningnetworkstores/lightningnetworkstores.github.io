<template>
    <div class="text-center">
        <v-dialog
            v-model="isOpen"
            @click:outside="$emit('update:isOpen', false)"
            @keydown.esc="$emit('update:isOpen', false)"
            max-width="500px"
        >
            <v-card>
                <v-card-title> Amount </v-card-title>
                <v-card-text>
                    <v-text-field
                        label="Amount"
                        v-model="amount"
                        :hint="amount ? '' : 'Enter amount to bet'"
                        type="number"
                        outlined
                        suffix="sats"
                        :rules="rules"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="red"
                        text
                        @click="reset()"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="primary"
                        :disabled="disableDoneButton"
                        text
                        @click="placeBet"
                    >
                        Bet
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar.active" :timeout="3000" color="success">
            <b>{{ snackbar.message }}</b>

            <template v-slot:action="{ attrs }">
                <v-btn
                    color="white"
                    text
                    v-bind="attrs"
                    @click="snackbar.active = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
export default {
    props: ['option', 'contestId', 'isOpen', 'minAmount', 'type'],
    emits: ['update:isOpen'],

    data() {
        return {
            amount: null,
            rules: [
                (value) => (value >= this.minAmount) ||
                    `Minimum amount is ${this.minAmount} sats`
                ,
            ],
            snackbar: {
                active: false,
                message: '',
                color: '',
            },
        }
    },
    computed: {
        disableDoneButton() {
            return this.amount < 20 || this.amount.length < 1
        },
    },
    methods: {
        reset(){
            this.amount = null
            this.$emit('update:isOpen', false)
        },
        placeBet() {
            this.$store
                .dispatch('placeBet', {
                    contestID: this.contestId,
                    choice: this.option,
                    amount: this.amount,
                    type: this.type,
                })
                .then((data) => {
                    this.$emit('update:isOpen', false)
                    this.amount = null
                })
        },
    },
}
</script>

<style></style>
