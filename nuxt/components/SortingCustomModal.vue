<template>
  <div>
    <v-dialog
        max-width="600"
        persistent
        v-model="isOpen"
    >
      <template>
      <v-card class="pt-6 pl-6 pr-6">
        <div class="d-flex justify-end">
          <v-switch
            v-model="swichMakeDefault"
            inset
            :label="`Make Default`"
          ></v-switch>
        </div>
        <v-divider class="mb-5"></v-divider>
        <div
            v-for="(group) in sliderCustomSorting"
            :key="group.id"
        >
          <h2 v-if="(group.name)">{{ group.name }}</h2>
          <v-slider
            v-for="(slide) in group.slide"
            :key="slide.id"
            :value="slide.value"
            thumb-label
            step="1"
            @change="onChange($event, group.id, slide.id)"
          >
            <template v-slot:prepend>
              <p style="width: 205px; padding-top: 4px">
                {{ slide.label }}
              </p>
            </template>
          </v-slider>
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

            <div
              v-if="this.anonymousValid"
            >
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
import { mapState, mapActions } from "vuex"

export default {
    props: ["isOpen"],
    data() {
        return {}
    },
    computed: {
        ...mapState([
          'loginStatus', 
          'settingCustomSorting', 
          'sliderCustomSorting'
        ]),
        anonymousValid() {
            return this.loginStatus.user && 
                  (this.loginStatus.user?.handle ?? false) ? true : false
        },
        getElementsCustomSorting() {
            let elementsCustomSorting = [...this.sliderCustomSorting].map((x) => {
                return x.slide
            }).flat(1);

            return elementsCustomSorting
        },
        swichMakeDefault: {
          get() {
            return this.settingCustomSorting.default
          },
          set(value) {
            this.saveValueCustomSorting(value);
          }
        },
    },
    methods: {
        ...mapActions([
            "setSettingCustomSorting", 
            "sliderCustomSortingAction",
            "setUpdateLiveSettingCustomSorting"
        ]),
        ...mapActions('modals', ['openSettingsModal']),
        onChange(value, idp, id){
            this.sliderCustomSortingAction({value, idp, id})

            // Change Setting
            this.saveValueCustomSorting(this.swichMakeDefault)
        },
        saveValueCustomSorting(isDefault = false) {
            let sorting = this.getElementsCustomSorting

            let customSorting = {
              score: sorting[0].value,
              halflife: sorting[1].value,
              satsPerLike: sorting[2].value,
              trending:  sorting[3].value,
              likeTrend: sorting[4].value,
              externalTrend:  sorting[5].value,
              novelty: sorting[6].value,
              newontop: sorting[7].value,
              default: isDefault,
            }

            this.setUpdateLiveSettingCustomSorting(customSorting)
        }, 
        async saveOrSaveAndDefault() {
            let sorting = this.getElementsCustomSorting
            
            let customSorting = {
                score: sorting[0].value,
                halflife: sorting[1].value,
                satsPerLike: sorting[2].value,
                trending:  sorting[3].value,
                likeTrend: sorting[4].value,
                externalTrend:  sorting[5].value,
                novelty: sorting[6].value,
                newontop: sorting[7].value,
                default: this.swichMakeDefault,
            }

            await this.setSettingCustomSorting(customSorting)
            this.$emit("update:isOpen", false)
        }
    },
}
</script>

<style>
    .textCapitalize {
        text-transform: capitalize;
    }
</style>>

</style>