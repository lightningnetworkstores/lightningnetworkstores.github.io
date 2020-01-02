<template>
    <div class="store-list">
        <v-layout justify-center>
            <v-flex xs12 md12 lg10 xl8>
                <v-container fluid grid-list-md style="padding-top: 0px;">
                    <v-layout row wrap>
                        <store-card v-for="store in getStores.slice(0, maxCards)" :key="store.id" :store="store" :baseUrl="baseUrl"></store-card>
                    </v-layout>
                </v-container>
                <v-container fill-height v-if="isLoading">
                    <v-layout row justify-center align-center>
                        <v-progress-circular indeterminate :size="70" :width="7" color="#fdb919"></v-progress-circular>
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
    @Prop() search!: string;
    @Prop() safeMode!: string;

    baseUrl: string = "";

    isLoading: boolean = true;

    maxCards: number = 10;
    maxCardAtStart: number = 10;
    addCardCount: number = 6;

    async mounted() {
        console.log("Sector: " + this.sector);
        console.log("Digital goods: " + this.digitalGoods);
        console.log("Sort: " + this.sort);

        await this.$store.dispatch("getScores");
        await this.$store.dispatch("getStores");

        this.baseUrl = this.$store.getters.getBaseUrl();

        setInterval(() => {
            if (this.maxCards < this.getStores.length) {
                this.maxCards += this.addCardCount;
            }
        }, 250);

        this.$forceUpdate();

        this.$nextTick(() => {
            this.isLoading = false;
        });
    }

    @Watch("sector")
    private onSectorChanged(val: string, oldVal: string) {
        this.maxCards = this.maxCardAtStart;
        this.$forceUpdate();
    }

    @Watch("digitalGoods")
    private onDigitalGoodsChanged(val: string, oldVal: string) {
        this.maxCards = this.maxCardAtStart;
        this.$forceUpdate();
    }

    @Watch("sort")
    private onSortChanged(val: string, oldVal: string) {
        this.maxCards = this.maxCardAtStart;
        this.$forceUpdate();
    }

    @Watch("search")
    private onSearchChanged(val: string, oldVal: string) {
        this.maxCards = this.maxCardAtStart;
        this.$forceUpdate();
    }

    get getStores() {
        return this.$store.getters.getStores({ sector: this.sector, digitalGoods: this.digitalGoods }, this.sort, this.search, this.safeMode);
    }
}
</script>

<style scoped lang="scss">
</style>
