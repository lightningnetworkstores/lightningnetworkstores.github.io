<template>
    <div class="stats"><stats-component></stats-component></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StatsComponent from "@/components/Stats.vue";

@Component({
    components: { StatsComponent }
})
export default class Stats extends Vue {}
</script>
