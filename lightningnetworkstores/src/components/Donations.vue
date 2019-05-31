<template>
    <div class="donations">
        <v-layout justify-center>
            <v-flex xs12 md12 lg10 xl8>
                <v-container>
                    <v-layout row>
                        <h1>Lightning donations</h1>
                    </v-layout>

                    <v-layout row>
                        To our knowledge, there isn't any list of on-chain donation addresses, so on-chain addresses are also included.
                    </v-layout>

                    <v-layout row pt-3 justify-center class="datatable-layout">
                        <v-data-table :headers="headers" :items="donations" :rows-per-page-items="[50, 100, 500]" :pagination.sync="pagination" style="width: 100%" disable-initial-sort>
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
                                    <a :href="props.item.link">{{ props.item.entity }}</a>
                                </td>
                                <td class="text-xs-left">
                                    <span v-html="props.item.contributions"></span>
                                </td>
                                <td class="text-xs-center"><a v-if="props.item.lightning" :href="props.item.lightning">link</a><span v-else>-</span></td>
                                <td>
                                    <a v-if="props.item.address" :href="'https://blockstream.info/address/' + props.item.address">
                                        {{ props.item.address }} (<a :href="props.item.address_proof">proof</a>)</a
                                    ><span v-else>-</span>
                                </td>
                                <td>
                                    <a v-if="props.item.reddit" :href="'https://reddit.com/u/' + props.item.reddit">{{ props.item.reddit }}</a
                                    ><span v-else>-</span>
                                </td>
                                <td>
                                    <a v-if="props.item.twitter" :href="'https://twitter.com/' + props.item.twitter">{{ props.item.twitter }}</a
                                    ><span v-else>-</span>
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
export default class Donations extends Vue {
    pagination: any = {
        rowsPerPage: 50
    };

    headers: any = [
        {
            text: "Entity",
            align: "left",
            sortable: true,
            value: "entity"
        },
        { text: "Description", value: "description" },
        { text: "Lightning", value: "Lightning" },
        { text: "Bitcoin address", value: "Bitcoin address" },
        { text: "Reddit", value: "reddit" },
        { text: "Twitter", value: "twitter" }
    ];

    donations: any = [];

    created() {
        this.$store.dispatch("getDonations").then(
            response => {
                this.donations = response.data;
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
