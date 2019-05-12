<template>
    <div class="donations"><donations-component></donations-component></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DonationsComponent from "@/components/Donations.vue";

@Component({
    components: { DonationsComponent }
})
export default class Donations extends Vue {}
</script>
