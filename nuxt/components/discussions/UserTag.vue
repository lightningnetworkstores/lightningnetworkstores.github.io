<template>
  <v-chip small :color="color" text-color="white" class="mx-0 pl-0 pr-2">
    <v-avatar v-if="hasProfilePicture" class="mx-0">
      <v-img :src="user.image" max-height="10" max-width="10" class="mx-0 px-0"></v-img>
    </v-avatar>
    <v-icon v-else class="ml-3 pr-3" color="white">mdi-account-circle</v-icon>
    {{ username }}
  </v-chip>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default: null
    },
    userId: {
      type: String,
      required: true
    }
  },
  methods: {
    hslToHex(h, s, l) {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    },
    hashCode(s) {
      return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
    }
  },
  computed: {
    color() {
      const hash = this.hashCode(this.userId)
      const hue = Math.abs(hash % 360)
      return this.hslToHex(hue, 70, 50)
    },
    hasProfilePicture() {
      return this.user && this.user.image
    },
    username() {
      return (this.user && this.user.name) ? this.user.name : this.userId
    }
  }
}
</script>