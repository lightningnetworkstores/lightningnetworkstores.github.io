<template>
    <v-layout justify-center row wrap class="my-4">
        <v-flex xs11 md8 lg6>
            <v-card>
                <v-layout row pa-2>
                    <v-flex>
                        <v-textarea v-model="text" auto-grow box label="Review" rows="5"></v-textarea>
                    </v-flex>
                </v-layout>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="green darken-1" flat="flat">
                        Post
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components: {}
})
export default class NewReview extends Vue {
    @Prop() storeId!: number;
    text: string = "";

    mounted() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
