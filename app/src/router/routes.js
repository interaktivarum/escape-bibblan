
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'instruktioner', name: 'Instructions', component: () => import('src/pages/PageInstructions.vue') },
      { path: 'om', name: 'About', component: () => import('src/pages/PageAbout.vue') },
      { path: 'avsluta', name: 'GroupDisconnect', component: () => import('src/pages/PageDisconnect.vue') }
    ]
  },
  {
    path: '/starta/:idGroup?/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'GroupCreate', component: () => import('src/pages/PageJoin.vue') }
    ]
  },
  {
    path: '/spela/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'GroupPlay', component: () => import('src/pages/PageAdventure.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
