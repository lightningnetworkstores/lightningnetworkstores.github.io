<template>
    <v-card>
        <v-card-title> Contributor Program </v-card-title>
        <v-card-text v-if="contributorProgram">
            You can earn bitcoin by helping us curate this website! It's just like contributing to wikipedia but you get paid in bitcoin.
            Paymnents are sent every day at 9am UTC. You can track the activity of currency contributors <a href="/contributors"> here </a>
            and the pending daily payments shows in the balance section of this dashboard. Get in touch with us to become a contributor.
        </v-card-text>
        <v-card-text v-if="contributorProgram">
            <p class="my-0">Sats per edit: {{ contributorProgram.edits }}</p>
            <p class="my-0">Sats per tag: {{ contributorProgram.tagging }}</p>
            <p class="my-0">Sats per builder: {{ contributorProgram.builders }}</p>
            <p class="my-0">Sats per image: {{ contributorProgram.images }}</p>
            <p class="my-0">Sats per listing: {{ contributorProgram.listings }}</p>
            <p class="my-0">Sats per delisting: {{ contributorProgram.delistings }}</p>
        </v-card-text>
    </v-card>
</template>
<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {}
    },
    methods: {},
    computed: {
        ...mapState('wallet', ['affiliate', 'contributorProgram']),
    },
}
</script>
