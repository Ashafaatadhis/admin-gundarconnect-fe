<template>
  <div id="app">
    <!-- Sidebar - HANYA tampil untuk admin pages -->
    <div
      v-if="showSidebar"
      class="sidebar"
      :class="{ collapsed: sidebarCollapsed }"
    >
      <button class="toggle-btn" @click="toggleSidebar">
        {{ sidebarCollapsed ? "→" : "←" }}
      </button>

      <div class="logo-section">
        <div class="logo">{{ settings.platformName?.charAt(0) || "G" }}</div>
        <div class="logo-text" v-show="!sidebarCollapsed">
          {{ settings.platformName || "GundarConnect" }}
        </div>
      </div>

      <nav class="nav-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.id"
          :to="item.path"
          class="nav-item"
          @click="handleMenuClick(item)"
        >
          <div class="nav-icon">{{ item.icon }}</div>
          <div class="nav-text" v-show="!sidebarCollapsed">{{ item.text }}</div>
        </router-link>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div
      class="main-content"
      :class="{
        expanded: sidebarCollapsed && showSidebar,
        'no-sidebar': !showSidebar,
      }"
    >
      <!-- Router View - Tempat halaman akan ditampilkan -->
      <router-view />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import axios from "axios";

export default {
  name: "App",
  setup() {
    const route = useRoute();
    const { logout, checkAuth } = useAuth();
    const sidebarCollapsed = ref(false);
    const settings = reactive({
      platformName: "",
    });

    // Check apakah harus menampilkan sidebar
    const { isLoggedIn } = useAuth();

    const showSidebar = computed(() => {
      const isAdminRoute =
        route.path.startsWith("/admin") && route.path !== "/admin/login";
      return isLoggedIn.value && isAdminRoute;
    });

    const fetchPlatformSettings = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/platform-settings`
        );

        settings.platformName = data.name || "GundarConnect";
      } catch (error) {
        console.error("Gagal memuat platform settings", error);
        settings.platformName = "GundarConnect"; // fallback
      }
    };

    onMounted(async () => {
      await fetchPlatformSettings();
    });

    const menuItems = ref([
      {
        id: "dashboard",
        path: "/admin",
        icon: "📊",
        text: "Dashboard",
      },
      {
        id: "reports",
        path: "/admin/reports",
        icon: "🚨",
        text: "Reports",
      },
      {
        id: "analytics",
        path: "/admin/analytics",
        icon: "📈",
        text: "Analytics",
      },
      {
        id: "settings",
        path: "/admin/settings",
        icon: "⚙️",
        text: "Settings",
      },
      {
        id: "logout",
        path: "#",
        icon: "🚪",
        text: "Logout",
      },
    ]);

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    };

    const handleMenuClick = (item) => {
      if (item.id === "logout") {
        if (confirm("Yakin ingin logout?")) {
          console.log("Logout clicked");
          logout(); // Panggil fungsi logout dari composable
        }
        return false;
      }
    };

    // Watch route changes untuk debug
    watch(
      () => route.path,
      (newPath) => {
        console.log("Route changed to:", newPath);
        console.log(
          "localStorage isAuthenticated:",
          localStorage.getItem("isAuthenticated")
        );
        console.log("Show sidebar:", showSidebar.value);
      },
      { immediate: true }
    );

    return {
      sidebarCollapsed,
      menuItems,
      showSidebar,
      toggleSidebar,
      settings,
      handleMenuClick,
    };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #ffffff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  position: fixed;
  height: 100vh;
  transition: all 0.3s ease;
  z-index: 1000;
}

.sidebar.collapsed {
  width: 80px;
}

.toggle-btn {
  position: absolute;
  top: 20px;
  right: -15px;
  width: 30px;
  height: 30px;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  transform: scale(1.1);
}

.logo-section {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  color: white;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  transition: opacity 0.3s ease;
}

.nav-item {
  padding: 15px 10px;
  margin: 8px 0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  position: relative;
  text-decoration: none;
  color: inherit;
}

.nav-item:hover {
  background: rgba(79, 172, 254, 0.2);
  transform: translateX(5px);
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  width: calc(100vw - 260px);
  max-width: none;
}

.main-content.expanded {
  margin-left: 80px;
  width: calc(100vw - 80px);
}

/* No sidebar - untuk login page */
.main-content.no-sidebar {
  margin-left: 0;
  width: 100vw;
}

/* Router Link Active State */
.router-link-active {
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    transform: translateX(-100%);
  }

  .sidebar.collapsed {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    width: 100vw;
  }

  .main-content.expanded {
    margin-left: 0;
    width: 100vw;
  }

  .main-content.no-sidebar {
    margin-left: 0;
    width: 100vw;
  }
}
</style>
