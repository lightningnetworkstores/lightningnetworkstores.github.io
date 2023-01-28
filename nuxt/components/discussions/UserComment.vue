<template>
  <div
    ref="reply"
    class="py-0 px-0 text-body-1 discussion-text"
    :inner-html.prop="content | toHtml | tagUser"
  >
  </div>
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      required: true
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
<style>
.discussion-text {
  overflow-wrap: break-word;
  word-break: break-word;
}
</style>