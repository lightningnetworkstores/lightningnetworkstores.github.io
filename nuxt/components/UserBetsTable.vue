<template>
  <v-simple-table dark>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-center">Amount</th>
          <th class="text-center">Choice</th>
          <th class="text-center">Prize</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in userBets" :key="item.name">
          <td class="text-center">
            {{ item.wager }} <i class="fak fa-satoshisymbol-solidtilt"/>
          </td>
          <td v-if="contestType === 'quiz'" class="text-center">
            {{ item.choice }}
          </td>
          <td v-if="contestType === 'meme'" class="text-center">
            <v-img width="35" :src="item.choice.link" class="rounded"></v-img>
          </td>
          <td v-if="contestType === 'store'" class="text-center">
            {{ item.choice.name }}
          </td>
          <td class="text-center">
            {{ isContestRunning ? "⌛ (waiting for conclusion)" : item.prize }}
          </td>
        </tr>
        <tr v-if="!userBets.length">
          <td colspan="3" class="text-center">No bets placet yet</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    userBets: {
      type: Array,
      default: () => []
    },
    isContestRunning: {
      type: Boolean,
      default: true
    },
    contestType: {
      type: String,
      validator(value) {
        return ['quiz', 'meme', 'store'].includes(value)
      }
    }
  }
};
</script>
