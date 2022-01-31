<template>
  <v-data-table
    :headers="headers"
    :items="transfers"
    :items-per-page="15"
    class="elevation-2"  
  />
</template>
<script>
const rawData = [
        {
          'amount': 10,
          'receiver': 'TWITTER_2185073714',
          'fee': 0,
          'type': 'LN_DEPOSIT',
          'timestamp': 1643598474534,
          'status': 'DONE'
        },
        {
          'amount': 200,
          'receiver': 'TWITTER_2185073714',
          'fee': 0,
          'type': 'LN_DEPOSIT',
          'timestamp': 1643598454747,
          'status': 'EXPIRED'
        }
      ]
export default {
  data() {
    return {
      headers: [
        { text: 'Amount', value: 'amount' },
        { text: 'Type', value: 'type' },
        { text: 'Time', value: 'time' },
        { text: 'From', value: 'from' },
        { text: 'Fee' , value: 'fee' }

      ],
      transfers: rawData.map(item => ({
        amount: item.amount,
        type: item.type,
        time: item.timestamp,
        from: item.sender ? item.sender : '-',
        fee: item.fee
      }))
    }
  }
}
</script>