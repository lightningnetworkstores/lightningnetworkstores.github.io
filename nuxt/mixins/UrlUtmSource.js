import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['baseURL']),
  },
  methods: {
    getUtmSourceLink(link) {
      const url = new URL(link)
      const baseUrl = new URL(this.baseURL)
      url.searchParams.append('utm_source', baseUrl.host)
      return url.toString()
    },
  },
}
