<template>
    <div class="services"><services-component></services-component></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ServicesComponent from "@/components/Services.vue";

@Component({
    components: { ServicesComponent }
})
export default class Services extends Vue {}
</script>
