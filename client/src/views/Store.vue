<template>
    <div class="store">
        <store-info v-bind:store-id="storeId"></store-info>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import StoreInfo from "@/components/StoreInfo.vue";

@Component({
    components: {
        StoreInfo,
    },
})
export default class Store extends Vue {
    @Prop() storeId!: number;
}
</script>
