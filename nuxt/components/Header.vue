<template>
    <v-app-bar app color="rgb(56, 56, 56)" dark>
        <v-toolbar-title>
            <nuxt-link to="/">
                <img
                    src="@/assets/images/LightningNetworkStores.svg"
                    class="nav-logo"
                />
            </nuxt-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">

           <!-- Menu List - Web -->

          <v-menu open-on-hover offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                v-bind="attrs"
                v-on="on">
                Explore
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(menuExplore, index) in routesExplore" :key="index">
                <v-btn
                  text
                  :to="menuExplore.url"
                >
                    {{ menuExplore.text }}
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>

            <v-btn
                text
                v-for="route in routes"
                :key="route.text"
                :to="route.url"
            >
                <v-badge
                    v-if="
                        isDiscussionNotificationShowed &&
                        route.text === 'Discuss'
                    "
                    color="orange"
                    dot
                    inline
                    left
                >
                    {{ route.text }}
                </v-badge>
                <div v-else>
                    {{ route.text }}
                </div>
            </v-btn>

            <v-menu open-on-hover v-if="isLogged" offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <ProfilePicture
                        :on="on"
                        :attrs="attrs"
                        :src="profile.image"
                    />
                </template>
                <v-list>
                    <v-list-item v-if="showDashboardButton">
                        <v-btn @click="toDashboard" text style="width: 100%">
                            Dashboard
                        </v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn @click="handleLogout" text style="width: 100%">
                            Logout
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>

            <LoginButton v-if="!isLogged" />
        </v-toolbar-items>



        <!-- ------------------- Menu List - Mobile -------------------- -->
        <v-menu open-on-hover class="hidden-md-and-up">
            <template v-slot:activator="{ on, attrs }">
                <v-app-bar-nav-icon
                    class="hidden-md-and-up"
                    v-bind="attrs"
                    v-on="on"
                >
                    <template #default>
                        <v-badge
                            v-if="isDiscussionNotificationShowed"
                            color="orange"
                            dot
                            overlap
                        >
                            <v-icon>mdi-menu</v-icon>
                        </v-badge>
                        <v-icon v-else>mdi-menu</v-icon>
                    </template>
                </v-app-bar-nav-icon>
            </template>

            <v-menu offset-x absolute left>
              <template v-slot:activator="{ on, attrs }">
                
                <v-list>
                <v-list-item class="justify-center">
                    <LoginButton v-if="!isLogged" />
                    <ProfilePicture v-else :src="profile.image" />
                </v-list-item>
                <v-list-item
                    v-if="isLogged && showDashboardButton"
                    to="/dashboard"
                >
                    <v-list-item>
                        <v-list-item-title> Dashboard </v-list-item-title>
                    </v-list-item>
                </v-list-item>

                <!-- Item from Menu = Explore -->
                <v-list-item
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-list-item-title>
                    <div class="v-list-item">Explore</div>
                  </v-list-item-title>
                </v-list-item>

                <!-- Items Menu -->
                <v-list-item
                    v-for="route in routes"
                    :key="route.text"
                    :to="route.url"
                >
                  <v-list-item>
                    <v-list-item-title>
                      <v-badge
                        v-if="
                            isDiscussionNotificationShowed &&
                            route.text === 'Discuss'
                        "
                        color="orange"
                        dot
                      >
                        {{ route.text }}
                      </v-badge>
                      <div v-else>
                        {{ route.text }}
                      </div>
                    </v-list-item-title>
                  </v-list-item>
                </v-list-item>
                <v-list-item v-if="isLogged">
                    <v-list-item @click="handleLogout">
                        <v-list-item-title> Logout </v-list-item-title>
                    </v-list-item>
                </v-list-item>
            </v-list>
              </template>
              <v-list>
                <v-list-item v-for="(menuExplore, index) in routesExplore" :key="index">
                  <v-btn
                    text
                    :to="menuExplore.url"
                  >
                      {{ menuExplore.text }}
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>


            
        </v-menu>
        <!--  <v-btn icon @click="toggleDarkmode" class="btndarkmode">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        focusable="false"
        width="1em"
        height="1em"
        style="
          -ms-transform: rotate(360deg);
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        "
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path
          d="M10 2c-1.82 0-3.53.5-5 1.35C8 5.08 10 8.3 10 12s-2 6.92-5 8.65C6.47 21.5 8.18 22 10 22a10 10 0 0 0 10-10A10 10 0 0 0 10 2z"
          fill="white"
        />
      </svg>
    </v-btn> -->
    </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            routes: [
                { url: '/discuss', text: 'Discuss' },
                { url: '/faucet', text: 'Faucet' },
                { url: '/stats', text: 'Statistics' },
                //{ url: '/wallets', text: 'Wallets' },
                //{ url: '/donations', text: 'Donations' },
                //{ url: "/contest", text: "Contests" },
                //{ url: "/quiz", text: "Daily Quiz" },
                { url: '/about', text: 'About' },
            ],
            routesExplore: [
              { url: '/trending', text: 'Trending 📈', itHasIcon: true },
              { url: '/searches', text: 'Popular searches', itHasIcon: false },
              { url: '/wallets', text: 'Wallets', itHasIcon: false },
            ]
        }
    },

    computed: {
        showDashboardButton() {
            return this.$route.name !== 'Dashboard'
        },
        ...mapState({
            isDiscussionNotificationShowed(state) {
                return state.lastActivity - 500 > state.lastCommentSeenTimestamp
            },
            profile(state) {
                return state.loginStatus.user
            },
            isLogged(state) {
                if (state.loginStatus.user) return state.loginStatus.user.logged
                else return false
            },
        }),
    },

    methods: {
        toggleDarkmode() {
            this.$cookies.set('darkMode', !this.$vuetify.theme.dark, '3y')
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark
            this.$vuetify.theme.dark = false // turn it off always
        },
        handleLogout() {
            this.$store.dispatch('logoutUser')
        },
        toDashboard() {
            this.$router.push('/dashboard')
        },
    },
}
</script>

<style scoped>
.position-left-menu {
  left: 70px !important
}
</style>

<style>
.v-toolbar__content {
    height: 64px !important;
}
.nav-logo {
    height: 55px;
}
.btndarkmode .v-btn__content {
    font-size: 2em !important;
}
</style>
