<template>
  <div class="dashboard-page">
    <!-- Header -->
    <div class="header">
      <div class="welcome-text">
        <h1>Dashboard Admin</h1>
        <p>Selamat datang kembali, {{ adminName }}!</p>
      </div>
      <div class="user-info">
        <div class="user-avatar">{{ adminName.charAt(0) }}</div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div
        v-for="stat in stats"
        :key="stat.id"
        class="stat-card"
        :class="stat.trend"
      >
        <div class="stat-header">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-trend">{{ stat.change }}</div>
        </div>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="activity-section">
      <h3>Recent Activity</h3>
      <div class="activity-list">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-avatar">{{ activity.user.charAt(0) }}</div>

          <div class="activity-content">
            <div class="activity-text">{{ activity.text }}</div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
          <div class="activity-type" :class="activity.type">
            {{ activity.typeLabel }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default {
  name: "AdminDashboard",
  setup() {
    const { userEmail, getToken } = useAuth();
    const adminName = ref("Admin");
    const stats = ref([]);
    const recentActivities = ref([]);

    // Format data dari API summary ke bentuk card
    const mapSummaryToStats = (summary) => [
      {
        id: 1,
        icon: "👤",
        value: summary.totalUsers.toLocaleString(),
        label: "Total Users",
        change: `${summary.usersGrowth >= 0 ? "+" : ""}${summary.usersGrowth}%`,
        trend: summary.usersGrowth >= 0 ? "up" : "down",
      },
      {
        id: 2,
        icon: "📱",
        value: summary.totalPosts.toLocaleString(),
        label: "Total Posts",
        change: `${summary.postsGrowth >= 0 ? "+" : ""}${summary.postsGrowth}%`,
        trend: summary.postsGrowth >= 0 ? "up" : "down",
      },
      {
        id: 3,
        icon: "💬",
        value: summary.totalComments.toLocaleString(),
        label: "Comments",
        change: `${summary.commentsGrowth >= 0 ? "+" : ""}${
          summary.commentsGrowth
        }%`,
        trend: summary.commentsGrowth >= 0 ? "up" : "down",
      },
      {
        id: 4,
        icon: "🚨",
        value: summary.totalReports.toLocaleString(),
        label: "Reports",
        change: `${summary.reportsGrowth >= 0 ? "+" : ""}${
          summary.reportsGrowth
        }%`,
        trend: summary.reportsGrowth >= 0 ? "up" : "down",
      },
    ];

    // Format recent data (gabung post, comment, user)
    const mapRecentToActivityList = (data) => {
      const activities = [];

      data.recentPosts.forEach((post, idx) => {
        activities.push({
          id: `p-${idx}`,
          user: post.author?.fullName || "Unknown",
          text: "Posted a new update",
          time: new Date(post.createdAt).toLocaleString(),
          type: "post",
          typeLabel: "Post",
        });
      });

      data.recentComments.forEach((comment, idx) => {
        activities.push({
          id: `c-${idx}`,
          user: comment.author?.fullName || "Unknown",
          text: "Commented on a post",
          time: new Date(comment.createdAt).toLocaleString(),
          type: "comment",
          typeLabel: "Comment",
        });
      });

      data.recentUsers.forEach((user, idx) => {
        activities.push({
          id: `u-${idx}`,
          user: user.fullName || "New User",
          text: "Created a new account",
          time: new Date(user.createdAt).toLocaleString(),
          type: "user",
          typeLabel: "User",
        });
      });

      return activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    };

    onMounted(async () => {
      // Tentukan nama admin dari email
      const email = userEmail.value || localStorage.getItem("adminEmail");
      if (email) adminName.value = email.split("@")[0];

      try {
        const token = getToken();

        const [summaryRes, activityRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/admin/dashboard/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/admin/dashboard/recent-activities`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        console.log(activityRes, "TA");
        stats.value = mapSummaryToStats(summaryRes.data);
        recentActivities.value = mapRecentToActivityList(activityRes.data);
      } catch (error) {
        console.error("❌ Failed to fetch dashboard data:", error);
      }
    });

    return {
      adminName,
      stats,
      recentActivities,
    };
  },
};
</script>

<style scoped>
.dashboard-page {
  padding: 30px;
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  background: #1a1d29;
  color: #ffffff;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 25px 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.welcome-text h1 {
  font-size: 24px;
  margin-bottom: 5px;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-text p {
  opacity: 0.7;
  font-size: 16px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
  width: 100%;
  box-sizing: border-box;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.08);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.stat-icon {
  font-size: 24px;
  width: 50px;
  height: 50px;
  background: rgba(79, 172, 254, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-trend {
  font-size: 14px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 20px;
}

.stat-card.up .stat-trend {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
}

.stat-card.down .stat-trend {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 16px;
  opacity: 0.7;
}

/* Activity Section */
.activity-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.activity-section h3 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #ffffff;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.activity-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  margin-bottom: 2px;
}

.activity-time {
  font-size: 12px;
  opacity: 0.6;
}

.activity-type {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.activity-type.post {
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
}

.activity-type.report {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

.activity-type.user {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
}

.activity-type.comment {
  background: rgba(255, 184, 0, 0.2);
  color: #ffb800;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .dashboard-page {
    padding: 20px;
  }

  .header {
    padding: 20px;
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .stat-card {
    padding: 20px;
  }

  .activity-section {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .dashboard-page {
    padding: 15px;
  }

  .header {
    padding: 15px;
  }

  .stat-card {
    padding: 15px;
  }

  .activity-section {
    padding: 15px;
  }

  .stats-grid {
    gap: 15px;
  }
}
</style>
