import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginPage from "@/components/pages/LoginPage.vue";

// Function untuk cek apakah user terautentikasi
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // true jika token ada dan bukan null/undefined
};

const routes = [
  {
    path: "/",
    name: "home",
    redirect: () => {
      return isAuthenticated() ? "/admin" : "/admin/login";
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: LoginPage,
    meta: {
      requiresGuest: true,
      layout: "login",
    },
  },
  {
    path: "/admin",
    name: "Dashboard",
    component: () => import("../components/pages/AdminDashboard.vue"),
    meta: {
      requiresAuth: true,
      layout: "admin",
    },
  },
  {
    path: "/admin/reports",
    name: "Reports",
    component: () => import("../components/pages/ReportsPage.vue"),
    meta: {
      requiresAuth: true,
      layout: "admin",
    },
  },
  {
    path: "/admin/analytics",
    name: "Analytics",
    component: () => import("../components/pages/AnalyticsPage.vue"),
    meta: {
      requiresAuth: true,
      layout: "admin",
    },
  },
  {
    path: "/admin/settings",
    name: "Settings",
    component: () => import("../components/pages/SettingsPage.vue"),
    meta: {
      requiresAuth: true,
      layout: "admin",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated();

  console.log("🔐 Navigating to:", to.path, "| Authenticated:", authenticated);

  if (to.meta.requiresAuth && !authenticated) {
    console.log("❌ Belum login, redirect ke login");
    return next({ path: "/admin/login", replace: true });
  }

  if (to.meta.requiresGuest && authenticated) {
    console.log("✅ Sudah login, redirect ke dashboard");
    return next({ path: "/admin", replace: true });
  }

  next();
});

export default router;
