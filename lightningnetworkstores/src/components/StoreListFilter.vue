<template>
    <div class="store-list-filter">
        <v-layout justify-center>
            <v-flex xs11 md11 lg6>
                <v-layout row pt-4 wrap>
                    <v-flex grow pa-1><v-combobox v-model="selectedSector" item-text="name" item-value="prop" label="Sector" :items="sectorItems" return-object></v-combobox></v-flex>
                    <v-flex grow pa-1><v-combobox v-model="selectedDigitalGood" item-text="name" item-value="prop" label="Digital goods" :items="digitalGoodItems" return-object></v-combobox></v-flex>
                    <v-flex grow pa-1><v-combobox v-model="selectedSort" item-text="name" item-value="prop" label="Sort" :items="sortItems" return-object></v-combobox></v-flex>
                </v-layout>
            </v-flex>
        </v-layout>

        <v-btn color="green" dark fab fixed bottom right @click="showAddDialog = true">
            <v-icon>add</v-icon>
        </v-btn>

        <!-- Add store modal -->
        <v-dialog v-model="showAddDialog" max-width="500" persistent>
            <v-card>
                <v-layout row v-if="addAlert.message.length">
                    <v-flex pa-3>
                        <v-alert :value="addAlert.message" :type="addAlert.success ? 'success' : 'error'" transition="scale-transition">
                            {{ addAlert.message }}
                        </v-alert>
                    </v-flex>
                </v-layout>
                <div v-if="paymentRequest && isPaid" class="text-xs-center">
                    <!-- paymentRequest && isPaid -->
                    <v-card-title class="headline">
                        <v-layout row>
                            <v-flex>Payment successful</v-flex>
                        </v-layout>
                    </v-card-title>
                    <v-icon size="200" color="green" pa-5>fas fa-check-circle</v-icon>
                    <v-layout row mt-2>
                        <v-flex
                            >Go to <a :href="'/store/' + store.id">{{ store.name }}</a></v-flex
                        >
                    </v-layout>
                </div>

                <div v-else>
                    <v-card-title class="headline">Automatically add new store!</v-card-title>
                    <v-form @submit.prevent="submitAdd" ref="addform">
                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-text-field v-model="addDialogForm.value" label="Name" hint="eg. LuckyThunder" :rules="[v => !!v || 'Name is required']"></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-text-field
                                    v-model="addDialogForm.description"
                                    label="Description"
                                    hint="eg. LuckyThunder is a LN Slotmachine..."
                                    :rules="[v => !!v || 'Description is required']"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-text-field
                                    v-model="addDialogForm.websiteURL"
                                    label="Website URL"
                                    hint="eg. https://www.luckythunder.com"
                                    :rules="[v => !!v || 'Website URL is required']"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-text-field
                                    v-model="addDialogForm.nodeURI"
                                    label="Node URI (optional)"
                                    hint="eg. 7d1203ff06828625f421647950888a19cf30b5a635f@51.83.41.129:9735 (optional)"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-combobox
                                    v-model="addDialogForm.sector"
                                    item-text="name"
                                    item-value="prop"
                                    label="Sector"
                                    :items="sectorItems"
                                    return-object
                                    :rules="[v => !!v || 'Sector is required']"
                                ></v-combobox>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-combobox
                                    v-model="addDialogForm.digitalGoods"
                                    item-text="name"
                                    item-value="prop"
                                    label="Digital goods"
                                    :items="digitalGoodItems"
                                    return-object
                                    :rules="[v => !!v || 'Digital goods is required']"
                                ></v-combobox>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-text-field v-model="addDialogForm.contributor" label="Contributor code (optional)"></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-checkbox v-model="addDialogForm.agreeRemoved" label="I agree that the store may be removed later if it disables lightning payments"></v-checkbox>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex grow></v-flex>
                            <v-flex pl-3 pr-3 shrink>
                                <vue-recaptcha sitekey="6LddfGMUAAAAAG75Ke0N_iVtWh1QwwGFlByKpoMj"></vue-recaptcha>
                            </v-flex>
                            <v-flex grow></v-flex>
                        </v-layout>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn color="green darken-1" flat="flat" @click="showAddDialog = false">
                                Cancel
                            </v-btn>

                            <v-btn color="green darken-1" flat="flat" type="submit">
                                Send
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import VueRecaptcha from "vue-recaptcha";

@Component({ components: { VueRecaptcha } })
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

    showAddDialog: boolean = true;
    addDialogForm: any = {};
    addAlert: any = { message: "", success: true };

    paymentRequest: string = "";
    paymentID: string = "";
    expiryTime: Date = new Date();
    isPaid: boolean = false;

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
</style>
