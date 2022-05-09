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
                        :placeholder="`${minAmount}`"
                        :hint="`min ${minAmount} sats`"
                        type="number"
                        prefix="$"
                        :rules="[rules.required, rules.number]"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn
                        color="primary"
                        :disabled="disableDoneButton"
                        text
                        @click="placeBet"
                    >
                        Done
                    </v-btn>
                    <v-btn
                        color="secondary"
                        text
                        @click="$emit('update:isOpen', false)"
                    >
                        Cancel
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
            amount: '0',
            rules: {
                required: (value) => !!value || 'Required.',
                number: (value) => {
                    const pattern = /^[0-9]*$/
                    return (
                        (pattern.test(value) && value >= this.minAmount) ||
                        'Invalid amount.'
                    )
                },
            },
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
                    this.amount = '0'
                    // this.$store.dispatch(
                    //     this.type === 'quiz'
                    //         ? 'getQuizContest'
                    //         : 'getStoreContest'
                    // )

                    this.snackbar.message = data.message
                    this.snackbar.color = data.status
                    this.snackbar.active = true
                })
                .catch((err) => {
                    this.snackbar.message = err
                    this.snackbar.color = 'red accent-2'
                    this.snackbar.active = true
                })
        },
    },
}
</script>

<style></style>
