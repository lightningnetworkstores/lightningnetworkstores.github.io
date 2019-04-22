<template>
    <div class="home">
        <StoreListFilter v-bind:sector="decodeURI(sector)" v-bind:digitalGoods="decodeURI(digitalGoods)" />
        <StoreList v-bind:sector="decodeURI(sector)" v-bind:digitalGoods="decodeURI(digitalGoods)" />
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
}
</script>
