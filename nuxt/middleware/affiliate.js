export default function ({ route, $axios }) {
  if (route.query.af) {
    $axios.post(`/api/affiliatereferral?af=${route.query.af}`)
      .then(res => { })
      .catch(err => {
        console.error('Error while reporting affiliate code. err: ', err)
      })
  }
}