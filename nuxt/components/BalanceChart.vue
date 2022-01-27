<template>
  <ccv-donut-chart
    :data="data" :options="options"
  />
</template>
<script>
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

const balance = [
        {
          'group': 'Available',
          'value': 21350
        },
        {
          'group': 'Pending Deposits',
          'value': 42000
        },
        {
          'group': 'Pending Withdrawals',
          'value': 20000
        },
        {
          'group': 'Unsettled Bets',
          'value': 15000
        },
        {
          'group': 'Pending Affiliates',
          'value': 556
        },
      ]

export default {
  data() {
    return {
      data: balance,
      options: {
        height: '20em',
        width: '30em',
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
              return `${formatNumber(v.data.value)}`
            }
          }
        },
        donut: {
          center: {
            label: this.centerTitle()
          },
          alignment: 'center'
        }
      }
    }
  },
  methods: {
    centerTitle() {
      console.log('this.data: ', balance)
      const total = balance.reduce((accum, item) => accum + item.value, 0)
      const available = balance[0].value
      console.log('total: ', total)
      console.log('available: ', available)
      if (total === available) return 'sats'
      else return 'sats (forecast)'
    }
  }
}
</script>