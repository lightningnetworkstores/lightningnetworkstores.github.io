<template>
    <div>
        <v-chip
            small
            :color="color"
            text-color="white"
            class="mx-0 pl-0 pr-2"
            @click="openDialog"
        >
            <v-avatar v-if="hasProfilePicture" class="mx-0">
                <v-img
                    :src="user.image"
                    max-height="21"
                    max-width="21"
                    class="mx-0 px-0"
                ></v-img>
            </v-avatar>
            <v-icon v-else class="ml-3 pr-3" size="25" color="white"
                >mdi-account-circle</v-icon
            >
            <div class="ml-0 ml-md-1">{{ username | capitalize }}</div>
        </v-chip>
        <SendTipModal
            :toogleDialog="toogleDialog"
            @close-dialog="closeDialog"
            :hasProfilePicture="hasProfilePicture"
            :username="username"
            :capitalize="username"
            :colorTip="color"
            :imageTip="userImage"
            :userId="userCod"
        />
    </div>
</template>
<script>
import dockerNames from 'docker-names'
import SendTipModal from './SendTipModal.vue'
import { mapState } from 'vuex'

export default {
    props: {
        user: {
            type: Object,
            default: null,
        },
        userId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            toogleDialog: false,
            userImage: '',
            userCod: '',
        }
    },
    components: {
        SendTipModal,
    },
    methods: {
        hslToHex(h, s, l) {
            l /= 100
            const a = (s * Math.min(l, 1 - l)) / 100
            const f = (n) => {
                const k = (n + h / 30) % 12
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
                return Math.round(255 * color)
                    .toString(16)
                    .padStart(2, '0') // convert to Hex and prefix "0" if needed
            }
            return `#${f(0)}${f(8)}${f(4)}`
        },
        hashCode(s) {
            return s.split('').reduce(function (a, b) {
                a = (a << 5) - a + b.charCodeAt(0)
                return a & a
            }, 0)
        },
        getFakeName(userId) {
            const buffer = Buffer.from(userId, 'ascii')
            const adjectiveIndex = buffer[0] % dockerNames.adjectives.length
            const surnameIndex = buffer[1] % dockerNames.surnames.length
            return `${dockerNames.adjectives[adjectiveIndex]} ${dockerNames.surnames[surnameIndex]}`
        },
        closeDialog(e) {
            this.toogleDialog = e
        },
        openDialog() {
            // If exists logged user, then open the modal dialog
            if (this.isLogged && this.anonymousValid) {
                if (this.user) {
                    this.userCod = this.user.id
                } else {
                    this.userCod = ''
                }

                if (this.user && this.user.image)
                    this.userImage = this.user.image
                else this.userImage = ''

                this.toogleDialog = true
            }
        },
    },
    computed: {
        ...mapState('discussions', ['isLogged']),
        color() {
            if (this.user && this.user.image) {
                return '#969696'
            } else {
                const hash = this.hashCode(this.userId)
                const hue = Math.abs(hash % 360)
                return this.hslToHex(hue, 70, 50)
            }
        },
        hasProfilePicture() {
            return this.user && this.user.image
        },
        username() {
            return this.user && this.user.handle
                ? `@${this.user.handle}`
                : this.getFakeName(this.userId)
        },
        anonymousValid() {
            return this.user && this.user.handle ? true : false
        },
    },
}
</script>