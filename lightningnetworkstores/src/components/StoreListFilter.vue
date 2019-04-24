<template>
    <div class="store-list-filter">
        <v-layout justify-center>
            <v-flex xs11 md8 lg5>
                <v-layout row pt-4 wrap>
                    <v-flex grow pa-1><v-combobox v-model="selectedSector" item-text="name" item-value="prop" label="Sector" :items="sectorItems" return-object></v-combobox></v-flex>
                    <v-flex grow pa-1><v-combobox v-model="selectedDigitalGood" item-text="name" item-value="prop" label="Digital goods" :items="digitalGoodItems" return-object></v-combobox></v-flex>
                    <v-flex grow pa-1><v-combobox v-model="selectedSort" item-text="name" item-value="prop" label="Sort" :items="sortItems" return-object></v-combobox></v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class StoreList extends Vue {
    @Prop() sector!: string;
    @Prop() digitalGoods!: string;
    @Prop() sort!: string;

    digitalGoodItems: any[] = [
        { name: "Yes", prop: "yes" },
        { name: "No, goods shipped", prop: "no, goods shipped" },
        { name: "No, goods only in-store", prop: "no, goods only in-store" },
        { name: "All", prop: "all" }
    ];

    sectorItems: any[] = [
        { name: "Technology", prop: "technology" },
        { name: "Security", prop: "security" },
        { name: "Clothing", prop: "clothing" },
        { name: "Exchange", prop: "exchange" },
        { name: "Food", prop: "food" },
        { name: "Games & Casino", prop: "games&casino" },
        { name: "Adult", prop: "adult" },
        { name: "Art", prop: "art" },
        { name: "Drugs & Supplements", prop: "drugs&supplements" },
        { name: "Cryptocurrency merchandise", prop: "cryptocurrency merchandise" },
        { name: "Other", prop: "other" },
        { name: "All", prop: "all" }
    ];

    sortItems: any[] = [{ name: "Best", prop: "best" }, { name: "Trending", prop: "trending" }, { name: "Newest", prop: "newest" }, { name: "Controversial", prop: "controversial" }];

    selectedDigitalGood: any = this.digitalGoods == "undefined" ? this.digitalGoodItems[this.digitalGoodItems.length - 1] : this.digitalGoodItems.find(good => good.prop == this.digitalGoods).name;
    selectedSector: any = this.sector == "undefined" ? this.sectorItems[this.sectorItems.length - 1] : this.sectorItems.find(sector => sector.prop == this.sector).name;
    selectedSort: any = this.sort == "undefined" ? this.sortItems[0] : this.sortItems.find(sort => sort.prop == this.sortItems).name;

    created() {}

    private changeUrl() {
        this.$router.push({ query: { sector: encodeURI(this.selectedSector.prop), digital_goods: encodeURI(this.selectedDigitalGood.prop), sort: encodeURI(this.selectedSort.prop) } });
    }

    @Watch("selectedDigitalGood")
    private onSelectedDigitalGoodsChanged(val: string, oldVal: string) {
        if (val !== oldVal) {
            this.changeUrl();
        }
    }

    @Watch("selectedSector")
    private onSelectedSectorChanged(val: string, oldVal: string) {
        if (val !== oldVal) {
            this.changeUrl();
        }
    }

    @Watch("selectedSort")
    private onSelectedSortChanged(val: string, oldVal: string) {
        if (val !== oldVal) {
            this.changeUrl();
        }
    }
}
</script>

<style scoped lang="scss">
</style>
