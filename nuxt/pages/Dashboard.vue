<template>
    <div>
        <div class="hidden-sm-and-down">
            <v-layout class="mt-5 mx-5">
                <v-container>
                    <v-row>
                        <v-col>
                            <v-card
                                elevation="2"
                                class="px-5 py-1 d-flex flex-column"
                                min-height="30em"
                            >
                                <v-card-title
                                    class="
                                        d-flex
                                        justify-center
                                        text-h4
                                        flex-shrink-1
                                    "
                                >
                                    Balance
                                </v-card-title>
                                <div
                                    v-if="info !== null"
                                    class="d-flex flex-column flex-grow-1"
                                >
                                    <BalanceChart />
                                </div>
                            </v-card>
                        </v-col>
                        <v-col>
                            <v-card
                                class="
                                    px-5
                                    d-flex
                                    flex-column
                                    justify-start
                                "
                                min-height="30em"
                            >
                                <Wallet />
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <TxHistory />
                        </v-col>
                    </v-row>
                    <v-row v-if="privilege=='SHAREHOLDER'">
                      <v-spacer></v-spacer>
                      <v-col cols="2"><v-btn color="primary" href='/investor'>
                        Investor page
                      </v-btn></v-col>
                      <v-spacer></v-spacer>
                    </v-row>
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-col cols="6">
                            <AffiliateRules />
                        </v-col>
                        <v-spacer></v-spacer>
                    </v-row>
                     <v-row>
                        <v-spacer></v-spacer>
                        <v-col cols="6">
                            <ContributorRules />
                        </v-col>
                        <v-spacer></v-spacer>
                    </v-row>
                </v-container>
            </v-layout>
        </div>
        <div class="hidden-md-and-up mt-5">
            <v-layout d-flex flex-column align-center>
                <v-card elevation="2" class="ma-1 px-3" min-width="95%">
                    <v-card-title class="d-flex justify-center text-h4">
                        Balance
                    </v-card-title>
                    <div v-if="info !== null">
                        <BalanceChart />
                    </div>
                </v-card>
                <v-card elevation="2" class="mx-2 my-2" min-width="95%">
                    <Wallet />
                </v-card>
                <TxHistory class="mx-2 my-2" />
                <v-card v-if="privilege=='SHAREHOLDER'" class="mt-3 mb-3">
                  <v-btn color="primary" href='/investor'>
                    Investor page
                  </v-btn>
                </v-card>
                <v-card elevation="2" class="mx-2 my-2" min-width="95%">
                  <AffiliateRules />
                </v-card>
                 <v-card elevation="2" class="mx-2 my-2" min-width="95%">
                  <ContributorRules />
                </v-card>
            </v-layout>
        </div>
    </div>
</template>


<script>
import Head from '~/mixins/Head'

import { mapActions } from 'vuex'
export default {
    data() {
        return {
            info: null,
        }
    },
     mixins: [Head],
    head() { return this.getMetadata('LNS Dashboard', 'Custodial web wallet associated with your LNS account.', '/ogimage.png')},
    computed: {
      privilege(){
        if(this.info==null) return 'NONE'
        return this.info.data.privilege
      }
    },
    methods: {
        ...mapActions('modals', ['openSettingsModal']),
    },
    async mounted() {
        try {
            const dataAxios = await this.$axios.get('/api/dashboardinfo')
            this.info = dataAxios.data
        } catch (error) {
            if (error.response && error.response.status === 403) {
                this.openSettingsModal()
            } else {
                console.log(error)
            }
        }
    },
}
</script>
