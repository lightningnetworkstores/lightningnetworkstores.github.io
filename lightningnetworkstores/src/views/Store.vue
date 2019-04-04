<template>
    <div class="store">
        <h1>Store: {{ storeId }}</h1>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
    components: {}
})
export default class Store extends Vue {
    @Prop() storeId!: number;
}
</script>
