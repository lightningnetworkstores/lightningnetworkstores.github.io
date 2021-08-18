export default [
  {
    name: 'services',
    path: '/services',
    redirect: '/',
  },
  {
    name: 'e',
    path: '/e/:id',
    beforeEnter: (to, from, next) => {
      return next({ path: `/store/${to.params.id}` })
    },
  },
  {
    name: 'tag',
    path: '/tag/:tag',
    beforeEnter: (to, from, next) => {
      return next({ path: `/?tags=${to.params.tag}` })
    },
  },
]
