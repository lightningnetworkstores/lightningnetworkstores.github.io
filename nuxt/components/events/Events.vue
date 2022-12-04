<template>
    <v-container fluid class="px-0 pt-0" xs="11">
        <v-row justify="center">
            <v-col justify-center lg="6" md="12" sm="12" xs="12" class="pt-0">
                <LazyListCards
                    :items="events"
                    :className="`${$style['store-row']}`"
                    :maxItems="listCardsMaxItems"
                >
                    <template
                        slot="item"
                        slot-scope="{ slotScope: discussion }"
                    >
                        <store-card
                            :class="`${$style['store-card']} mb-2`"
                            :key="'store-' + discussion.store.id"
                            :store="discussion.store"
                            :style="{ marginTop: '1rem' }"
                        >
                        </store-card>
                        <event-card
                            :event="discussion.event"
                            :type="discussion.type"
                        />
                    </template>
                </LazyListCards>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import { mapState } from 'vuex'
import LazyListCards from '@/components/LazyListCards.vue'
import EventCard from '@/components/EventCard.vue'

export default {
    components: { EventCard, LazyListCards },
    computed: {
        listCardsMaxItems() {
            return this.$vuetify.breakpoint.width >= this.screenWidthBp ? 10 : 1
        },
        ...mapState('discussions', ['events']),
    },
}
</script>
<style module>
.store-row {
    flex-direction: column;
    align-content: center;
    padding: 2em;
    max-width: 550px;
    margin: auto;
}
.store-card {
    width: 100%;
}
@media (max-width: 600px) {
    .store-row {
        padding: 1.5em 0;
    }
}
</style>