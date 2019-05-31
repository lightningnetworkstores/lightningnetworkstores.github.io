<template>
    <v-layout justify-center row wrap class="my-4">
        <v-flex xs11 md8 lg6>
            <v-card class="pb-2">
                <v-layout row pt-4 pl-4 pr-4>
                    <v-flex shrink class="text-xs-center">
                        <vote :store="store" :isReviewUpvote="comment.score > 0" :parentReview="comment.id"></vote>
                        {{ comment.score | number }}
                    </v-flex>

                    <v-flex pa-3 class="comment-text">
                        {{ comment.text.replace(/\+/g, " ") }}
                    </v-flex>
                </v-layout>

                <v-layout row pl-4 pr-4 class="caption comment-extra">
                    <v-flex grow pa-2>ID: {{ comment.id.substring(0, 5) }} </v-flex>
                    <v-flex grow pa-2 class="text-xs-right">{{ getISOStringWithoutSecsAndMillisecs(new Date(comment.timestamp)) }} </v-flex>
                    <v-flex shrink pr-2 pt-2>
                        <vote :store="store" :parentReview="comment.id" :parentComment="comment.id" :comment="comment"></vote>
                    </v-flex>
                </v-layout>

                <!-- .sort((a, b) => {
                            return Math.abs(a.score) - Math.abs(b.score);
                        }) -->
                <v-layout row pt-1 pb-1 pl-3 pr-3 v-for="subComment in comments.filter(subComment => subComment.parent == comment.id).sort((a, b) => a.timestamp - b.timestamp)" :key="subComment.id">
                    <v-flex>
                        <v-card>
                            <v-layout row pa-2 pt-3>
                                <v-flex pl-2 class="comment-text" v-html="commentText(subComment.text.replace(/\+/g, ' '))"></v-flex>
                            </v-layout>

                            <v-layout row pa-2 class="caption comment-extra">
                                <v-flex grow pa-2>ID: {{ subComment.id.substring(0, 5) }} </v-flex>
                                <v-flex grow pa-2 class="text-xs-right">{{ getISOStringWithoutSecsAndMillisecs(new Date(subComment.timestamp)) }} </v-flex>
                                <v-flex shrink pr-2 pt-2>
                                    <vote :store="store" :parentReview="comment.id" :parentComment="subComment.id" :comment="comment" :isReplyToSubComment="true"></vote>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Comment } from "../interfaces/Comment";
import { Store } from "../interfaces/Store";
import Vote from "@/components/Vote.vue";

@Component({
    components: { Vote }
})
export default class Review extends Vue {
    @Prop() store!: Store;
    @Prop() comment!: Comment;
    @Prop() comments!: Comment[];

    mounted() {}

    private commentText(comment: string) {
        return comment.startsWith("@")
            ? "<span class='tag'>" + this.htmlEntities(comment.substring(0, 6)) + "</span>" + this.htmlEntities(comment.substring(6, comment.length))
            : this.htmlEntities(comment);
    }

    private htmlEntities(input: string) {
        return String(input)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    private getISOStringWithoutSecsAndMillisecs(date: Date) {
        const dateAndTime = date.toISOString().split("T");
        const time = dateAndTime[1].split(":");

        return dateAndTime[0] + " " + time[0] + ":" + time[1];
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.score-line {
    line-height: 30px;
}
.tag {
    background-color: #dddddd;
}
.comment-extra {
    // color: rgba(0, 0, 0, 0.5);
}
.comment-text {
    -ms-word-break: break-all;
    word-break: break-all;
    word-break: break-word;
    max-height: 330px;
    overflow-y: hidden;
}
</style>
