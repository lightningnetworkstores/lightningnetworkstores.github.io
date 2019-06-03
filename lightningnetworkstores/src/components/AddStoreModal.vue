<template>
    <div class="add-store-modal">
        <v-btn color="green" dark fab fixed bottom right @click="showAddDialog = true">
            <v-icon>add</v-icon>
        </v-btn>

        <!-- Add store modal -->
        <v-dialog v-model="showAddDialog" max-width="500" persistent>
            <v-card>
                <v-layout row v-if="addAlert.message.length">
                    <v-flex pa-3>
                        <v-alert :value="addAlert.message" :type="addAlert.success ? 'success' : 'error'" transition="scale-transition">
                            {{ addAlert.message }}
                        </v-alert>
                    </v-flex>
                </v-layout>
                <div v-if="paymentRequest && isPaid" class="text-xs-center">
                    <!-- paymentRequest && isPaid -->
                    <v-card-title class="headline">
                        <v-layout row>
                            <v-flex>Payment successful</v-flex>
                        </v-layout>
                    </v-card-title>
                    <v-icon size="200" color="green" pa-5>fas fa-check-circle</v-icon>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn color="green darken-1" flat="flat" @click="cancel">
                            Cancel
                        </v-btn>
                    </v-card-actions>
                </div>

                <div v-else>
                    <v-card-title class="headline">
                        <v-layout row>
                            <v-flex grow>Automatically add new store!</v-flex>
                            <v-flex shrink v-if="isLoading || paymentRequest.length"><v-progress-circular indeterminate size="20" color="green"></v-progress-circular></v-flex>
                        </v-layout>
                    </v-card-title>

                    <v-layout row>
                        <v-flex pl-3 pr-3 v-if="!paymentRequest.length"> Amount due if not a contributor: {{ addStoreFee }} satoshis </v-flex>
                    </v-layout>

                    <div v-if="paymentRequest">
                        <v-layout row>
                            <v-flex pa-3 class="text-xs-center"
                                ><h3>{{ addStoreFee }} sat</h3></v-flex
                            >
                        </v-layout>
                        <v-layout row>
                            <v-flex pl-3 pr-3 class="text-xs-center"><qrcode-vue class="qrcode" size="300" :value="paymentRequest"></qrcode-vue></v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-text-field :value="paymentRequest" label="Invoice" hint="" append-icon="fa-copy" type="text" id="paymentrequest" @click:append="copy"></v-text-field
                            ></v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex pl-3 pr-3 class="text-xs-center">
                                <a :href="'lightning:' + paymentRequest" class="link-button">Open in wallet</a>
                            </v-flex>
                        </v-layout>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn color="green darken-1" flat="flat" @click="cancel">
                                Cancel
                            </v-btn>
                        </v-card-actions>
                    </div>

                    <v-form @submit.prevent="submitAdd" ref="addform" v-if="!paymentRequest.length">
                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-text-field v-model="addDialogForm.name" label="Name" hint="eg. Some name no longer than 50 characters." :rules="[v => !!v || 'Name is required']"></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-text-field
                                    v-model="addDialogForm.description"
                                    label="Description"
                                    hint="eg. Some description no longer than 150 characters."
                                    :rules="[v => !!v || 'Description is required', v => (v && (v.length > 6 && v.split(/\b(\s)/).length > 1)) || 'Enter a clear description of the store']"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-text-field
                                    v-model="addDialogForm.url"
                                    label="Website URL"
                                    hint="eg. https://lightningnetworkstores.com"
                                    :rules="[
                                        v => !!v || 'Website URL is required',
                                        v =>
                                            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
                                                v
                                            ) || 'Enter a valid url eg. https://lightningnetworkstores.com'
                                    ]"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-text-field
                                    v-model="addDialogForm.uri"
                                    label="Node URI (optional)"
                                    hint="eg. 03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f@34.239.230.56:9735 (optional)"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-combobox
                                    v-model="addDialogForm.sector"
                                    item-text="name"
                                    item-value="prop"
                                    label="Sector"
                                    :items="sectorFormItems"
                                    return-object
                                    :rules="[v => !!v || 'Sector is required']"
                                ></v-combobox>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-combobox
                                    v-model="addDialogForm.digitalGoods"
                                    item-text="name"
                                    item-value="prop"
                                    label="Digital goods"
                                    :items="digitalGoodFormItems"
                                    return-object
                                    :rules="[v => !!v || 'Digital goods is required']"
                                ></v-combobox>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-text-field v-model="addDialogForm.contributor" label="Contributor code (optional)"></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-checkbox
                                    v-model="addDialogForm.agreeRemoved"
                                    label="I agree that the store may be removed later if it disables lightning payments"
                                    :rules="[v => !!v || 'Agreeing with the sites policy is required']"
                                ></v-checkbox>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex grow></v-flex>
                            <v-flex pl-3 pr-3 shrink>
                                <vue-recaptcha sitekey="6LddfGMUAAAAAG75Ke0N_iVtWh1QwwGFlByKpoMj"></vue-recaptcha>
                            </v-flex>
                            <v-flex grow></v-flex>
                        </v-layout>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn color="green darken-1" flat="flat" @click="showAddDialog = false">
                                {{ paymentRequest && isPaid ? "Close" : "Cancel" }}
                            </v-btn>

                            <v-btn color="green darken-1" flat="flat" type="submit">
                                Submit
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import VueRecaptcha from "vue-recaptcha";
import QrcodeVue from "qrcode.vue";

