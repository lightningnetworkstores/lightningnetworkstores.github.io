<template>
    <div class="wallets"><wallets-component></wallets-component></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import WalletsComponent from "@/components/Wallets.vue";

@Component({
    components: { WalletsComponent }
})
export default class Wallets extends Vue {}
</script>
