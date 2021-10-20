export default async function ({ $axios, store }) {
  try {
    const response = await $axios.get('http://localhost:3000/api/twitter/user')
    store.dispatch('updateUser', response.data)
  } catch (error) {
    console.error({ error })
    store.dispatch('updateUser', null)
  }
}
