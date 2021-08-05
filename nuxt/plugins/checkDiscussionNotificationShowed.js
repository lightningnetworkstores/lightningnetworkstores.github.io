export default async function checkDiscussionNotificationShowed({
  app: { router },
  store,
}) {
  router.afterEach(async (to, from) => {
    await store.dispatch('getDiscussions')
    await store.dispatch('getLastDiscussionTimestamp')

    const activeDiscussions = store.state.activeStoreDiscussions.flatMap(
      (store) => store.discussions
    )

    const lastDiscussions = store.state.lastDiscussions.flat()

    const [lastDiscussion] = [...activeDiscussions, ...lastDiscussions].sort(
      (discussion1, discussion2) =>
        discussion2.timestamp - discussion1.timestamp
    )

    store.dispatch('updateLastDiscussionTimeServer', lastDiscussion.timestamp)
  })
}
