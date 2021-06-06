<template>
    <v-flex xs12 sm6 md6 lg4 pa-3>
        <v-card hover @click.native="gotoStore()">
            <div class="chips">
                <v-chip v-if="storeWithScore.rank !== 'unranked'" color="#fdb919" text-color="white" class="ma-2">{{ storeWithScore.rank }}</v-chip>
                <v-chip v-if="storeWithScore.trending >= 10" color="purple" text-color="white" class="ma-2">Trending</v-chip>
                <v-chip v-if="isNewStore" color="green" text-color="white" class="ma-2">New</v-chip>
            </div>

            <vuetify-lazy-image
                :src="`${baseUrl}thumbnails/${storeWithScore.id}.jpg`"
                height="170px"
                :position="!storeWithScore.img_position ? 'top center' : storeWithScore.img_position"
                class="text-xs-right"
            ></vuetify-lazy-image>
            <v-layout>
                <vote v-bind:store="storeWithScore" :sort="sort"></vote>

                <v-flex>
                    <v-card-title primary-title class="pa-2">
                        <div>
                            <div class="headline">
                                <a class="store-link" @click.stop :href="storeWithScore.href"
                                    >{{ storeWithScore.name }}<v-icon small class="pa-2 pt-1 link-icon" color="#1976d2">fa-external-link-alt</v-icon></a
                                >
                            </div>
                            <span class="">{{ storeWithScore.description.substring(0, 96) }}{{ storeWithScore.description.length > 96 ? "..." : "" }}</span>
                        </div>
                    </v-card-title>
                </v-flex>
                <div class="comments-icon pa-1" v-if="storeWithScore.commentCount > 0">
                    <v-icon small>fa-comment</v-icon><span class="pl-1 pr-1">{{ storeWithScore.commentCount }}</span>
                    <!-- thumbs_up_down -->
                </div>
            </v-layout>
        </v-card>
    </v-flex>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Store } from "../interfaces/Store";
import { Score } from "../interfaces/Score";
import Vote from "@/components/Vote.vue";
//@ts-ignore
import VuetifyLazyImage from "vuetify-lazy-image";

@Component({
    components: {
        Vote,
        VuetifyLazyImage,
    },
})
export default class StoreCard extends Vue {
    @Prop() store!: Store;
    @Prop() baseUrl!: string;
    @Prop() sort!: string;

    storeWithScore: Store = this.store;

    mounted() {
        let score = this.$store.getters.getScore(this.store.id);
        this.storeWithScore = Object.assign({}, this.store, score);
    }

    private gotoStore() {
        this.$router.push({ path: `/store/${this.store.id}` });
    }

    get isNewStore(): boolean {
        return new Date(this.store.added * 1000 + 1000 * 60 * 60 * 24 * 8) > new Date();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.store-link {
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
}
.chips {
    position: absolute;
    z-index: 7;
    width: 100%;
    .v-chip {
        float: right;
    }
}
.link-icon {
    padding-top: 9px !important;
    padding-bottom: 7px !important;
    text-decoration: none;
}
.comments-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 13px;
}
</style>
