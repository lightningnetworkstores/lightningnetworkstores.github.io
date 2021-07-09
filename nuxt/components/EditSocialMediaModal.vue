<template>
  <div>
    <v-btn icon @click.stop="showDialog = true">
      <v-icon>fa-edit</v-icon>
    </v-btn>
    <v-dialog v-model="showDialog" max-width="500" persistent>
      <v-card>
        <v-card-title>Edit Social Media</v-card-title>
        <v-layout :key="index" v-for="(option, index) in options" row class="ml-3 mr-4 mt-0 d-flex">
          <v-text-field
            outlined
            @input="() => handleUrlChange(index)"
            v-model="options[index].url"
            :label="option.name"
          >
          <template v-slot:prepend-inner>
            <v-icon :color="option.url === '' ? 'BFBFBF' : social[option.name].color">
              {{ social[option.name].icon }}
            </v-icon>
          </template>
          </v-text-field>
        </v-layout>
        <v-layout row class="mx-3 my-3" justify-center>
          <v-progress-circular
            v-if="isProcessing"
            indeterminate
            size="30"
          />
        </v-layout>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green"
            @click="closeDialog"
            :disabled="isProcessing"
            text
          >
            Cancel
          </v-btn>
          <v-btn
            color="green"
            @click="onSubmit"
            :disabled="formError || isProcessing"
            text
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import SocialMedia from '~/mixins/social-media'
export default {
  props: ['store'],
  mixins: [SocialMedia],
  data() {
    const getUrl = socialNetworkName => {
      const { store } = this;
      return store.social[socialNetworkName] ? store.social[socialNetworkName].href : ''
    }
    return {
      showDialog: false,
      options: [
        {
          name: 'reddit',
          url: getUrl('reddit'),
          modified: false,
          error: null
        },
        {
          name: 'twitter',
          url: getUrl('twitter'),
          modified: false,
          error: null
        },
        {
          name: 'telegram',
          url: getUrl('telegram'),
          modified: false,
          error: null
        },
        {
          name: 'facebook',
          url: getUrl('facebook'),
          modified: false,
          error: null
        },
        {
          name: 'instagram',
          url: getUrl('instagram'),
          modified: false,
          error: null
        },
        {
          name: 'linkedin',
          url: getUrl('linkedin'),
          modified: false,
          error: null
        }
      ],
      isProcessing: false,
      formError: null
    }
  },
  methods: {
    handleValueChange(value) {
      const index = this.options.findIndex(item => item === this.selected);
      if (index !== -1) {
        this.values[index] = value;
      }
    },
    handleUrlChange(index) {
      if (this.options[index]) {
        this.options[index].modified = true
      }
    },
    reset() {
      this.options
        .forEach((item, index) => this.options[index].modified = false);
    },
    async onSubmit() {
      this.isProcessing = true;
      const socialArray = this.options
        .filter(social => social.url !== '')
        .filter(social => social.error === null)
        .filter(social => social.modified)
        .map(social => ({name: social.name, url: social.url}));

      const socialToRemove = this.options
        .filter(social => social.url === '')
        .filter(social => social.modified)
        .map(social => social.name);

      try {
        if (socialArray.length) {
          const updatePayload = { id: this.store.id, socialArray: socialArray };
          await this.$store.dispatch('updateSocialMedia', updatePayload);
        }

        if (socialToRemove.length) {
          const deletePayload = { id: this.store.id, socialToRemove }
          await this.$store.dispatch('removeSocialMedia', deletePayload)
        }
      } catch(err) {
        console.error('Error: ', err);
      } finally {
        this.isProcessing = false;
      }
      this.reset();
      this.showDialog = false;
    },
    closeDialog() {
      this.reset();
      this.showDialog = false;
    }
  },
  computed: {
    availableOptions() {
      const activeLinks = Object.keys(this.store.social);
      return this.options.filter(item => {
        const index = activeLinks.findIndex(present => present === item);
        return index === -1;
      })
    },
  }
}
</script>