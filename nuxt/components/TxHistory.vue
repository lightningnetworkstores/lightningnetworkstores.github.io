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
          <span v-bind="attrs" v-on="on"
            >{{ getTimeAgo(item.time) }}
          </span>
        </template>
        <span> {{ getFormattedTime(item.time) }}</span>
      </v-tooltip>
    </template>
    <template v-slot:[`item.counterparty`]="{ item }">
      <UserTransferWidget :user="item.counterparty" />
    </template>
  </v-data-table>
</template>
<script>
import { mapState } from 'vuex'
import { DateTime } from 'luxon'
import { format } from 'timeago.js'
import UserTransferWidget from './UserTransferWidget'

export default {
  components: {
    UserTransferWidget,
  },
  data() {
    return {
      headers: [
        { text: 'Type', value: 'type' },
        { text: 'Amount', value: 'amount' },
        { text: 'Fee', value: 'fee' },
        { text: 'Time', value: 'time' },
        { text: 'To/From', value: 'counterparty' },
      ],
    }
  },
  methods: {
    formatAmount(item) {
      if (item.receiver) {
        return item.receiver.id === this.twitterID
          ? `+${item.amount}`
          : `-${item.amount}`
      } else if (item.sender) {
        return item.sender.id === this.twitterID
          ? `-${item.amount}`
          : `+${item.amount}`
      }
      return item.amount
    },
    getIcon(type) {
      switch (type) {
        case 'LN_WITHDRAW':
          return 'mdi-arrow-up'
        case 'LN_DEPOSIT':
          return 'mdi-arrow-down'
        case 'TRANSFER':
          return 'mdi-transfer'
        case 'AFFILIATE_PAYOUT':
          return 'mdi-account-multiple'
        case 'CONTEST_PRIZE':
          return 'mdi-cash-multiple'
        case 'CONTEST_WAGER':
          return 'mdi-cash'
        case 'CONTEST_WAGER_REFUND':
          return 'mdi-wallet-giftcard'
        case 'WELCOME_GIFT':
          return 'mdi-gift'
        default:
          return type
      }
    },
    getColor(item) {
      if (item.type === 'LN_WITHDRAW') {
        return 'red'
      } else if (item.type === 'LN_DEPOSIT') {
        return 'green'
      } else if(item.type === 'AFFILIATE_PAYOUT'){
        return 'green'
      } else if (item.type === 'TRANSFER') {
        if (item.sender.id === this.twitterID) return 'red'
        else return 'green'
      }
    },
    getTypeTooltip(type) {
      switch (type) {
        case 'LN_WITHDRAW':
          return 'LN Withdrawal'
        case 'LN_DEPOSIT':
          return 'LN Deposit'
        case 'TRANSFER':
          return 'Internal Transfer'
        case 'AFFILIATE_PAYOUT':
          return 'Affiliate payout'
        default:
          return type
      }
    },
    getTimeAgo(timestamp) {
      return format(timestamp)
    },
    getFormattedTime(timestamp) {
      return DateTime.fromMillis(timestamp).toRFC2822()
    },
  },
  computed: mapState({
    twitterID: (state) => {
      return state.wallet.profile.twitterID
    },
    transfers: (state) => {
      return state.wallet.transfers
        .filter((transfer) => transfer.status === 'DONE')
        .map((transfer) => {
          const { twitterID } = state.wallet.profile
          let counterparty = transfer.sender
          if (transfer.type === 'TRANSFER') {
            counterparty =
              transfer.sender.id === twitterID
                ? transfer.receiver
                : transfer.sender
          } else if (transfer.type === 'AFFILIATE_PAYOUT') {
            counterparty = { name: 'Affiliate Payout' }
          }
          return {
            amount: transfer.amount,
            type: transfer.type,
            time: transfer.timestamp,
            counterparty: counterparty,
            receiver: transfer.receiver,
            sender: transfer.sender,
            fee: transfer.fee,
          }
        })
    },
  }),
}
</script>
<style scoped>
.transfer-type {
  cursor: pointer;
}
</style>