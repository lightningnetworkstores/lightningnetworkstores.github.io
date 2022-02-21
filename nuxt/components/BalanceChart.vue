<template>
  <div>
    <ccv-donut-chart
      v-if="balance !== null"
      :data="chartData" :options="options"
    />
    <div class="text-caption d-flex justify-center align-center mt-2" style="color: gray">
      * Withdrawable Balance: {{ withdrawable }} sats
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

const ranges = [
  { divider: 1e6 , suffix: 'M' },
  { divider: 1e3 , suffix: 'k' }
];

function formatNumber(n) {
  for (var i = 0; i < ranges.length; i++) {
    if (n >= ranges[i].divider) {
      return (n / ranges[i].divider).toString() + ranges[i].suffix;
    }
  }
  return n.toString();
}

const EMPTY_BALANCE = [
    { 'group': 'Available', 'value': 0 },
    { 'group': 'Pending Deposits', 'value': 0 },
    { 'group': 'Pending Withdrawals', 'value': 0 },
    { 'group': 'Unsettled Bets', 'value': 0 },
    { 'group': 'Pending Affiliates', 'value': 0 },
  ]

export default {
  data() {
    return {
      options: {
        height: '20em',
        width: this.width(),
        toolbar: {
          enabled: false
        },
        resizable: true,
        legend: {
          orientation: 'vertical',
          position: 'left',
          alignment: 'center',
          truncation: {
            threshold: 50
          }
        },
        color: {
          scale: {
            'Available': '#0B8A03',
            'Pending Deposits': '#D5D6DC',
            'Pending Withdrawals': '#922D9E',
            'Pending Deposits': '#78BEF6',
            'Pending Affiliates': '#A0F678',
            'Unsettled Bets': '#E5DD00'
          }
        },
        pie: {
          labels: {
            formatter: v => {
              if (this.isAllAvailable) return ''
              return `${formatNumber(v.data.value)}`
            }
          }
        },
        donut: {
          center: {
            label: this.centerTitle
          },
          alignment: 'center'
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch('wallet/getDashboardInfo')
  },
  methods: {
    width() {
      switch(this.$vuetify.breakpoint.name) {
        case 'xs': return '22em'
        case 'sm': return '23em'
        case 'md': return '30em'
        case 'lg': return '30em'
        case 'xl': return '30em'
        default: return '23em'
      }
    }
  },
  computed: {
    chartData() {
      return this.balance ? this.balance : EMPTY_BALANCE
    },
    centerTitle() {
      if (this.balance) {
        const total = balance.reduce((accum, item) => accum + item.value, 0)
        const available = balance[0].value
        if (total === available) return 'sats'
        else return 'sats (forecast)'
      } else {
        return 'Loading'
      }
    },
    ...mapState({
      balance: state => {
        const { wallet } = state
        if (!wallet.balance) {
          return EMPTY_BALANCE
        }
        return [
          { group: 'Available', value: wallet.balance.available },
          { group: 'Pending Deposits', value: wallet.balance.pending_deposits },
          { group: 'Pending Withdrawals', value: wallet.balance.pending_withdrawals },
          { group: 'Unsettled Bets', value: wallet.balance.unsettled_bets },
          { group: 'Pending Affiliates', value: wallet.affiliate.pending }
        ]
      },
      isAllAvailable: state => {
        const { wallet } = state
        const { balance } = wallet
        return balance.pending_deposits === 0 &&
          balance.pending_withdrawals === 0 &&
          balance.unsettled_bets === 0 &&
          wallet.affiliate.pending === 0
      },
      withdrawable: state => {
        const { wallet } = state
        if (!wallet.balance) return 0
        const { balance } = wallet
        return balance.available - Math.ceil(1 - (balance.withdrawal_fee_per_cent / 100))
      }
    })
  }
}
</script>