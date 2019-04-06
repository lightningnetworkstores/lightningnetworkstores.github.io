<template>
    <div class="store-info">
        <h1>{{ store.name }}</h1>
        {{ store.description }}
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Store } from "../interfaces/Store";

@Component
export default class StoreInfo extends Vue {
    @Prop() storeId!: number;
    store!: Store;

    async created() {
        this.store = this.$store.getters.getStore(this.storeId);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
