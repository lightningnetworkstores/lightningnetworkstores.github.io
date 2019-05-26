<template>
    <div class="store-info" v-if="loaded">
        <div>
            <v-breadcrumbs :items="breadCrumb">
                <template v-slot:divider>
                    <v-icon>chevron_right</v-icon>
                </template>
            </v-breadcrumbs>
        </div>
        <v-layout justify-center row wrap class="my-2">
            <v-flex xs11 md8 lg6>
                <v-card>
                    <v-img :src="`${baseUrl}thumbnails/${store.id}.png`" max-height="500px" aspect-radio="1.6" position="top center" class="text-xs-right"
                        ><v-chip v-if="isNewStore" color="green" text-color="white" class="ma-2">New</v-chip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-chip v-if="store.trending > 0" color="purple" text-color="white" v-on="on">
                                    {{ store.trending }}%

                                    <v-icon v-on="on" pr-2 small right>fa-fire</v-icon>
                                </v-chip>
                            </template>
                            <span>Trending score</span>
                        </v-tooltip>
                        <v-chip v-if="store.rank > 0" color="#fdb919" text-color="white" class="ma-2">#{{ store.rank }}</v-chip>
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
                    <v-layout row v-if="store.digital_goods && store.digital_goods.length > 0" pl-3 pr-3><b>Digital goods:&nbsp;</b>{{ store.digital_goods }}</v-layout>
                    <v-layout row v-if="store.sector && store.sector.length > 0" pl-3 pr-3
                        ><b>Sector:&nbsp;</b><router-link :to="'/?sector=' + encodeURIComponent(store.sector)">{{ store.sector }}</router-link></v-layout
                    >
                    <v-layout row v-if="store.sector && store.sector.length > 0" pl-3 pr-3
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
                                <embed-modal :store="store" :baseUrl="baseUrl"></embed-modal>
                            </v-btn>
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

        <v-layout justify-center row wrap class="my-4">
            <v-flex xs11 md8 lg6>
                <v-card>
                    <v-card-title primary-title class="pa-3">
                        <div>
                            <div class="headline font-weight-medium">
                                Reviews: (<a @click="filter('all')">{{ store.comments.filter(comment => comment.parent == "null").length }}</a
                                >)
                            </div>
                        </div>
                    </v-card-title>
                    <v-layout row>
                        <v-flex pl-3 pr-3 pb-3>To leave a review up or down vote the store.</v-flex>
                    </v-layout>
                    <v-layout row pa-2 class="text-xs-center">
                        <v-flex grow justify-center pa-3
                            ><v-btn fab @click="filter('positive')" outline color="success"><v-icon color="success" large>thumb_up</v-icon></v-btn>
                            <h3>
                                Positive reviews: (<a @click="filter('positive')">{{ store.comments.filter(comment => comment.parent == "null" && comment.score > 0).length }}</a
                                >)
                            </h3>
                        </v-flex>
                        <v-flex grow justify-center pa-3
                            ><v-btn fab @click="filter('negative')" outline color="error"><v-icon color="error" large>thumb_down</v-icon></v-btn>
                            <h3>
                                Negative reviews: (<a @click="filter('negative')">{{ store.comments.filter(comment => comment.parent == "null" && comment.score &lt; 0).length }}</a
                                >)
                            </h3></v-flex
                        >
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>

        <Review v-for="comment in comments" :key="comment.id" :comment="comment" :comments="store.comments" :store="store"></Review>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Store } from "../interfaces/Store";
import Vote from "@/components/Vote.vue";
import BanStoreModal from "@/components/BanStoreModal.vue";
import EditStoreModal from "@/components/EditStoreModal.vue";
import EmbedModal from "@/components/EmbedModal.vue";
import Review from "@/components/Review.vue";
import { Comment } from "../interfaces/Comment";

@Component({
    components: { Vote, BanStoreModal, EditStoreModal, EmbedModal, Review }
})
export default class StoreInfo extends Vue {
    @Prop() storeId!: number;
    store!: Store;
    baseUrl: string = "";
    breadCrumb: any;
    loaded: boolean = false;

    comments: Comment[] = [];

    private filter(filter: string) {
        switch (filter) {
            case "all":
                this.comments = this.store.comments.filter(comment => comment.parent == "null");
                break;
            case "negative":
                this.comments = this.store.comments.filter(comment => comment.parent == "null" && comment.score < 0);
                break;
            case "positive":
                this.comments = this.store.comments.filter(comment => comment.parent == "null" && comment.score > 0);
                break;
            default:
                this.comments = this.store.comments.filter(comment => comment.parent == "null");
                break;
        }
    }

    mounted() {
        this.loaded = false;

        this.baseUrl = this.$store.getters.getBaseUrl();

        this.$store.dispatch("getStore", { id: this.storeId }).then(
            response => {
                this.store = response.data;
                this.comments = this.store.comments.filter(comment => comment.parent == "null");
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
