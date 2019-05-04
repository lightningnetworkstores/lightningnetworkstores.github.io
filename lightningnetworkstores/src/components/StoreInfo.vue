<template>
    <div class="store-info" v-if="loaded">
        <div>
            <v-breadcrumbs :items="breadCrumb">
                <template v-slot:divider>
                    <v-icon>chevron_right</v-icon>
                </template>
            </v-breadcrumbs>
        </div>
        <v-layout justify-center row wrap class="my-4">
            <v-flex xs11 md8 lg6>
                <v-img :src="`${baseUrl}thumbnails/${store.id}.png`" max-height="500px" aspect-radio="1.6" position="top center" class="text-xs-right"
                    ><v-chip color="success" text-color="white" class="ma-2 text-capitalize">New</v-chip>
                    <v-chip color="orange" text-color="white">
                        100
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" pr-2 small right>fa-fire</v-icon>
                            </template>
                            <span>Trending score</span>
                        </v-tooltip>
                    </v-chip></v-img
                >
                <v-layout row>
                    <v-flex pb-1>
                        <a class="store-link" @click.stop :href="store.href"
                            ><h1>{{ store.name }} <v-icon small class="pb-2">fa-external-link-alt</v-icon></h1></a
                        >
                    </v-flex>
                </v-layout>

                <v-layout row pb-3>
                    <v-flex>{{ store.description }} </v-flex>
                </v-layout>

                <!-- <v-layout row pb-3><a @click.stop :href="store.href">Visit website</a></v-layout> -->
                <v-layout row v-if="store.uri && store.uri.toLowerCase() != 'unknown'">
                    <span class="break-word"
                        ><b>Node:&nbsp;</b><a :href="'https://1ml.com/node/' + store.uri.split('@')[0]">{{ store.uri }}</a></span
                    ></v-layout
                >
                <v-layout row v-if="store.digital_goods.length"><b>Digital goods:&nbsp;</b>{{ store.digital_goods }}</v-layout>
                <v-layout row v-if="store.sector.length"
                    ><b>Sector:&nbsp;</b><router-link :to="'/?sector=' + encodeURIComponent(store.sector)">{{ store.sector }}</router-link></v-layout
                >

                <vote v-bind:store="store" v-bind:isInfo="true"></vote>

                <v-layout row>
                    <v-flex grow pl-1>
                        <v-btn flat icon color="blue">
                            <v-icon small>fab fa-twitter</v-icon>
                        </v-btn>

                        <v-btn flat icon color="blue darken-3">
                            <v-icon small>fab fa-facebook</v-icon>
                        </v-btn>

                        <v-btn flat icon color="orange darken-2">
                            <v-icon small>fab fa-reddit</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex shrink>
                        <v-btn flat icon color="grey darken-2">
                            <v-icon small @click.stop="showEditDialog = true">fa-edit</v-icon>
                        </v-btn>
                        <v-btn flat icon color="grey darken-2">
                            <v-icon small @click.stop="showBanDialog = true">fa-ban</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
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
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Store } from "../interfaces/Store";
import Vote from "@/components/Vote.vue";

@Component({
    components: { Vote }
})
export default class StoreInfo extends Vue {
    @Prop() storeId!: number;
    store!: Store;
    baseUrl: string = "";
    breadCrumb: any;
    showEditDialog: boolean = false;
    showBanDialog: boolean = false;
    loaded: boolean = false;
    editAlert: any = { message: "", success: true };

    editDialogProperties: object[] = [
        { name: "Name", prop: "name" },
        { name: "Description", prop: "description" },
        { name: "URL", prop: "href" },
        { name: "Node URI", prop: "uri" },
        { name: "Sector", prop: "sector" },
        { name: "Digital goods", prop: "digital_goods" }
    ];
    editDialogForm: any = { property: "", askOwner: true };

    banDialogForm: any = { motivation: "" };
    banSnackbar: boolean = false;

    created() {
        this.loaded = false;

        this.baseUrl = this.$store.getters.getBaseUrl();

        this.$store.dispatch("getStore", { id: this.storeId }).then(
            response => {
                this.store = response.data;
                this.breadCrumb = [
                    {
                        text: "Stores",
                        disabled: false,
                        href: "/"
                    },
                    {
                        text: this.store.name,
                        disabled: false,
                        href: location.href
                    }
                ];
                this.loaded = true;
            },
            error => {
                console.error(error);
            }
        );
    }

    private submitEdit() {
        (this.$refs.editform as Vue & { validate: () => boolean }).validate();
        if (this.storeId && this.editDialogForm.property.prop && this.editDialogForm.value) {
            this.$store.dispatch("addStoreUpdate", { id: this.storeId, field: this.editDialogForm.property.prop, value: this.editDialogForm.value, askOwner: this.editDialogForm.askOwner }).then(
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

    private submitBan() {
        (this.$refs.banform as Vue & { validate: () => boolean }).validate();
        if (this.storeId && this.store.name && this.banDialogForm.motivation) {
            this.$store.dispatch("suggestBan", { id: this.storeId, name: this.store.name, message: this.banDialogForm.motivation }).then(
                response => {
                    this.banDialogForm.motivation = "";
                    this.showBanDialog = false;
                    this.banSnackbar = true;
                    console.log(this.banSnackbar);
                },
                error => {
                    console.error(error);
                }
            );
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.store-link {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.87);
}
</style>
