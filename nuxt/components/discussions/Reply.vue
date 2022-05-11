<template>
  <UserComment
    :content="reply"
    @hover-on="u => $emit('hover-on', u)"
    @hover-off="u => $emit('hover-off', u)"
  />
</template>
<script>
import UserComment from '~/components/discussions/UserComment'
export default {
  components: { UserComment },
  props: {
    reply: {
      type: String,
      default: ''
    }
  }
}
</script>