<template>
    <div class="store-info">
        <div>
            <v-breadcrumbs :items="breadCrumb">
                <template v-slot:divider>
                    <v-icon>chevron_right</v-icon>
                </template>
            </v-breadcrumbs>
        </div>
        <v-layout justify-center row wrap class="my-4">
            <v-flex xs11 md8 lg7>
                <!-- <v-img :src="imageUrl" height="300px"></v-img> -->

                <v-layout row>
                    <v-flex pb-1>
                        <v-chip color="success" text-color="white" class="ma-2 text-capitalize">New</v-chip>
                        <v-chip color="orange" text-color="white">
                            100
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on" pr-2 small right>fa-fire</v-icon>
                                </template>
                                <span>Trending score</span>
                            </v-tooltip>
                        </v-chip>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex pb-1>
                        <h1>{{ store.name }}</h1>
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex pb-3>{{ store.description }} </v-flex>
                </v-layout>
                <v-layout row> <b>Node uri:&nbsp;</b> {{ store.uri }} </v-layout>
                <v-layout row> <b>Goods:&nbsp;</b> {{ store.digital_goods }} </v-layout>
                <v-layout row> <b>Sector:&nbsp;</b> {{ store.sector }}</v-layout>
                <v-layout row>
                    <v-flex shrink pa-1 pr-3>
                        <v-btn icon @click.stop="vote(true)"><v-icon>arrow_upward</v-icon></v-btn>
                        5,000,000
                    </v-flex>
                    <v-flex grow pa-1>
                        <v-progress-linear color="success" background-color="error" class="white--text" height="15" value="98"></v-progress-linear>
                    </v-flex>
                    <v-flex shrink pa-1 pr-3>
                        <v-btn icon @click.stop="vote(true)"><v-icon>arrow_downward</v-icon></v-btn>
                        1000
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex grow>
                        <v-btn flat icon color="blue">
                            <v-icon small>fab fa-twitter</v-icon>
                        </v-btn>

                        <v-btn flat icon color="blue darken-3">
                            <v-icon small>fab fa-facebook</v-icon>
                        </v-btn>

                        <v-btn flat icon color="orange darken-2">
                            <v-icon small>fab fa-reddit</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex shrink pr-3>
                        <v-btn flat icon color="grey darken-2">
                            <v-icon small>fa-edit</v-icon>
                        </v-btn>
                        <v-btn flat icon color="grey darken-2">
                            <v-icon small>fa-ban</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Store } from "../interfaces/Store";
import Vote from "@/components/Vote.vue";

@Component({
    components: { Vote }
})
export default class StoreInfo extends Vue {
    @Prop() storeId!: number;
    store!: Store;

    imageUrl: string = "https://www.luckythunder.com/img/ogimage.png";

    breadCrumb: any;

    async created() {
        this.store = this.$store.getters.getStore(this.storeId);
        this.breadCrumb = [
            {
                text: "Stores",
                disabled: false,
                href: "/"
            },
            {
                text: this.store.name,
                disabled: false,
                href: location.href
            }
        ];
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
