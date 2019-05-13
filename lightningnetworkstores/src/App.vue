<template>
    <v-app>
        <v-toolbar class="toolbar" dark>
            <v-toolbar-title><img to="/" src="./assets/images/LNS.svg"/></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat to="/stats">Statistics</v-btn>
                <v-btn flat to="/wallets">Wallets</v-btn>
                <v-btn flat to="/services">Services</v-btn>
                <v-btn flat to="/donations">Donations</v-btn>
                <v-btn flat to="/about">About</v-btn> </v-toolbar-items
            ><v-menu class="hidden-md-and-up">
                <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
                <v-list>
                    <v-list-tile to="/stats">
                        <v-list-tile-content>
                            <v-list-tile-title>Statistics</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile to="/wallets">
                        <v-list-tile-content>
                            <v-list-tile-title>Wallets</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile to="/services">
                        <v-list-tile-content>
                            <v-list-tile-title>Services</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile to="/donations">
                        <v-list-tile-content>
                            <v-list-tile-title>Donations</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile to="/about">
                        <v-list-tile-content>
                            <v-list-tile-title>About</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <v-btn icon :href="'https://twitter.com/bitcoinLNS'">
                <v-icon>fab fa-twitter</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <router-view />
        </v-content>
        <v-icon>wallet</v-icon>
    </v-app>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
    mounted() {
        this.$store.dispatch("fetchStores");
        this.$store.dispatch("fetchScores");
    }
}
</script>
<style lang="scss">
#app {
    font-family: "Roboto", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.toolbar {
    text-decoration: none;
}
.break-word {
    overflow-wrap: break-word;
    word-wrap: break-word;

    -ms-word-break: break-all;
    /* This is the dangerous one in WebKit, as it breaks things wherever */
    word-break: break-all;
    /* Instead use this non-standard one: */
    word-break: break-word;

    /* Adds a hyphen where the word breaks, if supported (No Blink) */
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
}
</style>
