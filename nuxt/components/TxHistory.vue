<template>
  <v-data-table
    :headers="headers"
    :items="transfers"
    :items-per-page="15"
    class="elevation-2"  
  >
    <template v-slot:[`item.amount`]="{ item }">
      <div>
        {{ formatAmount(item) }}
      </div>
    </template>
    <template v-slot:[`item.type`]="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            class="transfer-type"
            v-bind="attrs"
            v-on="on"
            :color="getColor(item)"
          >
            {{ getIcon(item.type) }}
          </v-icon>
        </template>
        <span> {{ getTypeTooltip(item.type) }} </span>
      </v-tooltip>
    </template>
    <template v-slot:[`item.time`]="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on">{{ getTimeAgo(item.time) }} </span>
        </template>
        <span> {{ getFormattedTime(item.time) }}</span>
      </v-tooltip>
    </template>
    <template v-slot:[`item.from`]="{ item }">
      {{ item.from === twitterID ? '-' : item.from }}
    </template>
  </v-data-table>
</template>
<script>
import { mapState } from 'vuex'
import { DateTime } from 'luxon'
import { format } from 'timeago.js'

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
    formatAmount(item) {
      return item.from === this.twitterID ? `-${item.amount}` : `+${item.amount}`
    },
    getIcon(type) {
      switch(type) {
        case 'LN_WITHDRAW':
          return 'mdi-arrow-up'
        case 'LN_DEPOSIT':
          return 'mdi-arrow-down'
        case 'TRANSFER':
          return 'mdi-transfer'
      }
    },
    getColor(item) {
      if (item.type === 'LN_WITHDRAW') {
        return 'red'
      } else if (item.type === 'LN_DEPOSIT') {
        return 'green'
      } else if (item.type === 'TRANSFER') {
        if (item.from === this.twitterID)
          return 'red'
        else
          return 'green'
      }
    },
    getTypeTooltip(type) {
      switch(type) {
        case 'LN_WITHDRAW':
          return 'LN Withdrawal'
        case 'LN_DEPOSIT':
          return 'LN Deposit'
        case 'TRANSFER':
          return 'Internal Transfer'
        default:
          return 'Unknown'
      }
    },
    getTimeAgo(timestamp) {
      return format(timestamp)
    },
    getFormattedTime(timestamp) {
      return DateTime.fromMillis(timestamp).toRFC2822()
    }
  },
  computed: mapState({
    twitterID: state => {
      return state.wallet.profile.twitterID
    },
    transfers: state => {
      return state
        .wallet.transfers
        .filter(transfer => transfer.status === 'DONE')
        .map(transfer => ({
          amount: transfer.amount,
          type: transfer.type,
          time: transfer.timestamp,
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