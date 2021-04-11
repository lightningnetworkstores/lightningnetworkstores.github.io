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
                    <a class="store-image-link" :href="store.href">
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
                    </a>
                    <v-layout row px-3 pt-3>
                        <v-flex pb-1 shrink>
                            <div class="headline">
                                <h3>
                                    <a class="store-link" @click.stop :href="store.href">{{ store.name }}</a>
                                </h3>
                            </div>
                        </v-flex>
                        <v-flex pa-2 pl-2 grow>
                            <a @click.stop :href="store.href" class="link-icon"><v-icon small class="pb-2" color="#1976d2">fa-external-link-alt</v-icon></a>
                        </v-flex>
                    </v-layout>

                    <v-layout row px-3 pb-2>
                        <v-flex pb-1 shrink>
                            <v-hover v-for="(tag, index) in store.tags" :key="index">
                                <v-chip slot-scope="{ hover }" color="primary" outline>
                                    <v-icon v-if="hover" left class="tag-icon mr-1" @click="upvoteTag(tag)">add_circle</v-icon><b>{{ tag }}</b>
                                    <v-icon v-if="hover" right class="tag-icon ml-1" @click="downvoteTag(likely_tag)">
                                        remove_circle
                                    </v-icon>
                                </v-chip>
                            </v-hover>
                            <v-hover v-for="(likely_tag, index) in store.likely_tags" :key="index">
                                <v-chip slot-scope="{ hover }" color="grey lighten-1" outline>
                                    <v-icon v-if="hover" left class="tag-icon mr-1" @click="upvoteTag(likely_tag)">add_circle</v-icon>{{ likely_tag }}
                                    <v-icon v-if="hover" right class="tag-icon ml-1" @click="downvoteTag(likely_tag)">
                                        remove_circle
                                    </v-icon>
                                </v-chip>
                            </v-hover>

                            <v-chip color="primary" outline>
                                <b>new tag</b>
                                <v-icon right class="tag-icon ml-1" @click="showAddTagDialog = true">
                                    add_circle
                                </v-icon>
                            </v-chip>

                            <v-snackbar v-model="snackbar" class="m-3">
                                {{ snackbarText }}

                                <v-btn color="red" flat text @click="snackbar = false">
                                    Close
                                </v-btn>
                            </v-snackbar>
                        </v-flex>
                    </v-layout>

                    <!-- Add store modal -->
                    <v-dialog v-model="showAddTagDialog" max-width="500" persistent>
                        <v-card>
                            <!-- paymentRequest && isPaid -->
                            <v-card-title class="headline">
                                <v-layout row>
                                    <v-flex>Suggest new tag</v-flex>
                                </v-layout>
                            </v-card-title>

                            <v-form @submit.prevent="suggestTags" ref="suggestTagForm">
                                <v-layout row>
                                    <v-flex px-3>
                                        <v-combobox
                                            v-model="newTags"
                                            :items="store.configuration.tags"
                                            :search-input.sync="search"
                                            hide-selected
                                            hint="Maximum of 5 tags"
                                            label="Add some tags"
                                            multiple
                                            persistent-hint
                                            small-chips
                                            :rules="[(v) => !!v.length || 'Required']"
                                        >
                                            <template v-slot:no-data>
                                                <v-list-tile-content>
                                                    <v-list-tile-title class="px-2"
                                                        >No results matching "<strong>{{ search }}</strong
                                                        >". Press <kbd>enter</kbd> to create a new one</v-list-tile-title
                                                    >
                                                </v-list-tile-content>
                                            </template>
                                        </v-combobox>
                                    </v-flex>
                                </v-layout>

                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn color="green darken-1" flat="flat" @click="showAddTagDialog = false">
                                        Close
                                    </v-btn>

                                    <v-btn color="green darken-1" flat="flat" type="submit">
                                        Submit
                                    </v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card>
                    </v-dialog>

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

                    <v-layout row v-if="store.sector && store.sector.length > 0" pl-3 pr-3
                        ><b>Lifetime score: &nbsp;</b><span v-if="store.lifetime"> {{ store.lifetime | number }}</span
                        ><span v-else>0</span></v-layout
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
                            <div class="headline font-weight-medium">Reviews</div>
                        </div>
                    </v-card-title>
                    <v-layout row>
                        <v-flex pl-3 pr-3 pb-3>To leave a review, up or downvote the store.</v-flex>
                    </v-layout>
                    <v-layout row pa-2 class="text-xs-center">
                        <v-flex grow justify-center pa-3
                            ><v-btn fab @click="filter('positive')" :outline="currentFilter !== 'positive'" color="success"
                                ><v-icon :color="currentFilter == 'positive' ? 'white' : 'success'" large>thumb_up</v-icon></v-btn
                            >
                            <h4>Positive: {{ store.comments.filter((comment) => comment.parent == "null" && comment.score > 0).length }}</h4>
                        </v-flex>
                        <v-flex grow justify-center pa-3
                            ><v-btn fab @click="filter('all')" :outline="currentFilter !== 'all'" color="blue"
                                ><v-icon :color="currentFilter == 'all' ? 'white' : 'blue'" large>thumbs_up_down</v-icon></v-btn
                            >
                            <h4>All: {{ store.comments.filter((comment) => comment.parent == "null").length }}</h4></v-flex
                        >
                        <v-flex grow justify-center pa-3
                            ><v-btn fab @click="filter('negative')" :outline="currentFilter !== 'negative'" color="error"
                                ><v-icon :color="currentFilter == 'negative' ? 'white' : 'error'" large>thumb_down</v-icon></v-btn
                            >
                            <h4>Negative: {{ store.comments.filter(comment => comment.parent == "null" && comment.score &lt; 0).length }}</h4></v-flex
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
import $ from "jquery";

