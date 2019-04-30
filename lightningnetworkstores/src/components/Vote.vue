<template>
    <div class="vote">
        <div class="store-card" v-if="!isInfo">
            <div class="text-xs-center">
                <v-flex xs12>
                    <v-btn icon @click.stop="vote(true)"><v-icon large>arrow_upward</v-icon></v-btn>
                </v-flex>

                <v-flex xs12 pa-2>
                    <span class="caption">{{ (score.upvotes - score.downvotes) | number }}</span>
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
        <v-dialog v-model="showDialog" persistent max-width="500">
            <v-card>
                <div v-if="paymentRequest && isPaid" class="text-xs-center">
                    <!-- paymentRequest && isPaid -->
                    <v-card-title class="headline">
                        <v-layout row>
                            <v-flex>Payment successful</v-flex>
                        </v-layout>
                    </v-card-title>
                    <v-icon size="200" color="green" pa-5>fas fa-check-circle</v-icon>
                    <v-layout row mt-2>
                        <v-flex
                            >Go to <a :href="'/store/' + store.id">{{ store.name }}</a></v-flex
                        >
                    </v-layout>
                </div>

                <div v-else>
                    <v-card-title class="headline">
                        <v-layout row>
                            <v-flex grow><span v-if="isUpvoting">Upvote</span><span v-else>Downvote</span>&nbsp;{{ store.name }}</v-flex>
                            <v-flex shrink v-if="paymentRequest && !isPaid"><v-progress-circular indeterminate size="20" color="green"></v-progress-circular></v-flex>
                        </v-layout>
                    </v-card-title>
                    <v-layout row>
                        <v-flex pl-3 pr-3 v-if="!paymentRequest.length">
                            <v-text-field
                                v-model="upvoteDialogForm.amount"
                                type="number"
                                label="Number of upvotes (1 vote = 1 satoshi)"
                                hint=""
                                :rules="[v => !!v || 'Amount is required']"
                            ></v-text-field>
                            <v-text-field v-model="upvoteDialogForm.comment" type="text" label="Comment (optional)"></v-text-field>
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
                </div>
                <v-layout row>
                    <v-flex pl-3 pr-3> </v-flex>
                </v-layout>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="green darken-1" flat="flat" @click="cancel">
                        {{ paymentRequest && isPaid ? "Close" : "Cancel" }}
                    </v-btn>

                    <v-btn color="green darken-1" flat="flat" @click="getInvoice" v-if="!paymentRequest.length">
                        Get invoice
                    </v-btn>
                </v-card-actions>
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
    upvoteDialogForm: any = { amount: 1000, comment: "" };

    paymentRequest: string = "";
    paymentID: string = "";
    expiryTime: Date = new Date();
    isPaid: boolean = false;

    checkPaymentTimer: any;

    async created() {
        this.setScore();
    }

    private setScore() {
        this.score = this.$store.getters.getScore(this.store.id);
    }

    private vote(upvote: boolean) {
        this.isUpvoting = upvote;
        this.showDialog = true;
    }

    private copy() {
        let input = document.getElementById("paymentrequest")!.focus();
        document.execCommand("SelectAll");
        document.execCommand("copy");
    }

    private cancel() {
        if (this.paymentRequest.length > 0) {
            this.paymentRequest = "";
        } else {
            this.closeDialog();
        }

        if (!this.isPaid) {
            clearInterval(this.checkPaymentTimer);
        } else {
            this.closeDialog();
        }
    }

    private closeDialog() {
        this.upvoteDialogForm = { amount: 1000, comment: "" };
        this.showDialog = false;
        this.isPaid = false;
        this.paymentID = "";
    }

    private getInvoice() {
        //todo: do request to get invoice
        this.$store.dispatch("getStoreVotePaymentRequest", { id: this.store.id, amount: this.upvoteDialogForm.amount, isUpvote: this.isUpvoting, comment: this.upvoteDialogForm.comment }).then(
            response => {
                this.paymentRequest = response.data.payment_request;
                this.paymentID = response.data.id;
                let date = new Date();
                this.expiryTime = new Date(date.setSeconds(date.getSeconds() + 3600));
                this.checkPaymentTimer = setInterval(() => {
                    this.checkPayment();
                }, 3000);
            },
            error => {
                console.error(error);
            }
        );
    }

    private checkPayment() {
        //todo: check if payment is done
        if (this.expiryTime > new Date()) {
            this.$store.dispatch("checkPayment", { id: this.paymentID }).then(
                response => {
                    if (response.data) {
                        this.isPaid = true;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.vote {
    &.store-card {
        width: 50px;
    }
}
</style>
