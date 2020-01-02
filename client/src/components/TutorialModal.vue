<template>
    <div class="ban-store-modal">
        <v-icon @click.stop="showTutorialDialog = true">help</v-icon>

        <!-- Ban store modal -->
        <v-dialog v-model="showTutorialDialog" max-width="800">
            <v-card class="pa-2">
                <v-card-title class="headline">How to use LightningNetworkStores.com</v-card-title>

                <v-carousel :cycle="false">
                    <v-carousel-item>
                        <p class="pl-3 pt-3 pr-3 subheading">
                            1. This website lists stores that accept bitcoin through the lightning network. Any user can vote up or down on the stores listed. To actively participate you should have a
                            <a :href="`${baseUrl}wallets`">lightning-enabled bitcoin wallet</a>.
                        </p>
                        <vuetify-lazy-image :src="`${baseUrl}tutorial/video1.gif`" alt=""
                    /></v-carousel-item>
                    <v-carousel-item>
                        <p class="pl-3 pt-3 pr-3 subheading">2. Anyone can add a store that accepts bitcoin through lightning. The store is tweeted after being added.</p>
                        <vuetify-lazy-image :src="`${baseUrl}tutorial/video2.gif`" alt=""
                    /></v-carousel-item>
                    <v-carousel-item>
                        <p class="pl-3 pt-3 pr-3 subheading">3. Users can suggest updates on the store information, this update can be accepted by the website owner.</p>
                        <vuetify-lazy-image :src="`${baseUrl}tutorial/video3.gif`" alt=""
                    /></v-carousel-item>
                </v-carousel>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="green darken-1" flat="flat" @click="showTutorialDialog = false">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
//@ts-ignore
import VuetifyLazyImage from "vuetify-lazy-image";

@Component({
    components: {
        VuetifyLazyImage
    }
})
export default class TutorialModal extends Vue {
    showTutorialDialog: boolean = false;
    baseUrl: string = "";

    mounted() {
        this.baseUrl = this.$store.getters.getBaseUrl();
    }
}
</script>

<style scoped lang="scss">
</style>
