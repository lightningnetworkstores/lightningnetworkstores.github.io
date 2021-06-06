<template>
    <div class="home">
        <v-layout row class="min-hight">
            <v-flex shrink :class="{ hide: !showPermanentDrawer }">
                <v-navigation-drawer :permanent="showPermanentDrawer" :value="showDrawer" :absolute="showDrawer">
                    <store-drawer></store-drawer>
                </v-navigation-drawer>
            </v-flex>
            <v-flex grow pa-1>
                <StoreListFilter
                    v-bind:sector="decodeURIComponent(sector)"
                    v-bind:digitalGoods="decodeURIComponent(digitalGoods)"
                    v-bind:sort="decodeURIComponent(sort)"
                    v-bind:search="decodeURIComponent(search)"
                    v-bind:safeMode="safeMode"
                    @toggle-drawer="toggleDrawer"
                />
                <StoreList
                    v-bind:sector="decodeURIComponent(sector)"
                    v-bind:digitalGoods="decodeURIComponent(digitalGoods)"
                    v-bind:sort="decodeURIComponent(sort)"
                    v-bind:search="decodeURIComponent(search)"
                    v-bind:safeMode="safeMode"
                />
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import StoreList from "@/components/StoreList.vue";
import StoreListFilter from "@/components/StoreListFilter.vue";
import StoreDrawer from "@/components/StoreDrawer.vue";

@Component({
    components: {
        StoreList,
        StoreListFilter,
        StoreDrawer,
    },
})
export default class Home extends Vue {
    @Prop() sector!: string;
    @Prop() digitalGoods!: string;
    @Prop() sort!: string;
    @Prop() search!: string;
    @Prop() safeMode!: boolean;

    windowWidth = 0;
    showDrawer = false;

    mounted() {
        window.addEventListener("resize", () => {
            this.windowWidth = window.innerWidth;
        });
        this.windowWidth = window.innerWidth;
    }

    get showPermanentDrawer(): boolean {
        const value = this.windowWidth > 1510;
        return value;
    }

    toggleDrawer() {
        this.showDrawer = !this.showDrawer;
    }
}
</script>
<style scoped>
.min-height {
    min-height: calc(100vh - 124px);
}
.hide {
    width: 0;
}
aside {
    z-index: 99;
}
</style>
