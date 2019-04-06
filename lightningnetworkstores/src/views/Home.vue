<template>
    <div class="home">
        <StoreList />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StoreList from "@/components/StoreList.vue";

@Component({
    components: {
        StoreList
    }
})
export default class Home extends Vue {}
</script>
