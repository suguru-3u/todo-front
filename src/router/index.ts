import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }, // ログイン画面は認証不要
    },
    {
      path: '/todo',
      name: 'todo',
      component: () => import('../views/TodoView.vue'),
      meta: { requiresAuth: true }, // TODO画面は認証が必要
    },
    { path: '/', redirect: '/todo' },
  ],
})

// ナビゲーションガード
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // 1. 未認証の場合、まずサーバーにセッションが生きているか確認する
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth()
  }

  // 2. 認証が必要なページ（/todoなど）へ未ログインでアクセスした場合
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  // 3. ログイン済み（isAuthenticated: true）なのにログイン画面（/login）へアクセスした場合
  if (to.name === 'login' && authStore.isAuthenticated) {
    // 強制的にTODOリストへリダイレクト
    return { name: 'todo' }
  }
})

export default router
