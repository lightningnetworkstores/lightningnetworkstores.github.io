<template>
    <div class="ban-store-modal">
        <v-icon @click.stop="showEmbedDialog = true">fa-code</v-icon>

        <!-- Ban store modal -->
        <v-dialog v-model="showEmbedDialog" max-width="500">
            <v-card>
                <v-card-title class="headline">Embed code</v-card-title>
                <v-form @submit.prevent="submitBan" ref="banform">
                    <v-layout row>
                        <v-flex pl-3 pr-3><img src="@/assets/images/snippet.svg" height="50px" style="cursor: pointer"/></v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex pl-3 pr-3>
                            <v-text-field :value="html" label="html snippet" append-icon="fa-copy" type="text" id="embedhtml" @click:append="copy"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn color="green darken-1" flat="flat" @click="showEmbedDialog = false">
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Store } from "../interfaces/Store";

@Component
export default class EmbedModal extends Vue {
    @Prop() store!: Store;
    @Prop() baseUrl!: string;
    showEmbedDialog: boolean = false;
    html: string = `<div id="lns-snippet"><a href="${this.baseUrl}store/${this.store.id}"><img scr="${this.baseUrl}img/snippet.svg" height="50px"></a></div>`;

    private copy() {
        let input = document.getElementById("embedhtml")!.focus();
        document.execCommand("SelectAll");
        document.execCommand("copy");
    }
}
</script>

<style scoped lang="scss">
</style>
