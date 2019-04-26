<template>
    <div class="vote">
        <div class="store-card" v-if="!isInfo">
            <div class="text-xs-center">
                <v-flex xs12>
                    <v-btn icon @click.stop="vote(true)"><v-icon large>arrow_upward</v-icon></v-btn>
                </v-flex>

                <v-flex xs12 pa-2>
                    <span class="caption">{{ score.upvotes | number }}</span>
                </v-flex>

                <v-flex xs12>
                    <v-btn icon @click.stop="vote(false)"><v-icon large>arrow_downward</v-icon></v-btn>
                </v-flex>
            </div>
        </div>
        <div class="store-info" v-if="isInfo == true">
            <v-layout row pt-4>
                <v-flex grow pa-1>
                    <v-btn fab dark color="success" @click.stop="vote(true)"><v-icon large>arrow_upward</v-icon></v-btn>
                </v-flex>
                <v-flex shrink pa-1>
                    <v-btn fab dark color="error" @click.stop="vote(false)"><v-icon large>arrow_downward</v-icon></v-btn>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex shrink pa-3>{{ score.upvotes | number }}</v-flex>
                <v-flex grow pa-1
                    ><v-progress-linear color="success" background-color="error" height="15" :value="(score.upvotes / (score.upvotes + score.downvotes)) * 100"></v-progress-linear
                ></v-flex>
                <v-flex shrink pa-3>{{ score.downvotes | number }}</v-flex>
            </v-layout>
        </div>
        <!-- Upvote store modal -->
        <v-dialog v-model="showDialog" max-width="500">
            <v-card>
                <v-card-title class="headline">
                    <v-layout row>
                        <v-flex grow><span v-if="isUpvoting">Upvote</span><span v-else>Downvote</span>&nbsp;{{ store.name }}</v-flex>
                        <v-flex shrink v-if="paymentRequest"><v-progress-circular indeterminate size="20" color="green"></v-progress-circular></v-flex>
                    </v-layout>
                </v-card-title>
                <form @submit.prevent="submitEdit">
                    <v-layout row>
                        <v-flex pl-3 pr-3 v-if="!paymentRequest.length">
                            <v-text-field
                                v-model="upvoteDialogForm.amount"
                                type="number"
                                label="Number of upvotes (1 vote = 1 satoshi)"
                                hint=""
                                :rules="[v => !!v || 'Amount is required']"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>

                    <div v-if="paymentRequest">
                        <v-layout row>
                            <v-flex pa-3 class="text-xs-center"
                                ><h3>{{ upvoteDialogForm.amount | number }} sat</h3></v-flex
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
                    </div>

                    <v-layout row>
                        <v-flex pl-3 pr-3> </v-flex>
                    </v-layout>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn color="green darken-1" flat="flat" @click="cancel">
                            Cancel
                        </v-btn>

                        <v-btn color="green darken-1" flat="flat" @click="getInvoice" v-if="!paymentRequest.length">
                            Get invoice
                        </v-btn>
                    </v-card-actions>
                </form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Store } from "../interfaces/Store";
import QrcodeVue from "qrcode.vue";

@Component({ components: { QrcodeVue } })
export default class StoreCard extends Vue {
    @Prop() store!: Store;
    @Prop() isInfo!: boolean;

    score: any = {};

    isUpvoting: boolean = true;

    showDialog: boolean = false;
    upvoteDialogForm: object = { amount: 1000 };

    paymentRequest: string = "";

    checkPaymentTimer: any;

    async created() {
        this.checkPaymentTimer = setInterval(() => {
            this.checkPayment();
        }, 3000);
        this.setScore();
    }

    private setScore() {
        this.score = this.$store.getters.getScore(this.store.id);
    }

    private vote(upvote: boolean) {
        this.isUpvoting = upvote;
        this.showDialog = true;
        if (upvote) {
            console.log("upvote");
        } else {
            console.log("downvote");
        }
    }

    private copy() {
        let input = document.getElementById("paymentrequest")!.focus();
        document.execCommand("SelectAll");
        document.execCommand("copy");
    }

    private cancel() {
        clearInterval(this.checkPaymentTimer);
        if (this.paymentRequest.length > 0) {
            this.paymentRequest = "";
        } else {
            this.showDialog = false;
        }
    }

    private getInvoice() {
        //todo: do request to get invoice
        this.paymentRequest =
            "lnbc250u1pwt46zypp54jkdggjvguk95e2nsjq3hny985snmja6kxmd79chm89pwrg8ucwsdpgf36kx6me23582mnyv4ezucm0d5s8q6tw8gcrwdfjcqzpgxqzuyjr3qnzmtxlnpyxhqgzvsy4n556jx9urwt4440g58p8g00y2tm34ymy80fwpj0dujlvj08c55mwxn08kcfm8dfhecglptp0ppwjp08xcq9qe8ph";
    }

    private checkPayment() {
        //todo: check if payment is done
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.vote {
    &.store-card {
        width: 50px;
    }
}
</style>
