export default function ({ $axios }) {
  $axios.onRequest(config => {
    config.headers['Original-Host'] = 'lightningnetworkstores.com'
    return config
  })
}