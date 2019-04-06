<template>
    <div class="store-card">
        <v-layout justify-center class="my-4">
            <v-flex xs11 md8 lg4>
                <v-card hover @click.native="gotoStore()">
                    <v-img :src="imageUrl" height="100px"><v-chip color="green" text-color="white" class="ma-2">Trending</v-chip></v-img>
                    <v-layout>
                        <div class="text-xs-center vote">
                            <v-flex xs12>
                                <v-btn icon @click.stop="vote(true)"><v-icon>arrow_upward</v-icon></v-btn>
                            </v-flex>

                            <v-flex xs12>
                                <span>50m</span>
                            </v-flex>

                            <v-flex xs12>
                                <v-btn icon @click.stop="vote(false)"><v-icon>arrow_downward</v-icon></v-btn>
                            </v-flex>
                        </div>

                        <v-flex>
                            <v-card-title primary-title class="pa-2">
                                <div>
                                    <div class="headline">
                                        <a class="store-link" :href="store.href">{{ store.name }}</a>
                                    </div>
                                    <span class="grey--text">{{ store.description }}</span>
                                </div>
                            </v-card-title>
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

const grabity = require("grabity");

@Component
export default class StoreCard extends Vue {
    @Prop() store!: Store;
    imageUrl: string = "";

    async created() {
        //this.imageUrl = await this.getImageUrl();
    }

    private async getImageUrl(): Promise<string> {
        let url = this.store.href.replace(/^((\w+:)?\/\/[^\/]+\/?).*$/, "$1");

        try {
            let grabbed = await grabity.grabIt(url);
            if ("image" in grabbed) {
                return grabbed.image;
            } else if ("favicon" in grabbed) {
                return grabbed.favicon;
            }
            return "";
        } catch (error) {}

        return "";
    }

    private gotoStore() {
        this.$router.push({ path: `/store/${this.store.id}` });
    }

    private vote(upvote: boolean) {
        if (upvote) {
            console.log("upvote");
        } else {
            console.log("downvote");
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.vote {
    width: 50px;
}
.store-link {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.87);
    &:hover {
        text-decoration: underline;
    }
}
</style>
