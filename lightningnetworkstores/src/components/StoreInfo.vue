<template>
    <div class="store-info">
        <div>
            <v-breadcrumbs :items="breadCrumb">
                <template v-slot:divider>
                    <v-icon>chevron_right</v-icon>
                </template>
            </v-breadcrumbs>
        </div>
        <v-layout justify-center row wrap class="my-4">
            <v-flex xs11 md8 lg6>
                <v-img :src="imageUrl" aspect-radio="1.6"
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
                <v-layout row pt-4>
                    <v-flex grow pa-1>
                        <v-btn fab dark color="success" @click.stop="vote(true)"><v-icon large>arrow_upward</v-icon></v-btn>
                    </v-flex>
                    <v-flex shrink pa-1>
                        <v-btn fab dark color="error" @click.stop="vote(false)"><v-icon large>arrow_downward</v-icon></v-btn>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex shrink pa-3>{{ upvotes | number }}</v-flex>
                    <v-flex grow pa-1><v-progress-linear color="success" background-color="error" height="15" value="98"></v-progress-linear></v-flex>
                    <v-flex shrink pa-3>{{ downvotes | number }}</v-flex>
                </v-layout>
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
                            <v-icon small @click.stop="editDialog = true">fa-edit</v-icon>
                        </v-btn>
                        <v-btn flat icon color="grey darken-2">
                            <v-icon small>fa-ban</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
            <!-- Edit store modal -->
            <v-dialog v-model="editDialog" max-width="500">
                <v-card>
                    <v-card-title class="headline">Suggest an edit for {{ store.name }}</v-card-title>

                    <v-layout row>
                        <v-flex pl-3 pr-3>
                            <v-combobox v-modal="editDialogForm.property" label="Property" :items="editDialogProperties"></v-combobox>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex pl-3 pr-3>
                            <v-text-field v-modal="editDialogForm.value" label="Value" value="" hint="eg. www.new-url.com"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex pl-3 pr-3>
                            <v-textarea v-modal="editDialogForm.motivation" label="Motivation" hint="eg. We moved to a different domain: www.new-url.com"> </v-textarea>
                        </v-flex>
                    </v-layout>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn color="green darken-1" flat="flat" @click="editDialog = false">
                            Cancel
                        </v-btn>

                        <v-btn color="green darken-1" flat="flat" @click="editDialog = false">
                            Send
                        </v-btn>
                    </v-card-actions>
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
    imageUrl: string = "";
    upvotes: number = 5000000;
    downvotes: number = 1000;
    breadCrumb: any;

    editDialog: boolean = false;
    editDialogProperties: string[] = ["Name", "Description", "URL", "Node URI", "Sector", "Digital goods"];
    editDialogForm: object = { property: "", value: "", motivation: "" };

    async created() {
        this.store = this.$store.getters.getStore(this.storeId);
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
        this.imageUrl = this.$store.getters.getImageUrl(this.storeId);
    }

    private vote(upvote: boolean) {
        if (upvote) {
            console.log("upvote");
        } else {
            console.log("downvote");
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
