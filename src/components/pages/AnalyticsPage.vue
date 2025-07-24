<template>
  <div class="analytics-page">
    <!-- Header -->
    <div class="page-header">
      <h1>Analytics Dashboard</h1>
      <p>Analisis komprehensif aktivitas komunitas mahasiswa Universitas Gunadarma</p>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ formatNumber(totalStudents) }}</h3>
          <p>Total Mahasiswa Terdaftar</p>
          <span class="stat-change positive">+{{ studentsGrowth }}% bulan ini</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ formatNumber(totalPosts) }}</h3>
          <p>Total Postingan</p>
          <span class="stat-change positive">+{{ postsGrowth }}% minggu ini</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ formatNumber(totalInteractions) }}</h3>
          <p>Total Interaksi</p>
          <span class="stat-change positive">+{{ interactionsGrowth }}% hari ini</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ avgEngagementRate }}%</h3>
          <p>Tingkat Engagement</p>
          <span class="stat-change positive">+{{ engagementGrowth }}% dari target</span>
        </div>
      </div>
    </div>

    <!-- Activity Chart -->
    <div class="charts-section">
      <div class="chart-card full-width">
        <div class="chart-header">
          <h3>Aktivitas Harian Platform</h3>
          <div class="chart-controls">
            <select v-model="selectedMetric" class="period-select">
              <option value="posts">Postingan</option>
              <option value="comments">Komentar</option>
              <option value="questions">Pertanyaan</option>
              <option value="answers">Jawaban</option>
            </select>
            <select v-model="selectedPeriod" class="period-select">
              <option value="7d">7 Hari</option>
              <option value="30d">30 Hari</option>
              <option value="90d">90 Hari</option>
            </select>
          </div>
        </div>
        <div class="chart-placeholder">
          <svg width="100%" height="300" viewBox="0 0 800 300">
            <defs>
              <linearGradient id="activityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:0" />
              </linearGradient>
            </defs>
            <path d="M50 250 L120 220 L190 180 L260 200 L330 160 L400 140 L470 120 L540 100 L610 80 L680 90 L750 70" 
                  stroke="#00d4ff" stroke-width="3" fill="none"/>
            <path d="M50 250 L120 220 L190 180 L260 200 L330 160 L400 140 L470 120 L540 100 L610 80 L680 90 L750 70 L750 300 L50 300 Z" 
                  fill="url(#activityGradient)"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Analytics Grid -->
    <div class="analytics-grid">

      <div class="analytics-card">
        <h3>Konten Trending</h3>
        <div class="trending-content">
          <div class="trending-item" v-for="content in trendingContent" :key="content.id">
            <div class="trending-rank">{{ content.rank }}</div>
            <div class="trending-info">
              <span class="trending-title">{{ content.title }}</span>
              <div class="trending-meta">
                <span class="trending-engagement">{{ content.likes }} likes</span>
                <span class="trending-comments">{{ content.comments }} comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="analytics-card">
        <h3>Waktu Aktif Pengguna</h3>
        <div class="time-activity">
          <div class="time-chart">
            <div class="time-bar" v-for="hour in hourlyActivity" :key="hour.time">
              <div class="time-label">{{ hour.time }}</div>
              <div class="time-value" :style="{ height: hour.activity + '%', backgroundColor: getActivityColor(hour.activity) }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="analytics-card">
        <h3>Top Contributors</h3>
        <div class="contributors-list">
          <div class="contributor-item" v-for="contributor in topContributors" :key="contributor.id">
            <div class="contributor-avatar">{{ contributor.name.charAt(0) }}</div>
            <div class="contributor-info">
              <span class="contributor-name">{{ contributor.name }}</span>
              <span class="contributor-faculty">{{ contributor.faculty }}</span>
            </div>
            <div class="contributor-stats">
              <span class="contributor-posts">{{ contributor.posts }} posts</span>
              <span class="contributor-points">{{ contributor.points }} pts</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'AnalyticsPage',
  setup() {
    const selectedPeriod = ref('30d')
    const selectedMetric = ref('posts')
    
    // Analytics data untuk platform kampus
    const totalStudents = ref(2847)
    const studentsGrowth = ref(12.3)
    const totalPosts = ref(15234)
    const postsGrowth = ref(8.5)
    const totalInteractions = ref(89456)
    const interactionsGrowth = ref(15.2)
    const avgEngagementRate = ref(74.8)
    const engagementGrowth = ref(12.3)

    const trendingContent = ref([
      { id: 1, rank: 1, title: 'Tips Skripsi: Cara Mengatasi Writer\'s Block', likes: 245, comments: 67 },
      { id: 2, rank: 2, title: 'Pengalaman Magang di Startup Jakarta', likes: 198, comments: 43 },
      { id: 3, rank: 3, title: 'Review Dosen: Mata Kuliah AI & Machine Learning', likes: 167, comments: 52 },
      { id: 4, rank: 4, title: 'Event Techno Fair 2025 - Jangan Sampai Terlewat!', likes: 134, comments: 28 },
      { id: 5, rank: 5, title: 'Sharing: Beasiswa LPDP untuk S2 Luar Negeri', likes: 125, comments: 39 }
    ])

    const hourlyActivity = ref([
      { time: '00', activity: 5 },
      { time: '03', activity: 8 },
      { time: '06', activity: 15 },
      { time: '09', activity: 45 },
      { time: '12', activity: 75 },
      { time: '15', activity: 85 },
      { time: '18', activity: 95 },
      { time: '21', activity: 65 }
    ])

    const topContributors = ref([
      { id: 1, name: 'Ahmad Rizki', faculty: 'Ilmu Komputer', posts: 167, points: 2340 },
      { id: 2, name: 'Sari Indah', faculty: 'Ekonomi', posts: 134, points: 1890 },
      { id: 3, name: 'Budi Santoso', faculty: 'Teknik', posts: 112, points: 1567 },
      { id: 4, name: 'Dewi Lestari', faculty: 'Psikologi', posts: 98, points: 1234 },
      { id: 5, name: 'Ravi Sharma', faculty: 'Sastra', posts: 87, points: 1098 }
    ])

    const formatNumber = (num) => {
      return new Intl.NumberFormat('id-ID').format(num)
    }

    const getActivityColor = (activity) => {
      if (activity >= 80) return '#00d4ff'
      if (activity >= 60) return '#4ecdc4'
      if (activity >= 40) return '#ffe66d'
      if (activity >= 20) return '#ff6b6b'
      return '#8892b0'
    }

    return {
      selectedPeriod,
      selectedMetric,
      totalStudents,
      studentsGrowth,
      totalPosts,
      postsGrowth,
      totalInteractions,
      interactionsGrowth,
      avgEngagementRate,
      engagementGrowth,
      trendingContent,
      hourlyActivity,
      topContributors,
      formatNumber,
      getActivityColor
    }
  }
}
</script>

