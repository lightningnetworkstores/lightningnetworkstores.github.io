export default function ({ $axios }) {
  $axios.onRequest(config => {
    config.headers['Original-Host'] = 'bitcoinyellow.page'
    return config
  })
}