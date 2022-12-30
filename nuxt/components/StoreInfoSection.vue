<template>
  <v-row class="pt-0">
    <v-col>
      <div class="d-flex">
        <p class="mt-2">
          {{ selectedStore.description }}
        </p>
        <edit-store-modal
          v-if="editingSelectedStore"
          :store="selectedStore"
          :editAttribute="{
            label: 'Description',
            value: selectedStore.description,
            key: 'description',
          }"
          class="ml-2"
        />
      </div>

      <div class="d-flex">
        <p class="mt-2" v-if="selectedStore.long_description">
          {{ selectedStore.long_description }}
        </p>
        <edit-store-modal
          v-if="editingSelectedStore"
          :store="selectedStore"
          :editAttribute="{
            label: 'Long description',
            value: selectedStore.long_description,
            key: 'long_description',
          }"
          class="ml-2"
        />
      </div>

      <div
        v-if="selectedStore.uri && selectedStore.uri.toLowerCase() != 'unknown'"
        class="px-0"
      >
        <div class="d-flex">
          <span class="break-word mt-2"
            ><b>Node:&nbsp;</b
            ><a
              :href="'https://1ml.com/node/' + selectedStore.uri.split('@')[0]"
              >{{ selectedStore.uri }}</a
            ></span
          >
          <edit-store-modal
            v-if="editingSelectedStore"
            :store="selectedStore"
            :editAttribute="{
              label: 'Node URI',
              value: selectedStore.uri,
              key: 'uri',
            }"
            class="ml-2"
          />
        </div>
      </div>

      <div class="px-0">
        <div class="d-flex">
          <span class="break-word mt-2"><b>Nostr:&nbsp;</b></span>
          <edit-store-modal
            v-if="editingSelectedStore"
            :store="selectedStore"
            :editAttribute="{
              label: 'Nostr',
              value: selectedStore.nostr,
              key: 'nostr',
            }"
            class="ml-2"
          />
        </div>
      </div>

      <div class="px-0">
        <b>Date added:&nbsp;</b
        ><span v-if="selectedStore.added">
          {{
            new Date(selectedStore.added * 1000).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          }}</span
        ><a v-else>24/Feb/2018</a>
      </div>

      <div class="px-0">
        <b>Likes: &nbsp;</b>
        <like-store-button :store="selectedStore" :key="Date.now()" />
      </div>

      <div
        v-if="selectedStore.sector && selectedStore.sector.length > 0"
        class="px-0"
      >
        <b>Lifetime score: &nbsp;</b
        ><span v-if="selectedStore.lifetime">
          {{ Number(selectedStore.lifetime).toLocaleString() }}</span
        ><span v-else>0</span>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import LikeStoreButton from '../components/LikeStoreButton.vue'

export default {
  name: 'StoreInfoSection',
  props: {
    // selectedStore: {
    //   type: Object,
    //   default: () => {},
    // },
  },
  computed: {
    ...mapState(['likedStores', 'selectedStore', 'editingSelectedStore']),
  },
  methods: {},
}
</script>
