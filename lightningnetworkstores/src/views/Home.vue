<template>
    <div class="home">
        <StoreListFilter v-bind:sector="decodeURI(sector)" v-bind:digitalGoods="decodeURI(digitalGoods)" v-bind:sort="decodeURI(sort)" />
        <StoreList v-bind:sector="decodeURI(sector)" v-bind:digitalGoods="decodeURI(digitalGoods)" v-bind:sort="decodeURI(sort)" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import StoreList from "@/components/StoreList.vue";
import StoreListFilter from "@/components/StoreListFilter.vue";

@Component({
    components: {
        StoreList,
        StoreListFilter
    }
})
export default class Home extends Vue {
    @Prop() sector!: string;
    @Prop() digitalGoods!: string;
    @Prop() sort!: string;

    beforeCreate() {
        console.log("home beforeCreate");
        //this.$store.dispatch("fetchStores");
        //this.$store.dispatch("fetchScores");
    }
}
</script>
