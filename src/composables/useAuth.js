// composables/useAuth.js
import { ref, computed } from "vue";

const token = ref(localStorage.getItem("token") || null);
const userEmail = ref(localStorage.getItem("adminEmail") || "");

export function useAuth() {
  // Computed property untuk check status login
  const isLoggedIn = computed(() => !!token.value);

  // Function untuk login
  const login = (email, jwtToken) => {
    token.value = jwtToken;
    userEmail.value = email;
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("adminEmail", email);
  };

  // Function untuk logout
  const logout = () => {
    console.log("🔐 Logout dipanggil");
    token.value = null;
    userEmail.value = "";
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("rememberMe");

    window.location.href = "/admin/login";
  };

  // Function untuk check token
  const checkAuth = () => {
    const storedToken = localStorage.getItem("token");
    token.value = storedToken || null;
    userEmail.value = localStorage.getItem("adminEmail") || "";
    return !!token.value;
  };

  // Optional: Ambil token
  const getToken = () => token.value;

  return {
    isLoggedIn,
    userEmail,
    login,
    logout,
    checkAuth,
    getToken,
  };
}
