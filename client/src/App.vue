<template>
    <v-app :dark="darkMode">
        <v-toolbar class="toolbar" color="#272727" dark>
            <v-toolbar-title
                ><a href="/"><img src="@/assets/images/LightningNetworkStores.svg" class="nav-logo"/></a
            ></v-toolbar-title>
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
                    <v-list-tile href="https://twitter.com/bitcoinLNS">
                        <v-list-tile-content>
                            <v-list-tile-title>Twitter</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <v-btn icon href="https://twitter.com/bitcoinLNS" class="hidden-sm-and-down">
                <v-icon>fab fa-twitter</v-icon>
            </v-btn>

            <v-btn icon @click="toggleDarkmode">
                <v-icon>brightness_2</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <router-view />
        </v-content>
        <v-icon>wallet</v-icon>
        <v-footer class="pa-3" color="rgb(56, 56, 56)" dark>
            <v-layout justify-center row wrap>
                <v-flex text-xs-center> Copyright &copy; {{ new Date().getFullYear() }} LightningNetworkStores.</v-flex>
            </v-layout>
        </v-footer>
    </v-app>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class App extends Vue {
    darkMode: boolean = true;

    mounted() {
        this.darkMode = this.$cookies.get("darkMode") == "true";
    }

    private toggleDarkmode() {
        this.$cookies.set("darkMode", !this.darkMode, "3y");
        this.darkMode = !this.darkMode;
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
.nav-logo {
    height: 55px;
}
.v-image__image {
    background-position: top center !important;
}
.datatable-layout {
    display: inline-block;
    width: 100%;
}
.v-dialog {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}

.noscroll {
    position: fixed;
    overflow-x: hidden;
    overflow-y: hidden;
}
</style>
