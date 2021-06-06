<template>
    <div class="pa-2">
        <h1 class="title">Tags</h1>
        <template v-if="selectedTags.length">
            <v-checkbox class="checkbox-height" color="#fdb919" v-model="selectedTags[index].checked" v-for="(tag, index) in configuration.tags" :key="tag" :label="tag"></v-checkbox>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
    components: {},
})
export default class StoreDrawer extends Vue {
    selectedTags = [];
    async mounted() {}

    @Watch("configuration")
    private onConfigurationChanged(val: string, oldVal: string) {
        this.selectedTags = this.configuration.tags.map(() => {
            return {
                checked: false,
            };
        });
        this.$forceUpdate();
    }

    @Watch("selectedTags", { deep: true })
    private onSelectedTagsChanged(val: string, oldVal: string) {
        this.$store.commit("setSelectedTags", this.selectedTags);
    }

    get configuration() {
        return this.$store.getters.getConfiguration();
    }
}
</script>

<style scoped lang="scss">
.checkbox-height {
    height: 15px;
    text-transform: capitalize;
}
</style>
