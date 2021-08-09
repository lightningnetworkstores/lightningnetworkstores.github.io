export default async function checkDiscussionNotificationShowed({
  app: { router },
  store,
}) {
  router.afterEach(async (to, from) => {
    await store.dispatch('getLastDiscussionTimestamp')
  })
}
