<template>
    <div class="store-list">
        <v-layout justify-center>
            <v-flex xs12 md12 lg12>
                <v-container grid-list-md style="padding-top: 0px;">
                    <v-layout row wrap>
                        <store-card v-for="store in getStores.slice(0, maxCards)" :key="store.id" :store="store" :baseUrl="baseUrl" :sort="sort"></store-card>
                    </v-layout>
                </v-container>
                <v-container fill-height v-if="isLoading">
                    <v-layout row justify-center align-center>
                        <v-progress-circular indeterminate :size="70" :width="7" color="#fdb919"></v-progress-circular>
                    </v-layout>
                </v-container>
                <v-container v-if="maxCards < getStores.length">
                    <v-layout row justify-center align-center>
                        <v-btn color="primary" @click="loadMoreCards()">Load more</v-btn>
                    </v-layout>
                </v-container>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Store } from "../interfaces/Store";
import StoreCard from "@/components/StoreCard.vue";

@Component({
    components: {
        StoreCard,
    },
})
export default class StoreList extends Vue {
    @Prop() sector!: string;
    @Prop() digitalGoods!: string;
    @Prop() sort!: string;
    @Prop() search!: string;
    @Prop() safeMode!: string;

    baseUrl: string = "";

    isLoading: boolean = true;

    maxCards: number = 15;
    maxCardAtStart: number = 15;
    addCardCount: number = 6;

    selectedTags: any = [];

    async mounted() {
        await this.$store.dispatch("getScores");
        await this.$store.dispatch("getStores");

        this.baseUrl = this.$store.getters.getBaseUrl();

        window.onscroll = (ev: any) => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                this.loadMoreCards();
            }
        };

        this.$forceUpdate();

        this.$nextTick(() => {
            this.isLoading = false;
        });
    }

    private loadMoreCards() {
        this.maxCards += this.addCardCount;
    }

    @Watch("sector")
    private onSectorChanged(val: string, oldVal: string) {
        this.maxCards = this.maxCardAtStart;
        this.$forceUpdate();
    }

    @Watch("digitalGoods")
    private onDigitalGoodsChanged(val: string, oldVal: string) {
        this.maxCards = this.maxCardAtStart;
        this.$forceUpdate();
    }

    @Watch("sort")
    private onSortChanged(val: string, oldVal: string) {
        this.maxCards = this.maxCardAtStart;
        this.$forceUpdate();
    }

    @Watch("search")
    private onSearchChanged(val: string, oldVal: string) {
        this.maxCards = this.maxCardAtStart;
        this.$forceUpdate();
    }

    get getStores() {
        if (!this.selectedTags.length) return [];

        return this.selectedTags.filter((x: any) => x.checked).length
            ? this.$store.getters.getStores({ sector: this.sector, digitalGoods: this.digitalGoods }, this.sort, this.search, this.safeMode).filter((x: any) => {
                  return !!x.tags.filter((y: any) => {
                      const tagIndex = this.getConfiguration.tags.indexOf(y);
                      return this.selectedTags[tagIndex] ? this.selectedTags[tagIndex].checked : false;
                  }).length;
              })
            : this.$store.getters.getStores({ sector: this.sector, digitalGoods: this.digitalGoods }, this.sort, this.search, this.safeMode);
    }

    @Watch("getSelectedTags", { deep: true })
    private onSelectedTagsChanged(val: string, oldVal: string) {
        this.selectedTags = this.getSelectedTags;
    }

    get getSelectedTags() {
        return this.$store.getters.getSelectedTags();
    }

    get getConfiguration() {
        return this.$store.getters.getConfiguration();
    }
}
</script>

<style scoped lang="scss"></style>
