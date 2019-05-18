<template>
    <div class="wallets">
        <v-layout justify-center>
            <v-flex xs12 md12 lg10 xl8>
                <v-container>
                    <v-layout row>
                        <h1>Lightning mobile wallets</h1>
                    </v-layout>

                    <v-layout row>
                        <i>Warning: some recent wallets might be scams. Be carefull when experimenting with new wallets.</i>
                    </v-layout>

                    <v-layout row pt-3 style="overflow: auto; width: 100%" justify-center>
                        <v-data-table :headers="headers" :items="wallets" :rows-per-page-items="[50, 100, 500]" :pagination.sync="pagination" disable-initial-sort>
                            <template slot="headerCell" slot-scope="props">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on">
                                            {{ props.header.text }}
                                        </span>
                                    </template>
                                    <span>
                                        {{ props.header.text }}
                                    </span>
                                </v-tooltip>
                            </template>
                            <template v-slot:items="props">
                                <td>
                                    <a :href="props.item.page">{{ props.item.name }}</a>
                                </td>
                                <td class="text-xs-center"><a v-if="props.item.open_source" :href="props.item.open_source">yes</a><span v-else>no</span></td>
                                <td class="text-xs-center">
                                    <span v-if="props.item.requires_node">{{ props.item.requires_node }}</span
                                    ><span v-else>no</span>
                                </td>
                                <td class="text-xs-center">
                                    <span v-if="props.item.custodial">{{ props.item.custodial }}</span
                                    ><span v-else>no</span>
                                </td>
                                <td class="text-xs-right">{{ props.item.release }}</td>
                                <td class="text-xs-center"><a v-if="props.item.web_wallet" :href="props.item.web_wallet">yes</a><span v-else>no</span></td>
                                <td class="text-xs-right">
                                    <a v-if="props.item.android" :href="props.item.android">android</a>
                                    <a v-else-if="props.item.android_closed" :href="props.item.android_closed">android closed-beta</a>&nbsp;
                                    <a v-if="props.item.iOS" :href="props.item.iOS">iOS</a>
                                    <a v-else-if="props.item.iOS_closed" :href="props.item.iOS_closed">iOS closed-beta</a>
                                </td>
                                <td class="text-xs-right">
                                    <a v-if="props.item.android_testnet" :href="props.item.android_testnet">android</a>
                                    <a v-else-if="props.item.android_testnet_closed" :href="props.item.android_testnet_closed">android closed-beta</a>
                                    &nbsp;<a v-if="props.item.iOS_testnet" :href="props.item.iOS_testnet">iOS</a>
                                    <a v-else-if="props.item.iOS_testnet_closed" :href="props.item.iOS_testnet_closed">iOS closed-beta</a>
                                </td>
                            </template>
                        </v-data-table>
                    </v-layout>
                </v-container>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class About extends Vue {
    pagination: any = {
        rowsPerPage: 50
    };

    headers: any = [
        {
            text: "Name",
            align: "left",
            sortable: true,
            value: "name"
        },
        { text: "Open source", value: "open_source" },
        { text: "Requires own node", value: "requires_node" },
        { text: "Custodial", value: "custodial" },
        { text: "Mainnet launch date", value: "release" },
        { text: "Web wallet", value: "web_wallet" },
        { text: "Mainnet", value: "" },
        { text: "Testnet", value: "" }
    ];

    wallets: any = [];

    created() {
        this.$store.dispatch("getWallets").then(
            response => {
                this.wallets = response.data;
            },
            error => {
                console.error(error);
            }
        );
    }
}
</script>

<style scoped lang="scss">
</style>
