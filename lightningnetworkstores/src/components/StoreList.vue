<template>
    <div class="store-list">
        <store-card v-for="store in stores" v-bind:key="store.id" v-bind:store="store"></store-card>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Store } from "../interfaces/Store";
import StoreCard from "@/components/StoreCard.vue";

@Component({
    components: {
        StoreCard
    }
})
export default class StoreList extends Vue {
    stores!: Store[];
    @Prop() sector!: string;

    created() {
        console.log(this.sector);
        this.stores = this.$store.getters.getStores(this.sector);
        console.log("Stores: " + this.stores.length);
    }
}
</script>

<style scoped lang="scss">
</style>
