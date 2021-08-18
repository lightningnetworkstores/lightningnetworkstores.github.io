export default {
  head() {
    const { capitalize } = this.$options.filters
    const customTitles = {
      siteName: 'Lightning Network Stores',
      fromTemplate: function (tag) {
        return `${capitalize(tag)} tag | Lightning Network Stores`
      },
      fromMapping: function (tag) {
        switch (tag.toLowerCase()) {
          case 'wallet':
            return `Wallets | ${this.siteName}`
          // case 'clothes':
          //   return `Clothes | ${siteNsme}`
          default:
            return this.fromTemplate(tag)
        }
      }
    }
    if (this.$route.query.tags) {
      const tags = this.$route.query.tags.split(',')
      if (tags.length === 1) {
        const tag = tags[0]
        return {
          title: customTitles.fromMapping(tag),
          meta: [
            {
              hid: 'og:title',
              property: 'og:title',
              content: customTitles.fromMapping(tag),
            },
            {
              hid: 'twitter:title',
              property: 'twitter:title',
              content: customTitles.fromMapping(tag),
            },
          ]
        }
      }
    }
  },
}