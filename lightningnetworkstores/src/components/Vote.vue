<template>
    <div class="vote">
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
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Store } from "../interfaces/Store";

@Component
export default class StoreCard extends Vue {
    @Prop() storeId!: number;

    async created() {}

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
</style>
