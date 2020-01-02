<template>
    <div class="stats">
        <v-layout justify-center>
            <v-flex xs12 md12 lg10 xl8>
                <v-container>
                    <v-layout row>
                        <h1>Merchant adoption of the lightning network</h1>
                    </v-layout>

                    <v-layout row pt-4 wrap>
                        <v-flex grow class="text-xs-center" pa-4>
                            <v-card>
                                <v-card-title primary-title class="justify-center">
                                    <div>
                                        <h3 class="headline text--accent-2">Number of stores: {{ trendingStores.length }}&nbsp;</h3>
                                    </div>
                                    <div>
                                        <h3 class="headline text--accent-2">Ratio of stores accepting lightning: ≃{{ lightningStoreRatio | number }}%</h3>
                                    </div>
                                </v-card-title>
                                <GChart type="LineChart" :data="chartData" :options="chartOptions"/></v-card
                        ></v-flex>
                    </v-layout>

                    <v-layout row wrap pt-3>
                        <v-flex xs12 sm6 class="text-xs-center" pa-4>
                            <v-card>
                                <v-card-title primary-title class="justify-center">
                                    <div>
                                        <h3 class="headline text--accent-2"><a href="/?sort=trending">Trending stores</a></h3>
                                    </div>
                                </v-card-title>
                                <v-list v-for="(store, index) in trendingStores" v-show="index < 4" :key="store.id">
                                    <a :href="store.href">{{ store.name }}</a>
                                </v-list>
                            </v-card>
                        </v-flex>

                        <v-flex xs12 sm6 class="text-xs-center" pa-4>
                            <v-card>
                                <v-card-title primary-title class="justify-center">
                                    <div>
                                        <h3 class="headline text--accent-2"><a href="/?sort=newest">Newest stores</a></h3>
                                    </div>
                                </v-card-title>
                                <v-list v-for="(store, index) in newestStores" v-show="index < 4" :key="store.id">
                                    <a :href="store.href">{{ store.name }}</a>
                                </v-list>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Store } from "../interfaces/Store";
//@ts-ignore
import { GChart } from "vue-google-charts";

@Component({ components: { GChart } })
export default class Stats extends Vue {
    lightningStoreRatio: number = 0;
    coinmap: any = [];

    trendingStores: Store[] = [];
    newestStores: Store[] = [];

    chartOptions: any = {
        chart: {
            title: "Number of merchants"
        },
        height: 500,
        colors: ["#3c3d3c"]
    };

    chartData: any = [["Time", "Stores"]];

    async mounted() {
        let scores = (await this.$store.dispatch("getScores")).data;
        let stores = (await this.$store.dispatch("getStores")).data;
        this.coinmap = (await this.$store.dispatch("getCoinmapData")).data;

        this.trendingStores = stores.slice(0).sort((a: Store, b: Store) => {
            return (scores[b.id] || [0, 0, 0])[2] - (scores[a.id] || [0, 0, 0])[2];
        });

        this.newestStores = stores
            .slice(0)
            .sort((a: Store, b: Store) => {
                return a.added - b.added;
            })
            .reverse();

        this.getStatsData();
    }

    private getStatsData() {
        //chart
        let addedTimes: any = [];
        this.getStores.forEach((store: Store) => {
            if (store.added == null) {
                addedTimes.push(1519419592);
            } else if (!isNaN(store.added)) {
                addedTimes.push(store.added);
            }
        });
        addedTimes.sort();

        let count = [...Array(addedTimes.length).keys()].map(x => x + 1);
        count
            .map(x => [new Date(addedTimes[x - 1] * 1000), x])
            .forEach(count => {
                this.chartData.push(count);
            });

        //lightningStoreRatio
        let daysOfRatio = 60;

        let lastMonthStart = Math.round((new Date().getTime() - daysOfRatio * 24 * 60 * 60 * 1000) / 1000);
        let LNstoresLastMonth =
            addedTimes.length -
            addedTimes.findIndex((el: any) => {
                return el > lastMonthStart;
            });
        let coinmapLastMonth = this.coinmap[this.coinmap.length - 1][1] - this.coinmap[this.coinmap.length - 1 - LNstoresLastMonth][1];
        this.lightningStoreRatio = Math.round((100 * LNstoresLastMonth) / coinmapLastMonth);
    }

    get getStores() {
        return this.$store.getters.getStores({ sector: null, digitalGoods: null });
    }
}
</script>

<style scoped lang="scss">
</style>
