<template>
  <div
    ref="reply"
    class="py-3 text-body-1"
    :inner-html.prop="reply | toHtml | tagUser"
  >
  </div>  
</template>
<script>
export default {
  props: {
    reply: {
      type: String,
      default: ''
    }
  },
  mounted() {
    const comment = this.$refs.reply.querySelector('.user-tag')

    if (comment) {
      comment.addEventListener('mouseover', () => {
        this.$emit('hover-on', comment.textContent)
      })
      comment.addEventListener('mouseout', () => {
        this.$emit('hover-off', comment.textContent)
      })
    }
  }
}
</script>