<template>
    <v-app>
        <v-toolbar class="toolbar" dark>
            <v-toolbar-title><v-btn flat to="/">Lightning Network Stores</v-btn></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn flat to="/stats">Stats</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <router-view />
        </v-content>
    </v-app>
</template>

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
.store-link {
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
}
</style>
