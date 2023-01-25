<template>
  <div class="pt-4">
    <v-container>
      <v-row justify="center" no-gutters>
        <v-col>
          <h1 class="my-2 mb-3" style="text-align: center">
            Builders with their projects
          </h1>
          <v-card class="pa-2" elevation="2">
            <v-card-text>
              <div v-for="builder in buildersProjects" :key="builder.id">
                <div
                  class="d-flex"
                  :style="{
                    position: 'relative',
                  }"
                >
                  <v-avatar class="mt-2 ma-1" v-bind="attrs" v-on="on">
                    <img :src="builder.image" :alt="builder.name" />
                  </v-avatar>
                  <div class="d-block ml-3">
                    <div class="d-flex flex-column mt-2">
                      <h3>{{ builder.name }}</h3>
                      <span>@{{ builder.handle }}</span>
                    </div>

                    <div v-if="!isMobile" class="my-3 d-flex flex-wrap">
                      <div
                        v-for="project in builder.projects"
                        :key="project.id"
                      >
                        <StorePreview
                          :store="project"
                          class="my-1"
                          style="width: 340px"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Builders Mobile -->
                <div v-if="isMobile" class="ml-3 my-3 d-flex flex-wrap">
                  <div v-for="project in builder.projects" :key="project.id">
                    <StorePreview
                      :store="project"
                      style="width: 100%"
                      minText="35%"
                      class="my-1"
                    />
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import StorePreview from '../components/discussions/StorePreview.vue'
import Head from '~/mixins/Head'

export default {
  data() {
    return {}
  },
  mixins: [Head],
  head() { return this.getMetadata('LN builders',
  'List of people building on the lightning network and their projects.', '/ogimage.png')},
  components: {
    StorePreview,
  },
  computed: {
    ...mapState(['buildersProjects']),
    isMobile() {
      return this.$vuetify.breakpoint.name === 'xs'
    },
  },
  created() {
    this.$store.dispatch('getBuildersProjects')
  },
}
</script>

<style></style>
