<template>
    <div class="about"><about></about></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import About from "@/components/About.vue";

@Component({
    components: { About }
})
export default class Stats extends Vue {}
</script>
