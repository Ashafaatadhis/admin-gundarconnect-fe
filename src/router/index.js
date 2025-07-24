// router/index.js - Updated untuk struktur folder Anda
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '@/components/pages/LoginPage.vue'

// Function untuk check authentication status
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true'
}

const routes = [
  // Route untuk halaman publik
  {
    path: '/',
    name: 'home',
    redirect: () => {
      // Auto redirect berdasarkan auth status
      const authenticated = localStorage.getItem('isAuthenticated') === 'true'
      return authenticated ? '/admin' : '/admin/login'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  
  // Route untuk login admin - STANDALONE PAGE
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: LoginPage,
    meta: { 
      requiresGuest: true,
      layout: 'login' // Marker untuk login layout
    }
  },
  
  // Route untuk admin dashboard - dengan authentication guard
  {
    path: '/admin',
    name: 'Dashboard', 
    component: () => import('../components/pages/AdminDashboard.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'admin' // Marker untuk admin layout
    }
  },
  {
    path: '/admin/reports',
    name: 'Reports',
    component: () => import('../components/pages/ReportsPage.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'admin'
    }
  },
  {
    path: '/admin/analytics',
    name: 'Analytics', 
    component: () => import('../components/pages/AnalyticsPage.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'admin'
    }
  },
  {
    path: '/admin/settings',
    name: 'Settings',
    component: () => import('../components/pages/SettingsPage.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'admin'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  // Selalu check localStorage fresh setiap navigation
  const authenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  console.log('Navigation to:', to.path, 'Authenticated:', authenticated)
  
  // Jika halaman admin butuh authentication dan user belum login
  if (to.meta.requiresAuth && !authenticated) {
    console.log('Redirecting to login - not authenticated')
    return next({ path: '/admin/login', replace: true })
  }
  
  // Jika user sudah login dan mencoba akses login page
  if (to.meta.requiresGuest && authenticated) {
    console.log('Redirecting to admin - already authenticated')
    return next({ path: '/admin', replace: true })
  }
  
  next()
})

export default router