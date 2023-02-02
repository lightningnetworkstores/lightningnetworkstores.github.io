<template>
  <v-app-bar app color="rgb(56, 56, 56)" dark>
    <v-menu v-if="sisterSites.length" v-model="showMenu" offset-y bottom open-on-hover>
      <template v-slot:activator="{ on, attrs }">
        <div class="d-flex justify-start align-center" style="height: 100%">
          <nuxt-link to="/">
            <img src="@/assets/images/LightningNetworkStores.svg" class="nav-logo" alt="Lightning Network Stores logo"/>
          </nuxt-link>
          <v-icon large color="grey lighten-1" v-bind="attrs" v-on="on" class="sister-site-dropdown-btn">
            mdi-chevron-down
          </v-icon>
        </div>
      </template>
      <v-list dense id="networkWebSite" color="#383838">
        <v-list-item v-for="(site, index) in sisterSites" :key="site.url" ripple link >
          <a :href="site.url" style="width: 100%">
            <div>
              <img :src="site.svgPath" class="sister-site-entry"/>
              <v-divider v-if="index < sisterSites.length - 1"></v-divider>
            </div>
          </a>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <!-- Menu List - Web -->

      <v-menu open-on-hover offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on"> Explore </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(menuExplore, index) in routesExplore"
            :key="index"
          >
            <v-btn text :to="menuExplore.url">
              {{ menuExplore.text }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu open-on-hover offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on"> Community </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(menu, index) in routesCommunity" :key="index">
            <v-btn text :to="menu.url">
              {{ menu.text }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn text v-for="route in routes" :key="route.text" :to="route.url">
        <v-badge
          v-if="isDiscussionNotificationShowed && route.text === 'Discuss'"
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
          <ProfilePicture :on="on" :attrs="attrs" :src="profile.image" />
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
        <v-app-bar-nav-icon class="hidden-md-and-up" v-bind="attrs" v-on="on">
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

      <v-list>
        <v-list-item class="justify-center">
          <LoginButton v-if="!isLogged" />
          <ProfilePicture v-else :src="profile.image" />
        </v-list-item>
        <v-list-item v-if="isLogged && showDashboardButton" to="/dashboard">
          <v-list-item>
            <v-list-item-title> Dashboard </v-list-item-title>
          </v-list-item>
        </v-list-item>
        <!-- Menu Explore -->
        <v-list-item>
          <v-menu offset-x absolute :content-class="positionExploreCard">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-title> Explore </v-list-item-title>
              </v-list-item>
            </template>
            <v-list width="195px" max-width="195px">
              <v-list-item
                v-for="(menuExplore, index) in routesExplore"
                :key="index"
              >
                <v-btn
                  text
                  :to="menuExplore.url"
                  block
                  style="justify-content: left"
                >
                  {{ menuExplore.text }}
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
        <!-- Menu Community -->
        <v-list-item>
          <v-menu offset-x absolute :content-class="positionExploreCard">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-title> Community </v-list-item-title>
              </v-list-item>
            </template>
            <v-list width="195px" max-width="195px">
              <v-list-item
                v-for="(menuCommunity, index) in routesCommunity"
                :key="index"
              >
                <v-btn
                  text
                  :to="menuCommunity.url"
                  block
                  style="justify-content: left"
                >
                  {{ menuCommunity.text }}
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
        <!-- Items Menu -->
        <v-list-item v-for="route in routes" :key="route.text" :to="route.url">
          <v-list-item>
            <v-list-item-title>
              <v-badge
                v-if="
                  isDiscussionNotificationShowed && route.text === 'Discuss'
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
        <!-- Logout -->
        <v-list-item v-if="isLogged">
          <v-list-item @click="handleLogout">
            <v-list-item-title> Logout </v-list-item-title>
          </v-list-item>
        </v-list-item>
      </v-list>
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
      showMenu: false,
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
      ],
      routesCommunity: [
        { url: '/builders', text: 'Builders' },
        { url: '/contributors', text: 'Contributors' },
      ],
      sisterSites: [
        {
          url: 'https://nostrich.fun',
          svgPath: '/nostrich-fun.svg',
        },
        // {
        //   url: 'https://yp.bitcoin-stores.com',
        //   svgPath: '/yp.bitcoin-stores.com.svg',
        // },
      ],
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
    positionExploreCard() {
      let brackPointWitdh = this.$vuetify.breakpoint.width
      if (brackPointWitdh < 361) return 'positionCardMobile_xxs'
      if (brackPointWitdh < 376) return 'positionCardMobile_xs'
      if (brackPointWitdh < 395) return 'positionCardMobile_sm'
      if (brackPointWitdh < 419) return 'positionCardMobile_md'
      else if (brackPointWitdh > 420 && brackPointWitdh < 480)
        return 'positionCardMobile_sm'
      else if (brackPointWitdh < 800) return 'positionCardMobile_lg'
      else if (brackPointWitdh < 900) return 'positionCardMobile_xl'
      else if (brackPointWitdh < 1200) return 'positionCardMobile_xxl'
      else return 'positionCardMobile_sm'
    },
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

<style>
.position-left-menu {
  left: 70px !important;
}
</style>

<style>
.v-toolbar__content {
  height: 64px !important;
}
.sister-site-entry {
  max-width: 380px;
}
.sister-site-dropdown-btn {
  margin-left: -0.3em;
  align-self: end;
}
@media (min-width: 768px) {
  .sister-site-dropdown-btn {
    margin-left: -0.4em;
  }
}
.nav-logo {
  height: 55px;
  position: relative;
  max-width: 380px;
  right: 1rem;
}
@media (min-width: 768px) {
  .nav-logo {
    margin-left: 1em;
    right: 1.5rem;
  }
}
.btndarkmode .v-btn__content {
  font-size: 2em !important;
}
.positionCardMobile_xxs {
  left: 20px !important;
}
.positionCardMobile_xs {
  left: 36px !important;
}
.positionCardMobile_sm {
  left: 51px !important;
}
.positionCardMobile_md {
  left: 74px !important;
}
.positionCardMobile_lg {
  left: 428px !important;
}
.positionCardMobile_xl {
  left: 479px !important;
}
.positionCardMobile_xxl {
  left: 573px !important;
}
</style>
