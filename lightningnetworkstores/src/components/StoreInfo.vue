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
                <v-layout row v-if="store.uri.length">
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
                            <v-icon small @click.stop="showDialog = true">fa-edit</v-icon>
                        </v-btn>
                        <v-btn flat icon color="grey darken-2">
                            <v-icon small>fa-ban</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
            <!-- Edit store modal -->
            <v-dialog v-model="showDialog" max-width="500">
                <v-card>
                    <v-card-title class="headline">Suggest an edit for {{ store.name }}</v-card-title>
                    <form @submit.prevent="submitEdit">
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
                        </v-layout>

                        <v-layout row>
                            <v-flex pl-3 pr-3>
                                <v-checkbox v-model="editDialogForm.askOwner" label="Ask store owner for approval (email will be sent to store owner)"></v-checkbox>
                            </v-flex>
                        </v-layout>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn color="green darken-1" flat="flat" @click="showDialog = false">
                                Cancel
                            </v-btn>

                            <v-btn color="green darken-1" flat="flat" type="submit">
                                Send
                            </v-btn>
                        </v-card-actions>
                    </form>
                </v-card>
            </v-dialog>
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
    showDialog: boolean = false;
    loaded: boolean = false;

    editDialogProperties: object[] = [
        { name: "Name", prop: "name" },
        { name: "Description", prop: "description" },
        { name: "URL", prop: "href" },
        { name: "Node URI", prop: "uri" },
        { name: "Sector", prop: "sector" },
        { name: "Digital goods", prop: "digital_goods" }
    ];
    editDialogForm: object = { property: "", askOwner: true };

    created() {
        this.loaded = false;

        this.baseUrl = this.$store.getters.getBaseUrl();

        this.$store.dispatch("getStore", { id: this.storeId }).then(
            response => {
                this.store = response.data;
                console.log(this.store);
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

    private showEditDialog() {
        this.$router.replace({ query: { edit: "true" } });
    }

    private submitEdit() {
        console.log("submit");
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
