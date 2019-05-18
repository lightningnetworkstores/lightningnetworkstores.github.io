<template>
    <div class="edit-store-modal">
        <v-icon @click.stop="showEditDialog = true">fa-edit</v-icon>

        <!-- Edit store modal -->
        <v-dialog v-model="showEditDialog" max-width="500" persistent>
            <v-card>
                <v-layout row v-if="editAlert.message.length">
                    <v-flex pa-3>
                        <v-alert :value="editAlert.message" :type="editAlert.success ? 'success' : 'error'" transition="scale-transition">
                            {{ editAlert.message }}
                        </v-alert>
                    </v-flex>
                </v-layout>
                <v-card-title class="headline">
                    <v-layout row>
                        <v-flex grow>Edit&nbsp;{{ store.name }}</v-flex>
                        <v-flex shrink v-if="isLoading"><v-progress-circular indeterminate size="20" color="green"></v-progress-circular></v-flex>
                    </v-layout>
                </v-card-title>
                <v-form @submit.prevent="submitEdit" ref="editform">
                    <v-layout row>
                        <v-flex pl-3 pr-3>
                            <v-combobox v-model="editDialogForm.property" item-text="name" item-value="prop" label="Property" :items="editDialogProperties" return-object></v-combobox>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex pl-3 pr-3>
                            <v-text-field :value="editDialogForm.property && editDialogForm.property.prop ? store[editDialogForm.property.prop] : ''" label="Current value" disabled></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex pl-3 pr-3>
                            <v-text-field
                                v-model="editDialogForm.value"
                                label="Value"
                                :hint="editDialogForm.property && editDialogForm.property.prop ? hints[editDialogForm.property.prop] : ''"
                                :rules="[v => !!v || 'Value is required']"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <!--
                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-textarea
                                    v-model="editDialogForm.motivation"
                                    label="Motivation"
                                    hint="eg. We moved to a different domain: www.new-url.com"
                                    :rules="[v => !!v || 'Motivation is required']"
                                >
                                </v-textarea>
                            </v-flex>
                        </v-layout> -->

                    <v-layout row>
                        <v-flex pl-3 pr-3>
                            <v-checkbox v-model="editDialogForm.askOwner" label="Ask store owner for approval (email will be sent to store owner)"></v-checkbox>
                        </v-flex>
                    </v-layout>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn color="green darken-1" flat="flat" @click="closeDialog">
                            Cancel
                        </v-btn>

                        <v-btn color="green darken-1" flat="flat" type="submit">
                            Submit
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
export default class EditStoreModal extends Vue {
    @Prop() store!: Store;
    editAlert: any = { message: "", success: true };
    showEditDialog: boolean = false;
    isLoading: boolean = false;
    editDialogProperties: object[] = [
        { name: "Name", prop: "name" },
        { name: "Description", prop: "description" },
        { name: "URL", prop: "href" },
        { name: "Node URI", prop: "uri" },
        { name: "Sector", prop: "sector" },
        { name: "Digital goods", prop: "digital_goods" },
        { name: "Reddit URL", prop: "reddit" },
        { name: "Facebook URL", prop: "facebook" },
        { name: "Twitter URL", prop: "twitter" }
    ];
    editDialogForm: any = { property: "", askOwner: true };

    hints: Object = {
        digital_goods: '"No, goods only in-store" or "No, goods shipped" or "yes"',
        uri: "e.g. 03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f@34.239.230.56:9735",
        href: "e.g. https://example.com",
        sector: "e.g. games&casino",
        name: "Some new name no longer than 50 characters.",
        description: "Some new description not longer than 150 characters.",
        reddit: "e.g. https://reddit.com/user/someuser",
        facebook: "e.g. https://facebook.com/somebody",
        twitter: "e.g. https://twitter.com/somebody"
    };

    private closeDialog() {
        this.showEditDialog = false;
        (this.$refs.editform as Vue & { reset: () => boolean }).reset();
    }

    private submitEdit() {
        (this.$refs.editform as Vue & { validate: () => boolean }).validate();
        if (this.store.id && this.editDialogForm.property.prop && this.editDialogForm.value) {
            this.isLoading = true;
            this.$store.dispatch("addStoreUpdate", { id: this.store.id, field: this.editDialogForm.property.prop, value: this.editDialogForm.value, askOwner: this.editDialogForm.askOwner }).then(
                response => {
                    this.editAlert.message = response.data;
                    if (response.data.includes("The request was successfully recorded")) {
                        this.editAlert.success = true;
                        this.editDialogForm = { property: "", askOwner: true };
                        (this.$refs.editform as Vue & { reset: () => boolean }).reset();
                    } else {
                        this.editAlert.success = false;
                    }
                    this.isLoading = false;
                },
                error => {
                    console.error(error);
                    this.isLoading = false;
                }
            );
        }
    }
}
</script>

<style scoped lang="scss">
</style>
