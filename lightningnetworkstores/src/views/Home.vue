<template>
    <div class="home">
        <StoreListFilter v-bind:sector="decodeURIComponent(sector)" v-bind:digitalGoods="decodeURIComponent(digitalGoods)" v-bind:sort="decodeURIComponent(sort)" v-bind:search="decodeURIComponent(search)" />
        <StoreList v-bind:sector="decodeURIComponent(sector)" v-bind:digitalGoods="decodeURIComponent(digitalGoods)" v-bind:sort="decodeURIComponent(sort)" v-bind:search="decodeURIComponent(search)" />
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
    @Prop() search!: string;
}
</script>
