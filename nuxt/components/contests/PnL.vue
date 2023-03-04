<template>
  <h3 v-if="pnl > 0" style="text-align:center">You won {{pnl}} <i class="fak fa-satoshisymbol-solidtilt"/> !</h3>
</template>

<script>
export default {
  props: {
    pnl: {
      type: Number,
      required: true
    }
  }
}
</script>

<style>
</style>