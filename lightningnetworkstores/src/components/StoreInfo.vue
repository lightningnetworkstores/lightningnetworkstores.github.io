<template>
    <div class="store-info" v-if="loaded">
        <div>
            <v-breadcrumbs :items="breadCrumb">
                <template v-slot:divider>
                    <v-icon>chevron_right</v-icon>
                </template>
            </v-breadcrumbs>
        </div>
        <v-layout justify-center row wrap class="my-4">
            <v-flex xs11 md8 lg6>
                <v-card>
                    <v-img :src="`${baseUrl}thumbnails/${store.id}.png`" max-height="500px" aspect-radio="1.6" position="top center" class="text-xs-right"
                        ><v-chip v-if="isNewStore" color="green" text-color="white" class="ma-2">New</v-chip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-chip v-if="score.trending > 0" color="purple" text-color="white">
                                    {{ score.trending }}%

                                    <v-icon v-on="on" pr-2 small right>fa-fire</v-icon>
                                </v-chip>
                            </template>
                            <span>Trending score</span>
                        </v-tooltip>
                        <v-chip v-if="store.rank > 0" color="orange" text-color="white" class="ma-2">#{{ store.rank }}</v-chip>
                        <!-- <v-chip color="orange" text-color="white" class="ma-2">{{ score.rank }}</v-chip> -->
                    </v-img>
                    <v-layout row pa-3>
                        <v-flex pb-1>
                            <a class="store-link" @click.stop :href="store.href"
                                ><h1>{{ store.name }} <v-icon small class="pb-2">fa-external-link-alt</v-icon></h1></a
                            >
                        </v-flex>
                    </v-layout>

                    <v-layout row pb-3 pl-3 pr-3>
                        <v-flex>{{ store.description }} </v-flex>
                    </v-layout>

                    <!-- <v-layout row pb-3><a @click.stop :href="store.href">Visit website</a></v-layout> -->
                    <v-layout row v-if="store.uri && store.uri.toLowerCase() != 'unknown'" pl-3 pr-3>
                        <span class="break-word"
                            ><b>Node:&nbsp;</b><a :href="'https://1ml.com/node/' + store.uri.split('@')[0]">{{ store.uri }}</a></span
                        ></v-layout
                    >
                    <v-layout row v-if="store.digital_goods.length" pl-3 pr-3><b>Digital goods:&nbsp;</b>{{ store.digital_goods }}</v-layout>
                    <v-layout row v-if="store.sector.length" pl-3 pr-3
                        ><b>Sector:&nbsp;</b><router-link :to="'/?sector=' + encodeURIComponent(store.sector)">{{ store.sector }}</router-link></v-layout
                    >
                    <v-layout row v-if="store.sector.length" pl-3 pr-3
                        ><b>Date added:&nbsp;</b><span v-if="store.added"> {{ new Date(store.added * 1000).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) }}</span
                        ><a v-else>24/Feb/2018</a></v-layout
                    >

                    <vote v-bind:store="store" v-bind:isInfo="true"></vote>

                    <v-layout row pb-3 pl-2 pr-2 pt-3>
                        <v-flex grow>
                            <v-btn flat icon color="blue" :disabled="!store.twitter" :href="'https://twitter.com/' + store.twitter">
                                <v-icon>fab fa-twitter</v-icon>
                            </v-btn>

                            <v-btn flat icon color="blue darken-3" :disabled="!store.facebook" :href="'https://facebook.com/' + store.facebook">
                                <v-icon>fab fa-facebook</v-icon>
                            </v-btn>

                            <v-btn flat icon color="orange darken-2" :disabled="!store.reddit" :href="'https://reddit.com/users/' + store.reddit">
                                <v-icon>fab fa-reddit</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex shrink>
                            <v-btn flat icon color="grey darken-2">
                                <edit-store-modal :store="store"></edit-store-modal>
                            </v-btn>
                            <v-btn flat icon color="grey darken-2">
                                <ban-store-modal :store="store"></ban-store-modal>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Store } from "../interfaces/Store";
import { Score } from "../interfaces/Score";
import Vote from "@/components/Vote.vue";
import BanStoreModal from "@/components/BanStoreModal.vue";
import EditStoreModal from "@/components/EditStoreModal.vue";

@Component({
    components: { Vote, BanStoreModal, EditStoreModal }
})
export default class StoreInfo extends Vue {
    @Prop() storeId!: number;
    store!: Store;
    baseUrl: string = "";
    breadCrumb: any;
    loaded: boolean = false;
    score!: Score;

    mounted() {
        this.loaded = false;

        this.baseUrl = this.$store.getters.getBaseUrl();

        this.$store.dispatch("getStore", { id: this.storeId }).then(
            response => {
                console.log(response.data);
                this.store = response.data;
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
                this.loaded = true;
            },
            error => {
                console.error(error);
            }
        );

        this.score = this.$store.getters.getScore(this.storeId);
    }

    get isNewStore(): boolean {
        return new Date(this.store.added * 1000 + 86400000 * 20) > new Date();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.store-link {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.87);
}
</style>
