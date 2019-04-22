<template>
    <div class="store-list">
        <store-card v-for="store in stores" :key="store.id" :store="store"></store-card>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
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
    @Prop() digitalGoods!: string;

    created() {
        console.log("Sector: " + this.sector);
        console.log("Digital goods: " + this.digitalGoods);

        this.getStores();
    }

    @Watch("sector")
    private onSectorChanged(val: string, oldVal: string) {
        this.getStores();
        this.$forceUpdate();
    }

    @Watch("digitalGoods")
    private onDigitalGoodsChanged(val: string, oldVal: string) {
        this.getStores();
        this.$forceUpdate();
    }

    private getStores() {
        this.stores = this.$store.getters.getStores(this.sector, this.digitalGoods);
        console.log("Stores: " + this.stores.length);
    }
}
</script>

<style scoped lang="scss">
</style>
