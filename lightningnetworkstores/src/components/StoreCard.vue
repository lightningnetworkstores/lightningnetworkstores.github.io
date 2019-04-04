<template>
    <div class="store-card">
        <v-layout justify-center class="my-4">
            <v-flex xs11 md8 lg4>
                <v-card hover @click.native="gotoStore()">
                    <v-img src="https://www.luckythunder.com/img/ogimage.png" height="100px"><v-chip color="green" text-color="white" class="ma-2">Trending</v-chip></v-img>
                    <v-layout>
                        <div class="text-xs-center vote">
                            <v-flex xs12>
                                <v-btn icon><v-icon>arrow_upward</v-icon></v-btn>
                            </v-flex>

                            <v-flex xs12>
                                <span>50m</span>
                            </v-flex>

                            <v-flex xs12>
                                <v-btn icon><v-icon>arrow_downward</v-icon></v-btn>
                            </v-flex>
                            <!-- <v-btn absolute color="orange" class="white--text " fab small>
                                <v-icon>arrow_upward</v-icon>
                            </v-btn>
                            <v-btn absolute color="orange" class="white--text" fab small>
                                <v-icon>arrow_downward</v-icon>
                            </v-btn> -->
                        </div>

                        <v-flex>
                            <v-card-title primary-title class="pa-2">
                                <div>
                                    <div class="headline">LuckyThunder</div>
                                    <span class="grey--text"
                                        >LuckyThunder is a slot machine build on top of the bitcoin lightning network⚡. No login required, provably fair, high win percentage.</span
                                    >
                                </div>
                            </v-card-title>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
        <!-- <v-layout justify-center class="my-4">
            <v-flex xs11 md8 lg5>
                <v-card hover>
                    <v-layout>
                        <v-card-title primary-title>
                            <div>
                                <div class="headline">LuckyThunder</div>
                                <span class="grey--text">LuckyThunder is a slot machine build on top of the bitcoin lightning network⚡. No login required, provably fair, high win percentage.</span>
                            </div>
                        </v-card-title>
                        <v-img src="https://www.luckythunder.com/img/ogimage.png" height="150px" width="250px"></v-img>
                    </v-layout>
                    <v-divider light></v-divider>
                    <v-card-actions class="pa-3">
                        Rate this album
                        <v-spacer></v-spacer>
                        <v-icon>star_border</v-icon>
                        <v-icon>star_border</v-icon>
                        <v-icon>star_border</v-icon>
                        <v-icon>star_border</v-icon>
                        <v-icon>star_border</v-icon>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout> -->
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StoreCard extends Vue {
    private gotoStore() {
        const storeId = 2;
        this.$router.push({ path: `/store/${storeId}` });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.vote {
    width: 50px;
}
</style>