<style scoped>
.analytics-page {
  padding: 30px;
  color: white;
  background: transparent;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  color: #00d4ff;
  margin-bottom: 8px;
}

.page-header p {
  color: #8892b0;
  font-size: 16px;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #2a2a3e 0%, #1e1e2e 100%);
  padding: 25px;
  border-radius: 15px;
  border: 1px solid #3a3a4e;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.1);
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-content h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
  color: white;
}

.stat-content p {
  color: #8892b0;
  font-size: 14px;
  margin-bottom: 5px;
}

.stat-change {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 20px;
  font-weight: 600;
}

.stat-change.positive {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.charts-section {
  margin-bottom: 30px;
}

.chart-card.full-width {
  background: linear-gradient(135deg, #2a2a3e 0%, #1e1e2e 100%);
  padding: 25px;
  border-radius: 15px;
  border: 1px solid #3a3a4e;
  width: 100%;
}

.chart-card {
  background: linear-gradient(135deg, #2a2a3e 0%, #1e1e2e 100%);
  padding: 25px;
  border-radius: 15px;
  border: 1px solid #3a3a4e;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  color: white;
  font-size: 18px;
}

.chart-controls {
  display: flex;
  gap: 10px;
}

.period-select {
  background: #1a1a2e;
  color: white;
  border: 1px solid #3a3a4e;
  padding: 8px 12px;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.analytics-card {
  background: linear-gradient(135deg, #2a2a3e 0%, #1e1e2e 100%);
  padding: 25px;
  border-radius: 15px;
  border: 1px solid #3a3a4e;
}

.analytics-card h3 {
  color: white;
  font-size: 18px;
  margin-bottom: 20px;
}

.trending-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.trending-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid #3a3a4e;
}

.trending-item:last-child {
  border-bottom: none;
}

.trending-rank {
  width: 30px;
  height: 30px;
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
}

.trending-info {
  flex: 1;
}

.trending-title {
  color: white;
  font-size: 14px;
  display: block;
  margin-bottom: 5px;
}

.trending-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #8892b0;
}

.time-activity {
  height: 200px;
}

.time-chart {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 100%;
  gap: 5px;
}

.time-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.time-label {
  color: #8892b0;
  font-size: 12px;
  margin-bottom: 10px;
}

.time-value {
  width: 100%;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  min-height: 10px;
}

.contributors-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contributor-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid #3a3a4e;
}

.contributor-item:last-child {
  border-bottom: none;
}

.contributor-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
}

.contributor-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.contributor-name {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.contributor-faculty {
  color: #8892b0;
  font-size: 12px;
}

.contributor-stats {
  display: flex;
  flex-direction: column;
  align-items: end;
  font-size: 12px;
  color: #8892b0;
}

.contributor-posts {
  color: #00d4ff;
  font-weight: 600;
}

@media (max-width: 768px) {
  .analytics-page {
    padding: 20px;
  }
  
  .charts-section {
    margin-bottom: 30px;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
  }
  
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-controls {
    flex-direction: column;
    gap: 10px;
  }
}
</style>