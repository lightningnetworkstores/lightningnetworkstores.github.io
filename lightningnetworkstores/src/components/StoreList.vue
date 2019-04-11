<template>
    <div class="store-list">
        <store-card v-for="store in stores" v-bind:key="store.id" v-bind:store="store"></store-card>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import { Store } from "../interfaces/Store";
import StoreCard from "@/components/StoreCard.vue";

@Component({
    components: {
        StoreCard
    }
})
export default class StoreList extends Vue {
    @State
    stores!: Store[];

    created() {
        console.log("Stores: " + this.stores.length);
    }
}
</script>

<style scoped lang="scss">
</style>
