<template>
    <div class="ban-store-modal">
        <v-icon @click.stop="showBanDialog = true">fa-ban</v-icon>

        <!-- Ban store modal -->
        <v-dialog v-model="showBanDialog" max-width="500" persistent>
            <v-card>
                <v-card-title class="headline">Suggest banning {{ store.name }}</v-card-title>
                <v-form @submit.prevent="submitBan" ref="banform">
                    <v-layout row>
                        <v-flex pl-3 pr-3>
                            <v-textarea v-model="banDialogForm.motivation" label="Motivation" hint="eg. Its a scam! Because..." :rules="[v => !!v || 'Motivation is required']"> </v-textarea>
                        </v-flex>
                    </v-layout>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn color="green darken-1" flat="flat" @click="showBanDialog = false">
                            Cancel
                        </v-btn>

                        <v-btn color="green darken-1" flat="flat" type="submit">
                            Send
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="banSnackbar" color="info" :timeout="3000">
            Ban suggestion recorded
            <v-btn dark flat @click="snackbar = false">
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Store } from "../interfaces/Store";

@Component
export default class BanStoreModal extends Vue {
    @Prop() store!: Store;
    showBanDialog: boolean = false;
    banDialogForm: any = { motivation: "" };
    banSnackbar: boolean = false;

    private submitBan() {
        (this.$refs.banform as Vue & { validate: () => boolean }).validate();
        if (this.store.id && this.store.name && this.banDialogForm.motivation) {
            this.$store.dispatch("suggestBan", { id: this.store.id, name: this.store.name, message: this.banDialogForm.motivation }).then(
                response => {
                    this.banDialogForm.motivation = "";
                    this.showBanDialog = false;
                    this.banSnackbar = true;
                },
                error => {
                    console.error(error);
                }
            );
        }
    }
}
</script>

<style scoped lang="scss">
</style>
