<template>
    <div class="home">
        <StoreList />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StoreList from "@/components/StoreList.vue"; // @ is an alias to /src

@Component({
    components: {
        StoreList
    }
})
export default class Home extends Vue {}
</script>
