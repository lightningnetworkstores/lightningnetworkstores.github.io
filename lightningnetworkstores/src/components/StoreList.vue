<template>
    <div class="store-list">
        <v-layout justify-center>
            <v-flex xs12 md12 lg8>
                <v-container fluid grid-list-md>
                    <v-layout row wrap>
                        <store-card v-for="store in stores" :key="store.id" :store="store"></store-card>
                    </v-layout>
                </v-container>
            </v-flex>
        </v-layout>
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
    @Prop() sort!: string;

    created() {
        console.log("Sector: " + this.sector);
        console.log("Digital goods: " + this.digitalGoods);
        console.log("Sort: " + this.sort);

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

    @Watch("sort")
    private onSortChanged(val: string, oldVal: string) {
        this.getStores();
        this.$forceUpdate();
    }

    private getStores() {
        this.stores = this.$store.getters.getStores({ sector: this.sector, digitalGoods: this.digitalGoods }, this.sort);
        console.log("Stores: " + this.stores.length);
    }
}
</script>

<style scoped lang="scss">
</style>
