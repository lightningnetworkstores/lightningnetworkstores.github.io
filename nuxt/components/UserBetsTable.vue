<template>
  <v-simple-table dark>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Amount</th>
          <th class="text-left">Choice</th>
          <th class="text-left">Prize</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in userBets" :key="item.name">
          <td>{{ item.wager }}</td>
          <td v-if="item.choice.name">
            {{ item.choice.name }}
          </td>
          <td v-if="item.choice.link">
            <v-img width="35" :src="item.choice.link" class="rounded"></v-img>
          </td>
          <td>{{ waitingForEnd ? "(wait for end)" : item.prize }}</td>
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
  props: ["userBets", "waitingForEnd"],
};
</script>
