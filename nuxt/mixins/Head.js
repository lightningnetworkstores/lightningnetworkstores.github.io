export default {
  methods: {
    getMetadata(title, description, ogimage) {
      return {
        title: title,
        meta: [
          {
            charset: 'utf-8',
          },
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
          },
          {
            hid: 'description',
            name: 'description',
            content: description,
          },
          {
            hid: 'og:site_name',
            property: 'og:site_name',
            content: 'LightningNetworkStores.com',
          },
          {
            hid: 'og:title',
            property: 'og:title',
            content: title,
          },
          {
            hid: 'og:description',
            property: 'og:description',
            content: description,
          },
          {
            hid: 'image',
            property: 'image',
            content: ogimage,
          },
          {
            hid: 'og:image',
            property: 'og:image',
            content: ogimage,
          },
          {
            hid: 'twitter:title',
            property: 'twitter:title',
            content: title,
          },
          {
            hid: 'twitter:description',
            property: 'twitter:description',
            content: description,
          },
          {
            hid: 'twitter:image',
            property: 'twitter:image',
            content: ogimage,
          },
        ]
      }
    }
  }
}