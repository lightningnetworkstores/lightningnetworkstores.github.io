<template>
  <v-data-table
    :headers="headers"
    :items="transfers"
    :items-per-page="15"
    class="elevation-2"  
  >
    <template v-slot:[`item.type`]="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            class="transfer-type"
            v-bind="attrs"
            v-on="on"
            :color="getColor(item.type)"
          >
            {{ item.type === 'LN_WITHDRAW' ? 'mdi-arrow-up-bold-circle' : 'mdi-arrow-down-bold-circle' }}
          </v-icon>
        </template>
        <span> {{ getTypeTooltip(item.type) }} </span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>
<script>
import { mapState } from 'vuex'
import { DateTime } from 'luxon'

export default {
  data() {
    return {
      headers: [
        { text: 'Type', value: 'type' },
        { text: 'Amount', value: 'amount' },
        { text: 'Fee' , value: 'fee' },
        { text: 'Time', value: 'time' },
        { text: 'From', value: 'from' }
      ]
    }
  },
  methods: {
    getColor(type) {
      if (type === 'LN_WITHDRAW') {
        return 'red'
      } else if (type === 'LN_DEPOSIT') {
        return 'green'
      }
    },
    getTypeTooltip(type) {
      switch(type) {
        case 'LN_WITHDRAW':
          return 'LN Withdrawal'
        case 'LN_DEPOSIT':
          return 'LN Deposit'
        default:
          return 'Unknown'
      }
    }
  },
  computed: mapState({
    transfers: state => {
      return state
        .wallet.transfers
        .filter(transfer => transfer.status === 'DONE')
        .map(transfer => ({
          amount: transfer.amount,
          type: transfer.type,
          time: DateTime.fromMillis(transfer.timestamp).toLocaleString(),
          from: transfer.sender ? transfer.sender : '-',
          fee: transfer.fee
        }))
    }
  })
}
</script>
<style scoped>
.transfer-type {
  cursor: pointer;
}
</style>