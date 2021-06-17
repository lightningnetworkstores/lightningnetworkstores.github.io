<template>
  <div>
    <v-btn icon @click.stop="showDialog = true">
      <v-icon>fa-edit</v-icon>
    </v-btn>
    <v-dialog v-model="showDialog" max-width="500" persistent>
      <v-card>
        <v-card-title>Edit Social Media</v-card-title>
        <v-layout :key="index" v-for="(social, index) in options" row class="ml-3 mr-4 mt-0 d-flex">
          <v-text-field
            outlined
            v-model="options[index].url"
            :label="social.name"
          >
          <template v-slot:prepend-inner>
            <v-icon :color="$getSocialMediaColor(social.name)"> {{ social.icon }} </v-icon>
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
            @click="showDialog = false"
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
export default {
  props: ['store'],
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
          icon: 'fab fa-reddit',
          url: getUrl('reddit'),
          error: null
        },
        {
          name: 'twitter',
          icon: 'fab fa-twitter',
          url: getUrl('twitter'),
          error: null
        },
        {
          name: 'telegram',
          icon: 'fab fa-telegram',
          url: getUrl('telegram'),
          error: null
        },
        {
          name: 'facebook',
          icon: 'fab fa-facebook',
          url: getUrl('facebook'),
          error: null
        },
        {
          name: 'instagram',
          icon: 'fab fa-instagram',
          url: getUrl('instagram'),
          error: null
        },
        {
          name: 'linkedin',
          icon: 'fab fa-linkedin',
          url: getUrl('linkedin'),
          error: null
        }
      ],
      isProcessing: false,
      formError: null
    }
  },
  methods: {
    handleValueChange(value) {
      console.log('handleValueChange.value: ', value);
      const index = this.options.findIndex(item => item === this.selected);
      if (index !== -1) {
        this.values[index] = value;
      }
    },
    async onSubmit() {
      this.isProcessing = true;
      const socialArray = this.options
        .filter(social => social.url !== '')
        .filter(social => social.error === null)
        .map(social => ({name: social.name, url: social.url}))
      const payload = {
        id: this.store.id,
        socialArray: socialArray
      };
      try {
        await this.$store.dispatch('updateSocialMedia', payload);
        const socialToRemove = this.options
          .filter(social => social.url === '')
          .map(social => social.name);
        await this.$store.dispatch('removeSocialMedia', {id: this.store.id, socialToRemove})
      } catch(err) {
        console.error('Error: ', err);
      } finally {
        this.isProcessing = false;
      }
      this.showDialog = false;
    }
  },
  computed: {
    availableOptions() {
      console.log('availableOptions');
      const activeLinks = Object.keys(this.store.social);
      return this.options.filter(item => {
        const index = activeLinks.findIndex(present => present === item);
        return index === -1;
      })
    },
    selectedValue: {
        get() {
          const index = this.options.findIndex(item => item === this.selected);
          console.log('selectedValue.get. index: ', index);
          if (index !== -1) {
            if (this.values[index]) {
              console.log('returning: ', this.values[index]);
            } else {
              console.log('null value detected, returning empty string');
              return '';
            }
          }
          return '';
        },
        set(val) {
          console.log('selectedValue.set.val: ', val);
          const index = this.options.findIndex(item => item === this.selected);
          this.values[index] = val;
        }
    }
  }
}
</script>