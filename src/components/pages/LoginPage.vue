<template>
  <div class="login-only-container">
    <div class="login-box">
      <!-- Header -->
      <div class="login-header">
        <div class="logo-section">
          <div class="logo-icon">
            {{ settings.general.platformName?.charAt(0) || "G" }}
          </div>
          <h1 class="app-name">
            {{ settings.general.platformName || "GundarConnect" }}
          </h1>
        </div>
        <p class="welcome-text">Welcome back, Admin!</p>
        <p class="subtitle">Please sign in to access your dashboard</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <div class="input-wrapper">
            <svg
              class="input-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              type="email"
              id="email"
              v-model="loginForm.email"
              class="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="input-wrapper">
            <svg
              class="input-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <circle cx="12" cy="16" r="1" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="loginForm.password"
              class="form-input"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              @click="togglePassword"
              class="password-toggle"
            >
              <svg
                v-if="showPassword"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="loginForm.rememberMe" />
            <span class="checkmark"></span>
            Remember me
          </label>
        </div>

        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="!isLoading">Sign In</span>
          <div v-else class="loading-spinner">
            <svg class="spinner" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-dasharray="31.416"
                stroke-dashoffset="31.416"
              >
                <animate
                  attributeName="stroke-dasharray"
                  dur="2s"
                  values="0 31.416;15.708 15.708;0 31.416"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-dashoffset"
                  dur="2s"
                  values="0;-15.708;-31.416"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            Signing in...
          </div>
        </button>
      </form>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        {{ errorMessage }}
      </div>
    </div>

    <!-- Background Animation -->
    <div class="bg-animation">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";

export default {
  name: "LoginPage",
  emits: ["login-success"],
  setup(props, { emit }) {
    const loginForm = reactive({
      email: "",
      password: "",
      rememberMe: false,
    });
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const showPassword = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref("");

    const settings = reactive({
      general: {
        platformName: "",
      },
    });

    const loadSettings = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/platform-settings`
        );
        settings.general.platformName = data.name;
      } catch (err) {
        console.error("Gagal load pengaturan platform", err);
      }
    };

    onMounted(async () => {
      await loadSettings();
    });

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const handleLogin = async () => {
      isLoading.value = true;
      errorMessage.value = "";

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/auth/login`,
          {
            username: loginForm.email, // atau loginForm.username kalau kamu pakai itu
            password: loginForm.password,
          }
        );

        const { token, user } = response.data;
        console.log(response.data, "TAIK");
        localStorage.setItem("token", token);

        localStorage.setItem("adminEmail", user.username);
        localStorage.setItem("role", user.role);

        if (loginForm.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        emit("login-success");
        window.location.href = "/admin";
      } catch (error) {
        console.log(error, "TAII");
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage.value = error.response.data.message;
        } else {
          errorMessage.value = "Login failed. Please try again.";
        }
      } finally {
        isLoading.value = false;
      }
    };

    return {
      loginForm,
      showPassword,
      isLoading,
      errorMessage,
      togglePassword,
      settings,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.login-only-container {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  min-height: 100vh !important;
  background: linear-gradient(135deg, #1a1d29 0%, #2d3748 100%) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 20px !important;
  overflow: hidden !important;
  z-index: 99999 !important;
  margin: 0 !important;
}

.login-box {
  background: rgba(45, 55, 72, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(56, 178, 172, 0.2);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 10;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #38b2ac, #4fd1c7);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  box-shadow: 0 8px 25px rgba(56, 178, 172, 0.3);
}

.app-name {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  background: linear-gradient(135deg, #38b2ac, #4fd1c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-text {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #a0aec0;
  margin: 0;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: #e2e8f0;
  font-weight: 500;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: #718096;
  z-index: 2;
}

.form-input {
  width: 100%;
  padding: 16px 16px 16px 50px;
  background: rgba(26, 32, 44, 0.8);
  border: 2px solid rgba(113, 128, 150, 0.3);
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #718096;
}

.form-input:focus {
  outline: none;
  border-color: #38b2ac;
  box-shadow: 0 0 0 3px rgba(56, 178, 172, 0.1);
  background: rgba(26, 32, 44, 0.95);
}

.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #38b2ac;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.form-options {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 8px;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #e2e8f0;
  font-size: 14px;
  gap: 8px;
}

.remember-me input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #718096;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.remember-me input[type="checkbox"]:checked + .checkmark {
  background: #38b2ac;
  border-color: #38b2ac;
}

.remember-me input[type="checkbox"]:checked + .checkmark::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.login-button {
  background: linear-gradient(135deg, #38b2ac, #4fd1c7);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(56, 178, 172, 0.3);
  margin-top: 8px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(56, 178, 172, 0.4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 20px;
  height: 20px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fc8181;
  background: rgba(254, 178, 178, 0.1);
  border: 1px solid rgba(254, 178, 178, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  margin-top: 16px;
}

.error-message svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Background Animation */
.bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  background: linear-gradient(
    135deg,
    rgba(56, 178, 172, 0.1),
    rgba(79, 209, 197, 0.1)
  );
  border-radius: 50%;
  animation: float 20s infinite linear;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: -100px;
  animation-delay: -10s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: 50%;
  animation-delay: -5s;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
  100% {
    transform: translateY(0px) rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-container {
    padding: 16px;
  }

  .login-box {
    padding: 30px 24px;
  }

  .app-name {
    font-size: 24px;
  }

  .welcome-text {
    font-size: 18px;
  }

  .form-input {
    padding: 14px 14px 14px 46px;
    font-size: 15px;
  }

  .login-button {
    padding: 14px 20px;
    font-size: 15px;
  }
}
</style>
