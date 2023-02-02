export default function ({ $axios }) {
  $axios.onRequest(config => {
    config.headers['Original-Host'] = 'nostrich.fun'
    return config
  })
}