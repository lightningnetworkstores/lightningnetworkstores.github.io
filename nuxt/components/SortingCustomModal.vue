<template>
    <div>
        <v-dialog max-width="600" persistent v-model="isOpen">
            <template>
                <v-card class="pt-6 pl-6 pr-6">
                    <h1 style="text-align: center">Customize the ordering</h1>
                    <br />
                    <div v-for="group in sliderCustomSorting" :key="group.id">
                        <h2 v-if="group.name">{{ group.name }}</h2>
                        <br />
                        <div v-for="slide in group.slide" :key="slide.id">
                            <v-row>
                                <v-col>
                                    <v-slider
                                        :value="slide.value"
                                        :step="slide.step < 1 ? 1 : slide.step"
                                        :min="slide.min"
                                        :max="slide.max"
                                        @input="
                                            onChange($event, group.id, slide.id)
                                        "
                                        :ticks="slide.ticks"
                                        :tick-size="slide.ts"
                                    >
                                    <template v-slot:prepend>
                                      <div class="d-flex align-center">
                                        <span style="width: max-content; margin-right: 15px;">{{ slide.label }}</span>
                                        <v-tooltip right>
                                          <template
                                              v-slot:activator="{ on, attrs }"
                                          >
                                              <v-btn
                                                  depressed
                                                  :style="sizeIcons"
                                                  color="white"
                                                  fab
                                                  v-bind="attrs"
                                                  v-on="on"
                                              >
                                                  <v-icon class="float-left" color="#000">mdi-information-outline</v-icon
                                                  ></v-btn
                                              >
                                          </template>
                                          <span>{{ slide.explainer }}</span>
                                        </v-tooltip>
                                      </div>
                                    </template>
                                    </v-slider>
                                </v-col>
                            </v-row>
                        </div>
                    </div>

                                                                          <!-- Advanced options -->

                    <v-list-group
                        no-action
                        sub-group
                        class="sort-items-more"
                        :ripple="false"
                        color="gray"
                    >
                        <template v-slot:activator>
                            <v-list-item-content class="pa-0">
                                <v-list-item-title class="pa-0"
                                    >Advanced options</v-list-item-title
                                >
                            </v-list-item-content>
                        </template>
                        <br />

                        <v-list-item
                            v-for="slide in customSortingAdvanced"
                            :key="slide.id"
                            class="pa-0 my-0"
                            style="overflow: initial"
                        >
                            <v-row>
                                <v-col>
                                    <v-slider
                                        :value="slide.value"
                                        thumb-label
                                        :step="slide.step < 1 ? 1 : slide.step"
                                        :min="slide.min"
                                        :max="slide.max"
                                        @input="onChange($event, 'advanced', slide.id)"
                                        :ticks="slide.ticks"
                                        :tick-size="slide.ts"
                                    >
                                    <template v-slot:prepend>
                                      <div class="d-flex align-center">
                                        <span style="width: max-content; margin-right: 15px;">{{ slide.label }}</span>
                                        <v-tooltip right>
                                          <template
                                              v-slot:activator="{ on, attrs }"
                                          >
                                              <v-btn
                                                  depressed
                                                  :style="sizeIcons"
                                                  color="white"
                                                  fab
                                                  dark
                                                  v-bind="attrs"
                                                  v-on="on"
                                              >
                                                  <v-icon class="float-left" color="#000"
                                                      >mdi-information-outline</v-icon
                                                  ></v-btn
                                              >
                                          </template>
                                          <span>{{ slide.explainer }}</span>
                                        </v-tooltip>
                                      </div>
                                    </template>
                                    </v-slider>
                                </v-col>
                            </v-row>
                        </v-list-item>
                    </v-list-group>

                                                                              <!-- Footer of modal -->
                    <div class="d-flex justify-end">
                        <v-switch
                            v-model="swichMakeDefault"
                            inset
                            :label="`Make default sorting method`"
                        ></v-switch>
                    </div>

                    <v-card-actions class="justify-end pr-0">
                        <v-btn
                            class="ma-2 textCapitalize"
                            outlined
                            color="secondary"
                            @click="$emit('update:isOpen', false)"
                        >
                            close
                        </v-btn>

                        <div v-if="this.anonymousValid">
                            <v-btn
                                class="ma-2 textCapitalize"
                                outlined
                                color="secondary"
                                @click="saveOrSaveAndDefault()"
                            >
                                Save
                            </v-btn>
                        </div>

                        <v-btn
                            v-else
                            class="ma-2 textCapitalize"
                            outlined
                            color="secondary"
                            @click="openSettingsModal()"
                        >
                            Login to save sorting
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    props: ['isOpen'],
    data() {
        return {}
    },
    computed: {
        ...mapState([
            'loginStatus',
            'settingCustomSorting',
            'sliderCustomSorting',
            'customSortingAdvanced',
        ]),
        ...mapGetters(['getTrendingScore']),
        sizeIcons() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return {
                  width: "24px",
                  height: "24px"
                }
                default: return {
                  width: "32px",
                  height: "32px"
                }
            }
        },
        anonymousValid() {
            return this.loginStatus.user &&
                (this.loginStatus.user?.handle ?? false)
                ? true
                : false
        },
        getElementsCustomSorting() {
          let elementsCustomSorting = [...this.sliderCustomSorting]
              .map((x) => {
                  return x.slide
              })
              .flat(1)


          // const trendingScoreValues = [];

          // elementsCustomSorting.filter((parameters) => 
          //         ["trending", "likeTrend", "externalTrend"].includes(parameters.id))
          // .forEach((trending) => {
          //   let trendingIndex = elementsCustomSorting.findIndex(
          //     (params) => params.id == trending.id
          //   )
            
          //   trendingScoreValues[trending.id] = {
          //     index: trendingIndex,
          //     value: trending
          //   }
          // })
          
          // const trendingScore = this.getTrendingScore(trendingScoreValues)

          // trendingScore.forEach(trending => {
          //   elementsCustomSorting.splice(trending.index, 1, trending.value)
          // })
          
          elementsCustomSorting = [...elementsCustomSorting, ...this.customSortingAdvanced]
          
          let sortingParameters = {}
          elementsCustomSorting.forEach(el => { sortingParameters[el.id] = el.value });

          sortingParameters["default"] = false
          
          return sortingParameters
        },
        swichMakeDefault: {
            get() {
                return this.settingCustomSorting.default
            },
            set(value) {
                // console.log({value})
                this.saveValueCustomSorting(value)
            },
        },
    },
    methods: {
        ...mapActions([
            'setSettingCustomSorting',
            'sliderCustomSortingAction',
            'setUpdateLiveSettingCustomSorting',
        ]),
        ...mapActions('modals', ['openSettingsModal']),
        onChange(value, idp, id) {
            this.sliderCustomSortingAction({ value, idp, id })

            // Change Setting
            this.saveValueCustomSorting(this.swichMakeDefault)
        },
        saveValueCustomSorting(isDefault = false) {
            let sorting = {...this.getElementsCustomSorting}
            sorting['default'] = isDefault;

            this.setUpdateLiveSettingCustomSorting(sorting)
        },
        async saveOrSaveAndDefault() {
            let sorting = {...this.getElementsCustomSorting}
            sorting['default'] = this.swichMakeDefault;

            
            await this.setSettingCustomSorting(sorting)
            this.$emit('update:isOpen', false)
        },
    },
}
</script>

<style>
.textCapitalize {
    text-transform: capitalize;
}
.xx-small-icon {
  width: 24px;
  height: 24px;
}
</style>>

</style>