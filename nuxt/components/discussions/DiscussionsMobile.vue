<template>
    <div>
        <div>
            <Topics @on-topic-selected="onTopicSelected" />
            <v-expansion-panels>
                <v-expansion-panel
                    v-for="(header, threadIndex) in headers"
                    :key="header.id"
                >
                    <v-expansion-panel-header
                        class="d-flex flex-column align-start py-0 px-1"
                        :disabled="header.isStore"
                        :hide-actions="header.isStore"
                    >
                        <div
                            v-if="header.isStore"
                            class="my-2 mx-0 px-0 d-flex justify-center"
                            style="width: 100%"
                        >
                            <StorePreview
                                :store="header"
                                style="width: 400px"
                            />
                        </div>
                        <DiscussionHeader
                            v-if="!header.isStore"
                            :repliesCount="repliesCount(threadIndex)"
                            :discussionHeader="header"
                            :threadIndex="threadIndex"
                            :threadId="threadId(threadIndex)"
                            :displayDetailLink="true"
                            @paid-reply-request="handlePaidReplyRequest"
                        />
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="px-4">
                        <v-sheet
                            v-for="(reply, replyIndex) in replies(threadIndex)"
                            :key="reply.id"
                        >
                            <v-divider v-if="replyIndex === 0"></v-divider>
                            <div
                                class="
                                    text-caption
                                    d-flex
                                    justify-space-between
                                    my-3
                                "
                            >
                                <div>
                                    <UserTag
                                        :user="reply.user"
                                        :userId="reply.user_id"
                                    />
                                </div>
                                {{ formatDate(reply.timestamp) }}
                                <div>
                                    <DiscussionReplyModal
                                        :reply="reply"
                                        :threadId="threadId(threadIndex)"
                                        :threadIndex="threadIndex"
                                        @paid-reply-request="
                                            handlePaidReplyRequest
                                        "
                                    />
                                </div>
                            </div>
                            <Reply :reply="reply.comment" />
                            <v-divider
                                v-if="
                                    replyIndex < repliesCount(threadIndex) - 2
                                "
                            ></v-divider>
                        </v-sheet>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
        <PaidReplyModal
            v-if="paidReplyData"
            @cancel-reply="paidReplyData = null"
            @reply-payment-confirmed="paidReplyData = null"
            :invoice="paidReplyData.data.payment_request"
            :message="paidReplyData.message"
            :paymentId="paidReplyData.data.id"
        />
    </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { format } from 'timeago.js'

import DiscussionReplyModal from './DiscussionReplyModal.vue'
import UserTag from './UserTag.vue'
import PaidReplyModal from './PaidReplyModal'
import Topics from './Topics.vue'
import Reply from './Reply.vue'
import StorePreview from './StorePreview'
import DiscussionHeader from './DiscussionHeader.vue'

export default {
    components: {
        DiscussionReplyModal,
        UserTag,
        PaidReplyModal,
        Topics,
        Reply,
        StorePreview,
        DiscussionHeader,
    },
    data() {
        return {
            paidReplyData: null,
            selectedTopic: 'ALL',
            selectedReference: null,
        }
    },
    async mounted() {
        this.$store.dispatch('discussions/getLogStatus')
        await this.$store.dispatch('discussions/getDiscussions')
    },
    methods: {
        formatDate(timestamp) {
            return format(timestamp)
        },
        handlePaidReplyRequest(data) {
            this.paidReplyData = data
        },
        onTopicSelected({ topic, index }) {
            this.selectedTopic = topic
        },
        handleHoverOn(reference) {
            this.selectedReference = reference
        },
        handleHoverOff() {
            this.selectedReference = null
        },
        getReplyBackground(reply) {
            if (!this.selectedReference) return 'white'
            const found = reply.id.includes(this.selectedReference.slice(1))
            if (this.selectedReference && found) {
                return 'aliceblue'
            }
            return 'white'
        },
    },
    computed: {
        headers() {
            return this.filteredDiscussions(this.selectedTopic)
                .map((comments) => {
                    const firstComment = comments[0]
                    const { store } = firstComment
                    if (store) {
                        return [
                            { isStore: true, ...store },
                            { isStore: false, ...firstComment },
                        ]
                    } else {
                        return [{ isStore: false, ...firstComment }]
                    }
                })
                .flat()
        },
        storeCount() {
            return (index) =>
                this.headers.slice(0, index).filter((item) => item.isStore)
                    .length
        },
        replies() {
            return (index) => {
                const threadIndex = index - this.storeCount(index)
                return this.filteredDiscussions(this.selectedTopic)[
                    threadIndex
                ].slice(1)
            }
        },
        repliesCount() {
            return (index) => {
                const threadIndex = index - this.storeCount(index)
                return (
                    this.filteredDiscussions(this.selectedTopic)[threadIndex]
                        .length - 1
                )
            }
        },
        threadId() {
            return (index) => {
                const threadIndex = index - this.storeCount(index)
                return this.filteredDiscussions(this.selectedTopic)[
                    threadIndex
                ][0].thread_id
            }
        },
        ...mapGetters('discussions', ['filteredDiscussions']),
        ...mapState('discussions', ['lastDiscussions']),
    },
}
</script>