@Component({ components: { VueRecaptcha, QrcodeVue } })
export default class AddStoreModal extends Vue {
    digitalGoodFormItems: any[] = [
        { name: "Yes", prop: "yes" },
        { name: "No, goods shipped", prop: "no, goods shipped" },
        { name: "No, goods only in a physical store", prop: "no, goods only in-store" }
    ];

    sectorFormItems: any[] = [
        { name: "Technology", prop: "technology" },
        { name: "VPS & Web hosting", prop: "vps&web hosting" },
        { name: "Security", prop: "security" },
        { name: "Clothing", prop: "clothing" },
        { name: "Exchange", prop: "exchange" },
        { name: "Food", prop: "food" },
        { name: "Games & Casino", prop: "games&casino" },
        { name: "Adult", prop: "adult" },
        { name: "Art", prop: "art" },
        { name: "Drugs & Supplements", prop: "drugs&supplements" },
        { name: "Cryptocurrency merchandise", prop: "cryptocurrency merchandise" },
        { name: "Fitness & Sports", prop: "fitness&sports" },
        { name: "Other", prop: "other" }
    ];

    showAddDialog: boolean = false;
    addDialogForm: any = {};
    addAlert: any = { message: "", success: true };
    isLoading: boolean = false;

    paymentRequest: string = "";
    paymentID: string = "";
    expiryTime: Date = new Date();
    isPaid: boolean = false;

    addStoreFee: number = 5000;

    checkPaymentTimer: any;

    created() {
        this.addStoreFee = this.$store.getters.getAddStoreFee();
    }

    private cancel() {
        if (this.paymentRequest.length > 0) {
            this.paymentRequest = "";
        }

        clearInterval(this.checkPaymentTimer);
        this.closeDialog();
    }

    private closeDialog() {
        this.addDialogForm = {};
        this.showAddDialog = false;
        (this.$refs.addform as Vue & { reset: () => boolean }).reset();
        this.isPaid = false;
        this.paymentID = "";
        this.addAlert = { message: "", success: true };
    }

    private copy() {
        let input = document.getElementById("paymentrequest")!.focus();
        document.execCommand("SelectAll");
        document.execCommand("copy");
    }

    private submitAdd(event: any) {
        (this.$refs.addform as Vue & { validate: () => boolean }).validate();
        if (event.target["g-recaptcha-response"].value && this.addDialogForm.agreeRemoved) {
            this.isLoading = true;
            this.addAlert = { message: "", success: true };
            this.$store
                .dispatch("addStore", {
                    name: this.addDialogForm.name,
                    description: this.addDialogForm.description,
                    url: this.addDialogForm.url,
                    uri: this.addDialogForm.uri,
                    sector: this.addDialogForm.sector.prop,
                    digitalGoods: this.addDialogForm.digitalGoods.prop,
                    contributor: this.addDialogForm.contributor,
                    recaptcha: event.target["g-recaptcha-response"].value
                })
                .then(
                    response => {
                        if (response.data.includes("Waiting for payment")) {
                            let splitResp = response.data.split("=");
                            this.paymentRequest = splitResp[splitResp.length - 2];
                            this.paymentID = splitResp[splitResp.length - 1];

                            let date = new Date();
                            this.expiryTime = new Date(date.setSeconds(date.getSeconds() + 3600));
                            this.checkPaymentTimer = setInterval(() => {
                                this.checkPayment();
                            }, 3000);
                        } else if (response.data.includes("Store successfully added")) {
                            this.addAlert.message = response.data;
                            this.addAlert.success = true;
                            this.addDialogForm = {};
                        } else {
                            this.addAlert.message = response.data;
                            this.addAlert.success = false;
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

    private checkPayment() {
        //todo: check if payment is done
        if (this.expiryTime > new Date()) {
            this.$store.dispatch("checkPayment", { id: this.paymentID }).then(
                response => {
                    if (response.data == true) {
                        this.isPaid = true;
                        this.addDialogForm = {};
                        clearInterval(this.checkPaymentTimer);
                    }
                },
                error => {
                    console.error(error);
                }
            );
        } else {
            this.stopPayment();
        }
    }

    private stopPayment() {
        clearInterval(this.checkPaymentTimer);
        this.paymentRequest = "";
    }
}
</script>

<style scoped lang="scss">
</style>
