import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/printers',
      name: 'printers',
      // Ленивая загрузка (так принято во Vue)
      component: () => import('../views/PrintersView.vue')
    },
    {
      path: '/plastics',
      name: 'plastics',
      component: () => import('../views/PlasticsView.vue')
    },
    {
      path: '/models',
      name: 'models',
      component: () => import('../views/ModelsView.vue')
    }
  ]
})

export default router