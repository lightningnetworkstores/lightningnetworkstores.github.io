import { format } from 'timeago.js'

export default {
  methods: {
    formatDate(timestamp) {
      return format(timestamp)
    }
  }
}