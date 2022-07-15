import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    component: () => import('@/views/Layout'),
    redirect: '/ ',
    children: [
      { path: '/ ', component: () => import('@/views/Home') },
      { path: '/video', component: () => import('@/views/Video') },
      { path: '/qa', component: () => import('@/views/QA') },
      { path: '/profile', component: () => import('@/views/My') }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
