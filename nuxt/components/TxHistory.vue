<template>
  <v-data-table
    :headers="headers"
    :items="transfers"
    :items-per-page="15"
    :custom-sort="customSort"
    class="elevation-2"
  >
    <template v-slot:[`item.amount`]="{ item }">
      <div>
        {{ item.amount.value }}
        <v-tooltip v-if="item.amount.fee" bottom>
          <template v-slot:activator="{ on, attrs}">
            <v-chip class="mx-1 px-1"
              color="red accent-4"
              v-bind="attrs"
              v-on="on"
              x-small
            >
              <span style="color:white"> - {{item.amount.fee}}</span>
            </v-chip>
          </template>
          <span>Transfer Fee</span>
        </v-tooltip>
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
        { text: 'Time', value: 'time' },
        { text: 'To/From', value: 'counterparty' },
      ],
    }
  },
  methods: {
    isReceivingMoney(item){
      if(item.receiver){
        return item.receiver.id === this.twitterID
      } else if (item.sender) {
        return item.sender.id !== this.twitterID
      } else {
        return false
      }
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
        case 'PAY_INVOICE':
          return 'mdi-wallet'  
        default:
          return type
      }
    },
    getColor(item) {
      if (this.isReceivingMoney(item)) {
        return 'green'
      } else{
        return 'red'
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
    customSort(items, sortBy, sortDesc) {
      if (sortBy[0] === 'amount') {
        return items.sort((a, b) => {
          if (sortDesc[0]) {
            return b.amount.value - a.amount.value
          } else {
            return a.amount.value - b.amount.value
          }
        })
      } else if (sortBy[0] === 'time') {
        return items.sort((a, b) => {
          if (sortDesc[0]) {
            return a.time - b.time
          } else {
            return b.time - a.time
          }
        })
      }
      return items.sort((a, b) => a - b)
    }
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
          let counterparty = (transfer.sender && transfer.sender.id === twitterID) ? transfer.receiver : transfer.sender
          const isIncoming = t => t.receiver && t.receiver.id === state.wallet.profile.twitterID
          return {
            amount: {
              value: isIncoming(transfer) ? transfer.amount : -transfer.amount,
              fee: transfer.fee
            },
            type: transfer.type,
            time: transfer.timestamp,
            counterparty: counterparty,
            receiver: transfer.receiver,
            sender: transfer.sender
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