@Component({
    components: { Vote, BanStoreModal, EditStoreModal, EmbedModal, Review },
})
export default class StoreInfo extends Vue {
    @Prop() storeId!: number;
    store!: Store;
    baseUrl: string = "";
    breadCrumb: any;
    loaded: boolean = false;

    comments: Comment[] = [];
    currentFilter: string = "all";

    snackbar = false;
    snackbarText = "";
    tagUpvoteText = "Tag upvoted";
    tagDownvoteText = "Tag downvoted";
    tagSuggestText = "Tag submitted";
    showAddTagDialog = false;
    newTags = [];

    private filter(filter: string) {
        this.currentFilter = filter;
        switch (filter) {
            case "all":
                this.comments = this.store.comments.filter((comment) => comment.parent == "null");
                break;
            case "negative":
                this.comments = this.store.comments.filter((comment) => comment.parent == "null" && comment.score < 0);
                break;
            case "positive":
                this.comments = this.store.comments.filter((comment) => comment.parent == "null" && comment.score > 0);
                break;
            default:
                this.comments = this.store.comments.filter((comment) => comment.parent == "null");
                break;
        }
        this.comments.sort((a, b) => {
            if (Math.abs(b.score) !== Math.abs(a.score)) {
                return Math.abs(b.score) - Math.abs(a.score);
            }
            return b.timestamp - a.timestamp;
        });
    }

    mounted() {
        this.loaded = false;

        this.baseUrl = this.$store.getters.getBaseUrl();

        this.$store.dispatch("getStore", { id: this.storeId }).then(
            (response) => {
                this.store = response.data;
                this.setMetaTags();
                this.comments = this.store.comments
                    .filter((comment) => comment.parent == "null")
                    .sort((a, b) => {
                        if (Math.abs(b.score) !== Math.abs(a.score)) {
                            return Math.abs(b.score) - Math.abs(a.score);
                        }
                        return b.timestamp - a.timestamp;
                    });
                this.comments.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
                this.breadCrumb = [
                    {
                        text: "Stores",
                        disabled: false,
                        href: "/",
                    },
                    {
                        text: this.store.name,
                        disabled: false,
                        href: location.href,
                    },
                ];
                this.loaded = true;
            },
            (error) => {
                console.error(error);
            }
        );
    }

    private setMetaTags() {
        document.title = this.store.name + " | Lightning Network Stores";
        document.getElementsByTagName("meta")["description"].content = this.store.description;
        $('meta[property="og:description"]').attr("content", this.store.description);
        $('meta[property="og:title"]').attr("content", document.title);
        document.getElementsByTagName("meta")["twitter:description"].content = this.store.description;
        document.getElementsByTagName("meta")["twitter:title"].content = document.title;
    }

    get isNewStore(): boolean {
        return new Date(this.store.added * 1000 + 1000 * 60 * 60 * 24 * 8) > new Date();
    }

    upvoteTag(tag: string) {
        this.$store.dispatch("suggestTag", { storeId: this.store.id, tag: tag }).then(
            (response) => {
                this.snackbarText = this.tagUpvoteText;
                this.snackbar = true;
            },
            (error) => {
                console.error(error);
            }
        );
    }

    downvoteTag(tag: string) {
        this.$store.dispatch("removeTag", { storeId: this.store.id, tag: tag }).then(
            (response) => {
                this.snackbarText = this.tagDownvoteText;
                this.snackbar = true;
            },
            (error) => {
                console.error(error);
            }
        );
    }

    suggestTags() {
        if ((this.$refs.suggestTagForm as Vue & { validate: () => boolean }).validate()) {
            this.$store.dispatch("suggestTags", { storeId: this.store.id, tag: this.newTags }).then(
                (response) => {
                    this.snackbarText = this.tagSuggestText;
                    this.snackbar = true;
                },
                (error) => {
                    console.error(error);
                }
            );
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.store-link {
    &:hover {
        text-decoration: underline;
    }
}
.link-icon {
    text-decoration: none;
}
.store-image-link {
    text-decoration: none;
}

.tag-icon {
    cursor: pointer;
    &:hover {
        filter: brightness(120%);
    }
}
</style>
