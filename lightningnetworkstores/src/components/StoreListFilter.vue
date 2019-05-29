<template>
    <div class="store-list-filter">
        <v-layout justify-center class="text-xs-center">
            <v-flex> </v-flex>
        </v-layout>
        <v-layout justify-center>
            <v-flex xs11 md11 lg6 pa-3>
                <v-card>
                    <v-toolbar card color="rgb(56, 56, 56)" dark dense
                        ><v-text-field v-model="searchQuery" hide-details prepend-icon="search" single-line class="pt-0"></v-text-field><v-spacer></v-spacer><tutorial-modal></tutorial-modal
                    ></v-toolbar>
                    <!-- <v-spacer></v-spacer><v-icon>fa-filter</v-icon> -->
                    <v-layout row style="padding: 20px 20px 14px 20px;" wrap>
                        <v-flex grow pa-1><v-combobox v-model="selectedSort" item-text="name" item-value="prop" label="Sort" :items="sortItems" return-object></v-combobox></v-flex>
                        <v-flex grow pa-1><v-combobox v-model="selectedSector" item-text="name" item-value="prop" label="Sector" :items="sectorItems" return-object></v-combobox></v-flex>
                        <v-flex grow pa-1
                            ><v-combobox v-model="selectedDigitalGood" item-text="name" item-value="prop" label="Digital goods" :items="digitalGoodItems" return-object></v-combobox
                        ></v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
        <add-store-modal></add-store-modal>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import VueRecaptcha from "vue-recaptcha";
import QrcodeVue from "qrcode.vue";
import AddStoreModal from "@/components/AddStoreModal.vue";
import TutorialModal from "@/components/TutorialModal.vue";

@Component({ components: { VueRecaptcha, QrcodeVue, AddStoreModal, TutorialModal } })
export default class StoreList extends Vue {
    @Prop() sector!: string;
    @Prop() digitalGoods!: string;
    @Prop() sort!: string;
    @Prop() search!: string;

    digitalGoodItems: any[] = [
        { name: "All", prop: "all" },
        { name: "Yes", prop: "yes" },
        { name: "No, goods shipped", prop: "no, goods shipped" },
        { name: "No, goods only in a physical store", prop: "no, goods only in-store" }
    ];

    sectorItems: any[] = [
        { name: "All", prop: "all" },
        { name: "Technology", prop: "technology" },
        { name: "VPS & Web hosting", prop: "vps&web hosting" },
        { name: "Security", prop: "security" },
        { name: "Clothing", prop: "clothing" },
        { name: "Exchange", prop: "exchange" },
        { name: "Food", prop: "food" },
        { name: "Games & Casino", prop: "games&casino" },
        { name: "Adult", prop: "adult" },
        { name: "Art", prop: "art" },
        { name: "Drugs & Supplements", prop: "drugs&supplements" },
        { name: "Cryptocurrency merchandise", prop: "cryptocurrency merchandise" },
        { name: "Fitness & Sports", prop: "fitness&sports" },
        { name: "Other", prop: "other" }
    ];

    sortItems: any[] = [
        { name: "Best", prop: "best" },
        { name: "Trending", prop: "trending" },
        { name: "Newest", prop: "newest" },
        { name: "Controversial", prop: "controversial" },
        { name: "Last reviewed", prop: "last commented" }
    ];

    selectedDigitalGood: any = this.digitalGoods == "undefined" ? "all" : this.digitalGoods;
    selectedSector: any = this.sector == "undefined" ? "all" : this.sector;
    selectedSort: any = this.sort == "undefined" ? "best" : this.sort;
    searchQuery: string = this.search == "undefined" ? "" : this.search;

    created() {}

    private changeUrl() {
        this.$router.push({
            query: {
                sector: encodeURIComponent(this.selectedSector.prop || this.selectedSector),
                digital_goods: encodeURIComponent(this.selectedDigitalGood.prop || this.selectedDigitalGood),
                sort: encodeURIComponent(this.selectedSort.prop || this.selectedSort),
                search: encodeURIComponent(this.searchQuery)
            }
        });
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

    @Watch("searchQuery")
    private onSearchChanged(val: string, oldVal: string) {
        if (val !== oldVal) {
            setTimeout(() => {
                this.changeUrl();
            }, 1000);
        }
    }
}
</script>

<style scoped lang="scss">
</style>
