<template>
    <div class="services">
        <v-layout justify-center>
            <v-flex xs12 md12 lg10 xl8>
                <v-container>
                    <v-layout row>
                        <h1>Merchant adoption of the lightning network</h1>
                    </v-layout>

                    <v-layout row>
                        This is a small list of lightning services/resources, it doesn't aim to be an exaustive list.
                    </v-layout>

                    <v-layout row pt-3>
                        <v-data-table :headers="headers" :items="services" :rows-per-page-items="[50, 100, 500]" :pagination.sync="pagination" style="width: 100%">
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
                                <td class="text-xs-left">{{ props.item.description }}</td>
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
        rowsPerPage: 500
    };

    headers: any = [
        {
            text: "Entity",
            align: "left",
            sortable: true,
            value: "entity"
        },
        { text: "Description", value: "description" }
    ];

    services: any = [];

    created() {
        this.$store.dispatch("getServices").then(
            response => {
                this.services = response.data;
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
