<template>
  <v-chip
    class="mb-2"
    :color="getPillColor(reply.id)"
    text-color="white"
    small
    style="cursor: pointer"
  >
    <v-icon class="pr-4">mdi-comment</v-icon>
    {{ reply.id.slice(0, 8) }}
  </v-chip>
</template>
<script>
export default {
  props: {
    reply: {
      type: Object,
      required: true
    }
  },
  methods: {
    getPillColor(id) {
      const hex = Buffer.from(id, 'base64').toString('hex')
      return `#${hex.substring(0, 6)}`
    }
  }
}
</script>