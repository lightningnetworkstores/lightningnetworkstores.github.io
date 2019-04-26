<template>
    <v-flex xs12 sm6 md4 lg4 pa-3>
        <v-card hover @click.native="gotoStore()">
            <v-img :src="image" max-height="170px" position="top center" class="text-xs-right"
                ><v-chip v-if="score.trending >= 8" color="purple" text-color="white" class="ma-2">Trending</v-chip
                ><v-chip v-if="isNewStore" color="green" text-color="white" class="ma-2">New</v-chip></v-img
            >
            <v-layout>
                <vote v-bind:store="store"></vote>

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
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Store } from "../interfaces/Store";
import Vote from "@/components/Vote.vue";

@Component({
    components: {
        Vote
    }
})
export default class StoreCard extends Vue {
    @Prop() store!: Store;
    image: any = {};
    score: any = {};

    async created() {
        this.image = this.$store.getters.getImage(this.store.id);
        this.score = this.$store.getters.getScore(this.store.id);
    }

    private gotoStore() {
        this.$router.push({ path: `/store/${this.store.id}` });
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
    &:hover {
        text-decoration: underline;
    }
}
</style>
