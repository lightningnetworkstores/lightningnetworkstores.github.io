<template>
    <div class="store-card">
        <v-layout justify-center class="my-4">
            <v-flex xs11 md8 lg4>
                <v-card hover @click.native="gotoStore()">
                    <v-img :src="imageUrl"><v-chip color="green" text-color="white" class="ma-2">Trending</v-chip></v-img>
                    <v-layout>
                        <vote v-bind:storeId="store.id"></vote>

                        <v-flex>
                            <v-card-title primary-title class="pa-2">
                                <div>
                                    <div class="headline">
                                        <a class="store-link" @click.stop :href="store.href">{{ store.name }}</a>
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
import Vote from "@/components/Vote.vue";

const grabity = require("grabity");

@Component({
    components: {
        Vote
    }
})
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
