<template>
  <v-chip small :color="color" text-color="white">
    <v-icon class="pr-3" color="white">mdi-account-circle</v-icon>
    {{ userId }}
  </v-chip>
</template>
<script>
export default {
  props: {
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
    }
  }
}
</script>