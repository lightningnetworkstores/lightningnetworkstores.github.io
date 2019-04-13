<template>
    <div class="home">
        <StoreList v-bind:sector="decodeURI(sector)" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import StoreList from "@/components/StoreList.vue";

@Component({
    components: {
        StoreList
    }
})
export default class Home extends Vue {
    @Prop() sector!: string;
}
</script>
