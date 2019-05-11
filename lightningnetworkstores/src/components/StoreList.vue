<template>
    <div class="store-list">
        <v-layout justify-center>
            <v-flex xs12 md12 lg10 xl8>
                <v-container fluid grid-list-md>
                    <v-layout row wrap>
                        <store-card v-for="store in getStores" :key="store.id" :store="store" :baseUrl="baseUrl"></store-card>
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
    @Prop() sector!: string;
    @Prop() digitalGoods!: string;
    @Prop() sort!: string;

    baseUrl: string = "";

    mounted() {
        console.log("Sector: " + this.sector);
        console.log("Digital goods: " + this.digitalGoods);
        console.log("Sort: " + this.sort);

        this.baseUrl = this.$store.getters.getBaseUrl();

        this.$forceUpdate();
    }

    @Watch("sector")
    private onSectorChanged(val: string, oldVal: string) {
        this.$forceUpdate();
    }

    @Watch("digitalGoods")
    private onDigitalGoodsChanged(val: string, oldVal: string) {
        this.$forceUpdate();
    }

    @Watch("sort")
    private onSortChanged(val: string, oldVal: string) {
        this.$forceUpdate();
    }

    get getStores() {
        return this.$store.getters.getStores({ sector: this.sector, digitalGoods: this.digitalGoods }, this.sort);
    }
}
</script>

<style scoped lang="scss">
</style>
