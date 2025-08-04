<template>
  <div class="analytics-page">
    <!-- Header -->
    <div class="page-header">
      <h1>Analytics Dashboard</h1>
      <p>
        Analisis komprehensif aktivitas komunitas mahasiswa Universitas
        Gunadarma
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
              stroke="currentColor"
              stroke-width="2"
            />
            <circle
              cx="9"
              cy="7"
              r="4"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ formatNumber(totalStudents) }}</h3>
          <p>Total Mahasiswa Terdaftar</p>
          <span class="stat-change positive"
            >+{{ studentsGrowth }}% bulan ini</span
          >
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ formatNumber(totalPosts) }}</h3>
          <p>Total Postingan</p>
          <span class="stat-change positive"
            >+{{ postsGrowth }}% minggu ini</span
          >
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ formatNumber(totalInteractions) }}</h3>
          <p>Total Interaksi</p>
          <span class="stat-change positive"
            >+{{ interactionsGrowth }}% hari ini</span
          >
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ avgEngagementRate }}%</h3>
          <p>Tingkat Engagement</p>
          <span class="stat-change positive"
            >+{{ engagementGrowth }}% dari target</span
          >
        </div>
      </div>
    </div>

    <!-- Enhanced Activity Chart -->
    <div class="charts-section">
      <div class="chart-card full-width">
        <div class="chart-header">
          <h3>Aktivitas Platform - {{ getMetricLabel(selectedMetric) }}</h3>
          <div class="chart-controls">
            <select
              v-model="selectedMetric"
              @change="fetchAnalytics"
              class="period-select"
            >
              <option value="posts">Postingan</option>
              <option value="comments">Komentar</option>
              <option value="users">Pengguna Baru</option>
              <option value="likes">Total Likes</option>
            </select>
            <select
              v-model="selectedPeriod"
              @change="fetchAnalytics"
              class="period-select"
            >
              <option value="7d">7 Hari</option>
              <option value="30d">30 Hari</option>
              <option value="90d">90 Hari</option>
              <option value="1y">1 Tahun</option>
            </select>
          </div>
        </div>

        <!-- Dynamic SVG Chart -->
        <div class="chart-placeholder">
          <svg
            width="100%"
            height="300"
            viewBox="0 0 900 300"
            v-if="chartData.length > 0"
          >
            <defs>
              <linearGradient
                id="activityGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  :style="`stop-color: ${getMetricColor(
                    selectedMetric
                  )}; stop-opacity: 0.3`"
                />
                <stop
                  offset="100%"
                  :style="`stop-color: ${getMetricColor(
                    selectedMetric
                  )}; stop-opacity: 0`"
                />
              </linearGradient>
            </defs>

            <!-- Grid lines -->
            <g class="grid">
              <line
                v-for="i in 5"
                :key="`grid-y-${i}`"
                x1="60"
                x2="840"
                :y1="50 + (i - 1) * 40"
                :y2="50 + (i - 1) * 40"
                stroke="rgba(255,255,255,0.1)"
                stroke-width="1"
              />
              <line
                v-for="(point, index) in getChartPoints()"
                :key="`grid-x-${index}`"
                :x1="point.x"
                :x2="point.x"
                y1="50"
                y2="210"
                stroke="rgba(255,255,255,0.05)"
                stroke-width="1"
              />
            </g>

            <!-- Fill area under the line -->
            <path :d="generateFillPath()" fill="url(#activityGradient)" />

            <!-- Main line -->
            <path
              :d="generateChartPath()"
              :stroke="getMetricColor(selectedMetric)"
              stroke-width="3"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Data points -->
            <circle
              v-for="(point, index) in getChartPoints()"
              :key="`point-${index}`"
              :cx="point.x"
              :cy="point.y"
              r="5"
              :fill="getMetricColor(selectedMetric)"
              stroke="#ffffff"
              stroke-width="2"
              class="chart-point"
              @mouseover="showTooltip(point, $event)"
              @mouseout="hideTooltip"
            />

            <!-- X-axis labels -->
            <text
              v-for="(item, index) in chartData"
              :key="`label-x-${index}`"
              :x="60 + index * (780 / Math.max(1, chartData.length - 1))"
              y="235"
              text-anchor="middle"
              fill="#8892b0"
              font-size="11"
              :transform="
                chartData.length > 10
                  ? `rotate(-45 ${
                      60 + index * (780 / Math.max(1, chartData.length - 1))
                    } 235)`
                  : ''
              "
            >
              {{ item.label }}
            </text>

            <!-- Y-axis labels -->
            <text
              v-for="(value, index) in getYAxisLabels()"
              :key="`label-y-${index}`"
              x="45"
              :y="215 - index * 40"
              text-anchor="end"
              fill="#8892b0"
              font-size="11"
            >
              {{ formatNumber(value) }}
            </text>

            <!-- Chart title -->
            <text
              x="450"
              y="25"
              text-anchor="middle"
              fill="#ffffff"
              font-size="14"
              font-weight="bold"
            >
              {{ getPeriodLabel(selectedPeriod) }}
            </text>
          </svg>

          <!-- Loading state -->
          <div v-else class="no-data-placeholder">
            <div class="loading-spinner"></div>
            <p>Memuat data grafik...</p>
          </div>
        </div>

        <!-- Tooltip -->
        <div
          v-if="tooltip.visible"
          class="chart-tooltip"
          :style="tooltip.style"
        >
          <strong>{{ tooltip.label }}</strong
          ><br />
          {{ getMetricLabel(selectedMetric) }}:
          {{ formatNumber(tooltip.value) }}
        </div>
      </div>
    </div>

    <!-- Analytics Grid -->
    <div class="analytics-grid">
      <div class="analytics-card">
        <h3>Konten Trending</h3>
        <div class="trending-content">
          <div
            class="trending-item"
            v-for="content in trendingContent"
            :key="content.id"
          >
            <div class="trending-rank">{{ content.rank }}</div>
            <div class="trending-info">
              <span class="trending-title">{{ content.title }}</span>
              <div class="trending-meta">
                <span class="trending-engagement"
                  >{{ content.likes }} likes</span
                >
                <span class="trending-comments"
                  >{{ content.comments }} comments</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="analytics-card">
        <h3>Waktu Aktif Pengguna (24 Jam)</h3>
        <div class="time-activity">
          <div class="time-chart">
            <div
              class="time-bar"
              v-for="hour in hourlyActivity"
              :key="hour.time"
            >
              <div class="time-label">{{ hour.time }}</div>
              <div
                class="time-value"
                :style="{
                  height:
                    Math.max(
                      5,
                      (hour.activity / getMaxHourlyActivity()) * 100
                    ) + '%',
                  backgroundColor: getActivityColor(hour.activity),
                }"
                :title="`${hour.time}:00 - ${hour.activity} aktivitas`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="analytics-card">
        <h3>Top Contributors</h3>
        <div class="contributors-list">
          <div
            class="contributor-item"
            v-for="contributor in topContributors"
            :key="contributor.id"
          >
            <div class="contributor-avatar">
              {{ contributor.name.charAt(0) }}
            </div>
            <div class="contributor-info">
              <span class="contributor-name">{{ contributor.name }}</span>
              <span class="contributor-faculty">Mahasiswa</span>
            </div>
            <div class="contributor-stats">
              <span class="contributor-posts"
                >{{ contributor.posts }} posts</span
              >
              <span class="contributor-points"
                >{{ contributor.points }} pts</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useAuth } from "@/composables/useAuth";

export default {
  name: "AnalyticsPage",
  setup() {
    const { getToken } = useAuth();
    const selectedPeriod = ref("30d");
    const selectedMetric = ref("posts");

    // Reactive data
    const totalStudents = ref(0);
    const studentsGrowth = ref(0);
    const totalPosts = ref(0);
    const postsGrowth = ref(0);
    const totalInteractions = ref(0);
    const interactionsGrowth = ref(0);
    const avgEngagementRate = ref(0);
    const engagementGrowth = ref(0);

    const trendingContent = ref([]);
    const hourlyActivity = ref([]);
    const topContributors = ref([]);
    const chartData = ref([]);
    const chartMeta = ref({});
    const isChartLoading = ref(true);

    // Tooltip
    const tooltip = reactive({
      visible: false,
      x: 0,
      y: 0,
      label: "",
      value: 0,
      style: {},
    });

    // Utility functions
    const formatNumber = (num) => {
      return new Intl.NumberFormat("id-ID").format(num);
    };

    const getActivityColor = (activity) => {
      if (activity >= 80) return "#00d4ff";
      if (activity >= 60) return "#4ecdc4";
      if (activity >= 40) return "#ffe66d";
      if (activity >= 20) return "#ff6b6b";
      return "#8892b0";
    };

    const getMetricColor = (metric) => {
      const colors = {
        posts: "#00d4ff",
        comments: "#4ecdc4",
        users: "#ffe66d",
        likes: "#ff6b6b",
      };
      return colors[metric] || "#00d4ff";
    };

    const getMetricLabel = (metric) => {
      const labels = {
        posts: "Postingan",
        comments: "Komentar",
        users: "Pengguna Baru",
        likes: "Total Likes",
      };
      return labels[metric] || "Data";
    };

    const getPeriodLabel = (period) => {
      const labels = {
        "7d": "7 Hari Terakhir",
        "30d": "30 Hari Terakhir",
        "90d": "90 Hari Terakhir",
        "1y": "1 Tahun Terakhir",
      };
      return labels[period] || "Periode";
    };

    const getMaxHourlyActivity = () => {
      return Math.max(...hourlyActivity.value.map((h) => h.activity), 1);
    };

    // Chart functions
    const getChartPoints = () => {
      if (chartData.value.length === 0) return [];

      const maxValue = Math.max(...chartData.value.map((d) => d.value), 1);
      const width = 780;
      const height = 160;
      const paddingX = 60;
      const paddingY = 50;

      return chartData.value.map((item, index) => {
        const x =
          paddingX + index * (width / Math.max(1, chartData.value.length - 1));
        const y = paddingY + (height - (item.value / maxValue) * height);
        return {
          x,
          y,
          value: item.value,
          label: item.label,
          date: item.date,
        };
      });
    };

    const generateChartPath = () => {
      const points = getChartPoints();
      if (points.length === 0) return "";

      let path = `M${points[0].x} ${points[0].y}`;

      // Use smooth curves for better visual appeal
      for (let i = 1; i < points.length; i++) {
        const prevPoint = points[i - 1];
        const currentPoint = points[i];

        if (i === 1) {
          path += ` L${currentPoint.x} ${currentPoint.y}`;
        } else {
          // Create smooth curve
          const cpx1 = prevPoint.x + (currentPoint.x - prevPoint.x) / 3;
          const cpy1 = prevPoint.y;
          const cpx2 = currentPoint.x - (currentPoint.x - prevPoint.x) / 3;
          const cpy2 = currentPoint.y;
          path += ` C${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${currentPoint.x} ${currentPoint.y}`;
        }
      }
      return path;
    };

    const generateFillPath = () => {
      const points = getChartPoints();
      if (points.length === 0) return "";

      let path = generateChartPath();
      // Close the path at the bottom
      path += ` L${points[points.length - 1].x} 210`;
      path += ` L${points[0].x} 210 Z`;
      return path;
    };

    const getYAxisLabels = () => {
      if (chartData.value.length === 0) return [0];

      const maxValue = Math.max(...chartData.value.map((d) => d.value));
      const step = Math.ceil(maxValue / 4);
      return [0, step, step * 2, step * 3, maxValue];
    };

    // Tooltip functions
    const showTooltip = (point, event) => {
      tooltip.visible = true;
      tooltip.label = point.label;
      tooltip.value = point.value;

      const rect = event.target.closest("svg").getBoundingClientRect();
      tooltip.style = {
        left: event.clientX - rect.left + 10 + "px",
        top: event.clientY - rect.top - 10 + "px",
      };
    };

    const hideTooltip = () => {
      tooltip.visible = false;
    };

    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        isChartLoading.value = true; // Mulai loading

        const token = getToken();

        const { data } = await axios.get(
          `${API_BASE_URL}/api/admin/analytics`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              period: selectedPeriod.value,
              metric: selectedMetric.value,
            },
          }
        );

        // Update data lainnya...
        totalStudents.value = data.totalStudents;
        studentsGrowth.value = data.studentsGrowth;
        totalPosts.value = data.totalPosts;
        postsGrowth.value = data.postsGrowth;
        totalInteractions.value = data.totalInteractions;
        interactionsGrowth.value = data.interactionsGrowth;
        avgEngagementRate.value = data.avgEngagementRate;
        engagementGrowth.value = data.engagementGrowth;
        trendingContent.value = data.trendingContent || [];
        hourlyActivity.value = data.hourlyActivity || [];
        topContributors.value = data.topContributors || [];

        chartData.value = data.chartData || [];
        chartMeta.value = data.chartMeta || {};
      } catch (err) {
        console.error("Gagal memuat data analytics", err);
        chartData.value = [];
      } finally {
        isChartLoading.value = false; // Selesai loading
      }
    };

    // Create fallback data when no data is available
    // const createFallbackData = () => {
    //   const fallbackData = [];
    //   const days =
    //     selectedPeriod.value === "7d"
    //       ? 7
    //       : selectedPeriod.value === "30d"
    //       ? 30
    //       : 7;

    //   for (let i = days; i >= 0; i--) {
    //     const date = new Date();
    //     date.setDate(date.getDate() - i);

    //     fallbackData.push({
    //       label: date.toLocaleDateString("id-ID", {
    //         day: "2-digit",
    //         month: "short",
    //       }),
    //       value: Math.floor(Math.random() * 10), // Random small values
    //       date: date.toISOString(),
    //     });
    //   }

    //   return fallbackData;
    // };
    const createFallbackData = () => [];

    onMounted(() => {
      fetchAnalytics();
    });

    return {
      selectedPeriod,
      selectedMetric,
      totalStudents,
      studentsGrowth,
      totalPosts,
      postsGrowth,
      totalInteractions,
      interactionsGrowth,
      isChartLoading,
      avgEngagementRate,
      engagementGrowth,
      trendingContent,
      hourlyActivity,
      topContributors,
      chartData,
      chartMeta,
      tooltip,
      formatNumber,
      getActivityColor,
      getMetricColor,
      getMetricLabel,
      getPeriodLabel,
      getMaxHourlyActivity,
      getChartPoints,
      generateChartPath,
      generateFillPath,
      getYAxisLabels,
      showTooltip,
      hideTooltip,
      fetchAnalytics,
      createFallbackData,
    };
  },
};
</script>

<style scoped>
.analytics-page {
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  color: white;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #00d4ff, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-header p {
  color: #8892b0;
  font-size: 1.1rem;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 212, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.1);
}

.stat-icon {
  color: #00d4ff;
  margin-bottom: 1rem;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-content p {
  color: #8892b0;
  margin-bottom: 0.5rem;
}

.stat-change {
  font-size: 0.9rem;
  font-weight: 600;
}

.stat-change.positive {
  color: #4ecdc4;
}

.charts-section {
  margin-bottom: 3rem;
}

.chart-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.chart-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
}

.chart-controls {
  display: flex;
  gap: 1rem;
}

.period-select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.period-select option {
  background: #1a1a2e;
  color: #ffffff;
  padding: 0.5rem;
}

.period-select:hover {
  border-color: #00d4ff;
  background: rgba(0, 0, 0, 0.6);
}

.period-select:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
  background: rgba(0, 0, 0, 0.6);
}

.chart-placeholder {
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

.no-data-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #8892b0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 212, 255, 0.3);
  border-top: 3px solid #00d4ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.chart-point {
  cursor: pointer;
  transition: r 0.2s ease;
}

.chart-point:hover {
  r: 7;
}

.chart-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.analytics-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.analytics-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #00d4ff;
}

.trending-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.trending-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.trending-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.trending-rank {
  background: #00d4ff;
  color: #1a1a2e;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.trending-info {
  flex: 1;
}

.trending-title {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: white;
}

.trending-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #8892b0;
}

.time-activity {
  height: 200px;
}

.time-chart {
  display: flex;
  align-items: end;
  height: 100%;
  gap: 2px;
  padding: 1rem 0;
}

.time-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.time-label {
  font-size: 0.8rem;
  color: #8892b0;
  margin-bottom: 0.5rem;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.time-value {
  width: 100%;
  border-radius: 2px 2px 0 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.time-value:hover {
  opacity: 0.8;
}

.contributors-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contributor-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.contributor-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.contributor-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #00d4ff, #4ecdc4);
  color: #1a1a2e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}

.contributor-info {
  flex: 1;
}

.contributor-name {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.contributor-faculty {
  font-size: 0.8rem;
  color: #8892b0;
}

.contributor-stats {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 0.25rem;
}

.contributor-posts {
  font-weight: 500;
  color: #00d4ff;
}

.contributor-points {
  font-size: 0.8rem;
  color: #8892b0;
}

@media (max-width: 768px) {
  .analytics-page {
    padding: 1rem;
  }

  .chart-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .chart-controls {
    justify-content: center;
  }

  .analytics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
