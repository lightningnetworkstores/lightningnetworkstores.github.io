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

                <v-card-title class="headline">Suggest an edit for {{ store.name }}</v-card-title>
                <v-form @submit.prevent="submitEdit" ref="editform">
                    <v-layout row>
                        <v-flex pl-3 pr-3>
                            <v-combobox
                                v-model="editDialogForm.property"
                                item-text="name"
                                item-value="prop"
                                label="Property"
                                :items="editDialogProperties"
                                return-object
                                :rules="[v => !!v || 'Property is required']"
                            ></v-combobox>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex pl-3 pr-3>
                            <v-text-field :value="store[editDialogForm.property.prop]" label="Current value" disabled></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex pl-3 pr-3>
                            <v-text-field v-model="editDialogForm.value" label="Value" hint="eg. www.new-url.com" :rules="[v => !!v || 'Value is required']"></v-text-field>
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

                        <v-btn color="green darken-1" flat="flat" @click="showEditDialog = false">
                            Cancel
                        </v-btn>

                        <v-btn color="green darken-1" flat="flat" type="submit">
                            Send
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
export default class BanStoreModal extends Vue {
    @Prop() store!: Store;
    editAlert: any = { message: "", success: true };
    showEditDialog: boolean = false;
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

    private submitEdit() {
        (this.$refs.editform as Vue & { validate: () => boolean }).validate();
        if (this.store.id && this.editDialogForm.property.prop && this.editDialogForm.value) {
            this.$store.dispatch("addStoreUpdate", { id: this.store.id, field: this.editDialogForm.property.prop, value: this.editDialogForm.value, askOwner: this.editDialogForm.askOwner }).then(
                response => {
                    this.editAlert.message = response.data;
                    if (response.data.includes("The request was successfully recorded")) {
                        this.editAlert.success = true;
                    } else {
                        this.editAlert.success = false;
                    }
                    this.editDialogForm = { property: "", askOwner: true };
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
