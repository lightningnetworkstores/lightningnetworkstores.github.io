<template>
    <div class="d-flex flex-column justify-center align-center flex-grow-1">
        <ccv-donut-chart
            class="mb-2"
            v-if="balance !== null"
            :data="chartData"
            :options="options"
        />
        <div
            class="text-caption d-flex justify-center align-end flex-grow-1"
            style="color: gray"
        >
            * Withdrawable Balance: {{ withdrawable }} sats
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import Vue from 'vue'
import chartsVue from "@carbon/charts-vue"

Vue.use(chartsVue)

const ranges = [
    { divider: 1e6, suffix: 'M' },
    { divider: 1e3, suffix: 'k' },
]

function formatNumber(n) {
    for (var i = 0; i < ranges.length; i++) {
        if (n >= ranges[i].divider) {
            return (
                Math.floor(n / ranges[i].divider).toString() + ranges[i].suffix
            )
        }
    }
    return n.toString()
}

const EMPTY_BALANCE = [
    { group: 'Available', value: 0 },
    { group: 'Pending deposits', value: 0 },
    { group: 'Pending withdrawals', value: 0 },
    { group: 'Unsettled bets', value: 0 },
    { group: 'Pending affiliates', value: 0 },
    { group: 'Pending contributor reward', value: 0 },
]

export default {
    data() {
        return {
            options: {
                height: '20em',
                width: this.width(),
                toolbar: {
                    enabled: false,
                },
                resizable: true,
                legend: {
                    orientation: 'vertical',
                    position: 'left',
                    alignment: 'center',
                    truncation: {
                        threshold: 50,
                    },
                },
                color: {
                    scale: {
                        Available: '#0B8A03',
                        'Pending deposits': '#D5D6DC',
                        'Pending withdrawals': '#922D9E',
                        'Pending deposits': '#78BEF6',
                        'Pending affiliates': '#A0F678',
                        'Unsettled bets': '#E5DD00',
                    },
                },
                pie: {
                    labels: {
                        formatter: (v) => {
                            if (this.isAllAvailable) return ''
                            return `${formatNumber(v.data.value)}`
                        },
                    },
                },
                donut: {
                    center: {
                        label: this.centerTitle,
                    },
                    alignment: 'center',
                },
            },
        }
    },
    mounted() {
        this.$store.dispatch('wallet/getDashboardInfo')
    },
    methods: {
        width() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs':
                    return '22em'
                case 'sm':
                    return '23em'
                case 'md':
                    return '30em'
                case 'lg':
                    return '30em'
                case 'xl':
                    return '30em'
                default:
                    return '23em'
            }
        },
    },
    computed: {
        chartData() {
            return this.balance ? this.balance : EMPTY_BALANCE
        },
        centerTitle() {
            if (this.balance) {
                const total = balance.reduce(
                    (accum, item) => accum + item.value,
                    0
                )
                const available = balance[0].value
                if (total === available) return 'sats'
                else return 'sats (forecast)'
            } else {
                return 'Loading'
            }
        },
        ...mapState({
            balance: (state) => {
                const { wallet } = state
                if (!wallet.balance) {
                    return EMPTY_BALANCE
                }
                return [
                    { group: 'Available', value: wallet.balance.available },
                    {
                        group: 'Pending deposits',
                        value: wallet.balance.pending_deposits,
                    },
                    {
                        group: 'Pending withdrawals',
                        value: wallet.balance.pending_withdrawals,
                    },
                    {
                        group: 'Unsettled bets',
                        value: wallet.balance.unsettled_bets,
                    },
                    {
                        group: 'Pending affiliates',
                        value: wallet.affiliate.pending,
                    },
                     {
                        group: 'Pending contributor reward',
                        value: wallet.balance.pending_contributor_reward,
                    },
                ]
            },
            isAllAvailable: (state) => {
                const { wallet } = state
                const { balance } = wallet
                return (
                    balance.pending_deposits === 0 &&
                    balance.pending_withdrawals === 0 &&
                    balance.unsettled_bets === 0 &&
                    wallet.affiliate.pending === 0
                )
            },
            withdrawable: (state) => {
                const { wallet } = state
                if (!wallet.balance) return 0
                const { balance } = wallet
                return (
                    balance.available -
                    Math.ceil(
                        balance.available *
                            (balance.withdrawal_fee_per_cent / 100)
                    )
                )
            },
        }),
    },
}
</script>
<style>
@import "@carbon/charts/styles.css";
</style>
