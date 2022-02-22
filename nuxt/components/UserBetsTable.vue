<template>
  <v-simple-table>
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
          <td>{{ item.choice }}</td>
          <td>{{ waitingForEnd ? "(wait for end)" : item.prize }}</td>
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

<style></style>
