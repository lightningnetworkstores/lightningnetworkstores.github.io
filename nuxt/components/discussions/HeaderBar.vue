<template>
  <div
    class="header-container text-caption d-flex justify-space-between align-center my-3 mx-0 mx-md-4 px-2 tags-style"
  >
    <div class="bar-column">
      <UserTag
        :user="user"
        :userId="user.id"
      />
    </div>
    <div class="d-flex justify-center bar-column">
      {{ formatDate(timestamp) }}</div>
    <div v-if="displayDetailLink" class="d-flex justify-end bar-column">
      <a :href="`/discuss/${threadId}`" class="open-thread-btn" target="_blank" rel="noopener noreferrer">
        <v-icon>mdi-open-in-new</v-icon>
      </a>
    </div>
  </div>
</template>
<script>
import UserTag from './UserTag.vue'
import DateFromatter from '~/mixins/DateFormatter'
export default {
  components: {
    UserTag
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    timestamp: {
      type: Number,
      required: true
    },
    displayDetailLink: {
      type: Boolean,
      default: true
    },
    threadId: {
      type: String,
      required: true
    }
  },
  mixins: [ DateFromatter ]
}
</script>
<style scoped>
.header-container {
  border-radius: 30px;
}
.tags-style {
  height: 36px;
  background-color: #f9f9f9; 
  z-index: 2;
}
.open-thread-btn {
  text-decoration: none;
}

.bar-column {
  width: 33.33%;
}
</style>