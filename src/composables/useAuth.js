// composables/useAuth.js
import { ref, computed } from 'vue'

const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
const userEmail = ref(localStorage.getItem('adminEmail') || '')

export function useAuth() {
  // Computed property untuk check status login
  const isLoggedIn = computed(() => isAuthenticated.value)
  
  // Function untuk login
  const login = (email) => {
    isAuthenticated.value = true
    userEmail.value = email
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('adminEmail', email)
  }

  // Function untuk logout
  const logout = () => {
    console.log('Logout function called') // Debug log
    isAuthenticated.value = false
    userEmail.value = ''
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('adminEmail')
    localStorage.removeItem('rememberMe')
    
    // Force redirect to login
    window.location.href = '/admin/login'
  }

  // Function untuk check authentication
  const checkAuth = () => {
    const stored = localStorage.getItem('isAuthenticated')
    isAuthenticated.value = stored === 'true'
    if (isAuthenticated.value) {
      userEmail.value = localStorage.getItem('adminEmail') || ''
    }
    return isAuthenticated.value
  }

  return {
    isLoggedIn,
    userEmail,
    login,
    logout,
    checkAuth
  }
}