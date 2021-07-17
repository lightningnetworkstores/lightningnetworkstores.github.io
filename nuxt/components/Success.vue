<template>
    <v-card flat class="text-center">
        <v-card-title class="headline">
            <v-row class="py-2">
                <v-flex>{{ confirm_title }}</v-flex>
            </v-row>
        </v-card-title>
        <svg
            class="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
        >
            <circle
                class="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
            />
            <path
                class="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
        </svg>
        <blockquote class="twitter-tweet" v-if="tweet">
            <a :href="'https://twitter.com/x/status/' + tweet"></a>
        </blockquote>
        <script
            async
            src="https://platform.twitter.com/widgets.js"
            charset="utf-8"
        ></script>
        <v-row v-if="message" class="ma-2 pt-2">
            <v-flex>
                <h3>{{ message }}</h3>
            </v-flex>
        </v-row>
        <v-row v-if="store && Object.keys(store).length > 1" class="ma-2 pt-2">
            <v-flex
                >Go to
                <a :href="'/store/' + store.rooturl">{{
                    store.name
                }}</a></v-flex
            >
        </v-row>

        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="handleClose">
                Close
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    name: 'Success',
    props: {
        tweet: {
            type: String,
            default: '',
        },
        confirm_title: {
            type: String,
            default: '',
        },
        store: {
            type: Object,
            default: () => {},
        },
        message: {
            type: String,
            default: '',
        },
    },
    methods: {
        handleClose() {
            this.$emit('cancel')
        },
    },
}
</script>
<style scoped>
.checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #7ac142;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #fff;
    stroke-miterlimit: 10;
    margin: 10% auto;
    box-shadow: inset 0px 0px 0px #7ac142;
    animation: fill 0.4s ease-in-out 0.4s forwards,
        scale 0.3s ease-in-out 0.9s both;
}

.checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
    100% {
        stroke-dashoffset: 0;
    }
}
@keyframes scale {
    0%,
    100% {
        transform: none;
    }
    50% {
        transform: scale3d(1.1, 1.1, 1);
    }
}
@keyframes fill {
    100% {
        box-shadow: inset 0px 0px 0px 30px #7ac142;
    }
}
</style>
