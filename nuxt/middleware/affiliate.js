export default function ({ route, $axios }) {
  const regex = new RegExp('af\/[a-zA-Z0-9]+');
  if (route.query.af) {
    $axios.post(`/api/affiliatereferral?af=${route.query.af}`)
      .then(res => { })
      .catch(err => {
        console.error('Error while reporting affiliate code. err: ', err)
      })
  } else if (regex.test(route.path)) {
    const pathComponents = route.path.split('/')
    const affiliateCode = pathComponents[pathComponents.length - 1]
    $axios.post('/api/affiliatereferral?af=' + affiliateCode)
      .then(res => { })
      .catch(err => {
        console.error('Error while reporting affiliate code. err: ', err)
      })
  }
}