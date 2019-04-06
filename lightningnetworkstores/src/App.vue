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
</style>
