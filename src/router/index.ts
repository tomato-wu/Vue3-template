import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { start, done } from 'nprogress'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home/index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../components/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  start()
  next()
})

router.afterEach(() => {
  setTimeout(() => {
    done()
  }, 300)
})

export default router
