<template>
    <div class="store-list-filter">
        <v-layout justify-center class="text-xs-center">
            <v-flex>
                <img src="@/assets/images/LightningNetworkStores.png" class="logo" />
            </v-flex>
        </v-layout>
        <v-layout justify-center>
            <v-flex xs11 md11 lg6>
                <v-layout row pt-2 wrap>
                    <v-flex grow pa-1><v-combobox v-model="selectedSector" item-text="name" item-value="prop" label="Sector" :items="sectorItems" return-object></v-combobox></v-flex>
                    <v-flex grow pa-1><v-combobox v-model="selectedDigitalGood" item-text="name" item-value="prop" label="Digital goods" :items="digitalGoodItems" return-object></v-combobox></v-flex>
                    <v-flex grow pa-1><v-combobox v-model="selectedSort" item-text="name" item-value="prop" label="Sort" :items="sortItems" return-object></v-combobox></v-flex>
                </v-layout>
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

@Component({ components: { VueRecaptcha, QrcodeVue, AddStoreModal } })
export default class StoreList extends Vue {
    @Prop() sector!: string;
    @Prop() digitalGoods!: string;
    @Prop() sort!: string;

    digitalGoodItems: any[] = [
        { name: "All", prop: "all" },
        { name: "Yes", prop: "yes" },
        { name: "No, goods shipped", prop: "no, goods shipped" },
        { name: "No, goods only in-store", prop: "no, goods only in-store" }
    ];

    sectorItems: any[] = [
        { name: "All", prop: "all" },
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
        { name: "Other", prop: "other" }
    ];

    sortItems: any[] = [
        { name: "Best", prop: "best" },
        { name: "Trending", prop: "trending" },
        { name: "Newest", prop: "newest" },
        { name: "Controversial", prop: "controversial" },
        { name: "Last commented", prop: "last commented" }
    ];

    selectedDigitalGood: any = this.digitalGoods == "undefined" ? "all" : this.digitalGoods;
    selectedSector: any = this.sector == "undefined" ? "all" : this.sector;
    selectedSort: any = this.sort == "undefined" ? "best" : this.sort;

    created() {}

    private changeUrl() {
        this.$router.push({
            query: {
                sector: encodeURI(this.selectedSector.prop || this.selectedSector),
                digital_goods: encodeURI(this.selectedDigitalGood.prop || this.selectedDigitalGood),
                sort: encodeURI(this.selectedSort.prop || this.selectedSort)
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
}
</script>

<style scoped lang="scss">
.logo {
    width: 100%;
    max-width: 600px;
    height: auto;
    padding: 5px;
}
</style>
