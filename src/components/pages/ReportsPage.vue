<template>
  <div class="reports-page">
    <!-- Header -->
    <div class="reports-header">
      <div class="page-title">
        <h1>Reports Management</h1>
        <p>Kelola laporan konten dari pengguna</p>
      </div>
    </div>

    <!-- Reports List -->
    <div class="reports-list">
      <div
        v-for="report in reports"
        :key="report.id"
        class="report-card"
        :class="{
          'status-new': report.status === 'new',
          'status-review': report.status === 'review',
          'status-resolved': report.status === 'resolved',
        }"
      >
        <!-- Report Header -->
        <div class="report-header">
          <div class="report-info">
            <div class="report-id">#{{ report.id }}</div>
            <div class="report-status" :class="report.status">
              {{ getStatusLabel(report.status) }}
            </div>
          </div>
          <div class="report-date">{{ formatDate(report.reportDate) }}</div>
        </div>

        <!-- Post Content -->
        <div class="post-content">
          <div class="post-author">
            <div class="author-avatar">{{ report.post.author.charAt(0) }}</div>
            <div class="author-info">
              <div class="author-name">{{ report.post.author }}</div>
              <div class="post-date">{{ formatDate(report.post.date) }}</div>
            </div>
          </div>

          <div class="post-text">
            {{ report.post.content }}
          </div>

          <div v-if="report.post.image" class="post-image">
            <img
              :src="getAvatarUrl(report.post.image)"
              alt="Post image"
              @error="
                (e) =>
                  (e.target.src = 'https://placehold.co/600x400?text=No+Image')
              "
            />
          </div>
        </div>

        <!-- Report Details -->
        <div class="report-details">
          <div class="reporter-info">
            <span class="label">Dilaporkan oleh:</span>
            <span class="reporter-name">{{ report.reporter }}</span>
          </div>
          <div class="report-reason">
            <span class="label">Alasan:</span>
            <span class="reason-tag" :class="report.category">{{
              getCategoryLabel(report.category)
            }}</span>
          </div>
          <div v-if="report.description" class="report-description">
            <span class="label">Deskripsi:</span>
            <span class="description-text">{{ report.description }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button @click="viewPostDetail(report)" class="btn btn-view">
            👁️ Lihat Detail
          </button>

          <button
            v-if="report.status !== 'resolved'"
            @click="markAsReview(report)"
            class="btn btn-review"
            :disabled="report.status === 'review'"
          >
            🔍 {{ report.status === "review" ? "Sedang Ditinjau" : "Tinjau" }}
          </button>

          <button
            @click="dismissReport(report)"
            class="btn btn-dismiss"
            v-if="report.status !== 'resolved'"
          >
            ❌ Tolak Laporan
          </button>

          <button
            @click="deletePost(report)"
            class="btn btn-delete"
            v-if="report.status !== 'resolved'"
          >
            🗑️ Hapus Post
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="reports.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>Tidak ada laporan</h3>
      <p>Belum ada laporan konten yang masuk.</p>
    </div>

    <!-- Detail Modal -->
    <PostDetailModal
      v-if="showDetailModal"
      :report="selectedReport"
      @close="closeModal"
      @review="handleReview"
      @dismiss="handleDismiss"
      @delete="handleDelete"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import PostDetailModal from "../Reports/PostDetailModal.vue";
import { useAuth } from "@/composables/useAuth";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { getAvatarUrl } from "@/utils/avatar";

export default {
  name: "ReportsPage",
  components: {
    PostDetailModal,
  },
  setup() {
    const showDetailModal = ref(false);
    const selectedReport = ref(null);
    const { userEmail, getToken } = useAuth();
    // Mock data untuk reports
    const reports = ref([
      {
        id: 1001,
        status: "new",
        category: "inappropriate",
        reporter: "Sarah Johnson",
        reportDate: "2024-01-15T10:30:00Z",
        description: "Konten tidak pantas untuk umum",
        post: {
          id: 501,
          author: "John Doe",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
          date: "2024-01-14T08:15:00Z",
          image: null,
          likes: 12,
          comments: 5,
          shares: 2,
        },
      },
      {
        id: 1002,
        status: "review",
        category: "spam",
        reporter: "Mike Chen",
        reportDate: "2024-01-14T15:45:00Z",
        description: "Posting berulang kali konten yang sama",
        post: {
          id: 502,
          author: "Jane Smith",
          content:
            "Promo special discount 90%! Link di bio! Buruan sebelum kehabisan! #promo #discount #sale",
          date: "2024-01-14T12:30:00Z",
          image: "https://via.placeholder.com/300x200",
          likes: 3,
          comments: 1,
          shares: 0,
        },
      },
      {
        id: 1003,
        status: "resolved",
        category: "harassment",
        reporter: "Lisa Wong",
        reportDate: "2024-01-13T09:20:00Z",
        description: "Komentar yang menyerang personal",
        post: {
          id: 503,
          author: "Bad User",
          content:
            "Kamu jelek banget deh, mending ga usah posting foto. Dasar orang ga punya cermin.",
          date: "2024-01-13T07:45:00Z",
          image: null,
          likes: 2,
          comments: 10,
          shares: 0,
        },
      },
      {
        id: 1004,
        status: "new",
        category: "fake",
        reporter: "David Kim",
        reportDate: "2024-01-15T14:10:00Z",
        description: "Menyebarkan informasi yang tidak benar",
        post: {
          id: 504,
          author: "Fake News",
          content:
            "Breaking news: Alien mendarat di Jakarta kemarin malam! Sumber terpercaya mengatakan mereka datang dengan damai.",
          date: "2024-01-15T06:30:00Z",
          image: null,
          likes: 25,
          comments: 15,
          shares: 8,
        },
      },
      {
        id: 1005,
        status: "review",
        category: "other",
        reporter: "Emma Watson",
        reportDate: "2024-01-12T16:45:00Z",
        description: "Melanggar aturan komunitas lainnya",
        post: {
          id: 505,
          author: "Random User",
          content:
            "Post yang melanggar aturan komunitas dengan cara lain yang tidak termasuk kategori di atas. Konten ini mengandung hal-hal yang tidak sesuai.",
          date: "2024-01-12T14:30:00Z",
          image: null,
          likes: 7,
          comments: 3,
          shares: 1,
        },
      },
      {
        id: 1006,
        status: "new",
        category: "inappropriate",
        reporter: "Admin Moderator",
        reportDate: "2024-01-11T11:20:00Z",
        description: "Konten dewasa yang tidak sesuai",
        post: {
          id: 506,
          author: "User123",
          content:
            "Posting gambar dan konten yang tidak pantas untuk platform ini. Harusnya ada age restriction.",
          date: "2024-01-11T09:45:00Z",
          image: "https://via.placeholder.com/400x300",
          likes: 45,
          comments: 23,
          shares: 12,
        },
      },
    ]);

    // Methods
    const getStatusLabel = (status) => {
      const labels = {
        new: "Baru",
        review: "Sedang Ditinjau",
        resolved: "Selesai",
      };
      return labels[status] || status;
    };

    const getCategoryLabel = (category) => {
      const labels = {
        spam: "Spam",
        inappropriate: "Tidak Pantas",
        harassment: "Pelecehan",
        fake: "Info Palsu",
        other: "Lainnya",
      };
      return labels[category] || category;
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const viewPostDetail = (report) => {
      selectedReport.value = report;
      showDetailModal.value = true;
    };

    const closeModal = () => {
      showDetailModal.value = false;
      selectedReport.value = null;
    };

    const markAsReview = async (report) => {
      try {
        const token = getToken();
        await axios.put(
          `${API_BASE_URL}/api/admin/reports/${report.id}/review`,
          null,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        report.status = "review";
      } catch (err) {
        console.error("Gagal menandai review:", err);
        alert("Gagal menandai laporan sebagai ditinjau");
      }
    };

    const dismissReport = async (report) => {
      if (confirm("Yakin ingin menolak laporan ini?")) {
        try {
          const token = getToken();
          await axios.put(
            `${API_BASE_URL}/api/admin/reports/${report.id}/dismiss`,
            null,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          report.status = "resolved";
        } catch (err) {
          console.error("Gagal menolak laporan:", err);
          alert("Gagal menolak laporan");
        }
      }
    };

    const deletePost = async (report) => {
      if (
        confirm(
          "Yakin ingin menghapus post ini? Tindakan ini tidak dapat dibatalkan."
        )
      ) {
        try {
          const token = getToken();
          await axios.delete(
            `${API_BASE_URL}/api/admin/posts/${report.post.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          report.status = "resolved";
        } catch (err) {
          console.error("Gagal menghapus post:", err);
          alert("Gagal menghapus post");
        }
      }
    };

    const handleReview = (report) => {
      markAsReview(report);
      closeModal();
    };

    const handleDismiss = (report) => {
      dismissReport(report);
      closeModal();
    };

    const handleDelete = (report) => {
      deletePost(report);
      closeModal();
    };

    onMounted(async () => {
      try {
        const token = getToken(); // dari auth
        const response = await axios.get(`${API_BASE_URL}/api/admin/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        reports.value = response.data.map((item) => ({
          id: item.id,
          status: item.status,
          category: item.reason,
          reporter: item.reporter?.fullName || "Unknown",
          reportDate: item.createdAt,
          description: item.description,
          post: {
            id: item.Post?.id,
            author: item.Post?.author?.fullName || "Unknown", // kalau Post tidak punya relasi author, ganti jadi reporter
            content: item.Post?.content,
            date: item.Post?.createdAt,
            image: item.Post?.image || null,
            likes: item.Post?.likes || 0,
            comments: item.Post?.comments || 0,
            shares: 0, // kalau belum ada field shares
          },
        }));
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    });
    return {
      showDetailModal,
      selectedReport,
      reports,
      getStatusLabel,
      getCategoryLabel,
      formatDate,
      viewPostDetail,
      closeModal,
      getAvatarUrl,
      markAsReview,
      dismissReport,
      deletePost,
      handleReview,
      handleDismiss,
      handleDelete,
    };
  },
};
</script>

<style scoped>
.reports-page {
  padding: 30px;
  color: #ffffff;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Header Section */
.reports-header {
  margin-bottom: 30px;
}

.page-title h1 {
  font-size: 28px;
  margin-bottom: 5px;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-title p {
  opacity: 0.7;
  font-size: 16px;
}

/* Reports List */
.reports-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.report-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.report-card.status-new {
  border-left-color: #ff4757;
  box-shadow: 0 0 20px rgba(255, 71, 87, 0.1);
}

.report-card.status-review {
  border-left-color: #ffb800;
  box-shadow: 0 0 20px rgba(255, 184, 0, 0.1);
}

.report-card.status-resolved {
  border-left-color: #4facfe;
  box-shadow: 0 0 20px rgba(79, 172, 254, 0.1);
}

.report-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

/* Report Header */
.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.report-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.report-id {
  font-family: monospace;
  font-weight: bold;
  color: #4facfe;
  font-size: 16px;
}

.report-status {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.report-status.new {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

.report-status.review {
  background: rgba(255, 184, 0, 0.2);
  color: #ffb800;
}

.report-status.resolved {
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
}

.report-date {
  opacity: 0.7;
  font-size: 14px;
}

/* Post Content */
.post-content {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.post-author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.author-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 18px;
}

.author-name {
  font-weight: 600;
  font-size: 16px;
}

.post-date {
  opacity: 0.6;
  font-size: 12px;
}

.post-text {
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.9);
}

.post-image {
  margin-top: 15px;
}

.post-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  max-height: 300px;
  object-fit: cover;
}

/* Report Details */
.report-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.reporter-info,
.report-reason,
.report-description {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.label {
  font-weight: 600;
  margin-right: 8px;
  opacity: 0.8;
  min-width: 120px;
  font-size: 14px;
}

.reporter-name,
.description-text {
  color: #00f2fe;
  font-weight: 500;
}

.reason-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.reason-tag.spam {
  background: rgba(255, 184, 0, 0.2);
  color: #ffb800;
}

.reason-tag.inappropriate {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

.reason-tag.harassment {
  background: rgba(255, 71, 87, 0.3);
  color: #ff4757;
}

.reason-tag.fake {
  background: rgba(255, 99, 71, 0.2);
  color: #ff6347;
}

.reason-tag.other {
  background: rgba(128, 128, 128, 0.2);
  color: #888;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-view {
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
  border-color: rgba(79, 172, 254, 0.3);
}

.btn-view:hover {
  background: rgba(79, 172, 254, 0.3);
  box-shadow: 0 0 15px rgba(79, 172, 254, 0.2);
  transform: translateY(-1px);
}

.btn-review {
  background: rgba(0, 242, 254, 0.2);
  color: #00f2fe;
  border-color: rgba(0, 242, 254, 0.3);
}

.btn-review:hover:not(:disabled) {
  background: rgba(0, 242, 254, 0.3);
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.2);
  transform: translateY(-1px);
}

.btn-review:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-dismiss {
  background: rgba(128, 128, 128, 0.2);
  color: #888;
  border-color: rgba(128, 128, 128, 0.3);
}

.btn-dismiss:hover {
  background: rgba(128, 128, 128, 0.3);
  transform: translateY(-1px);
}

.btn-delete {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
  border-color: rgba(255, 71, 87, 0.3);
}

.btn-delete:hover {
  background: rgba(255, 71, 87, 0.3);
  box-shadow: 0 0 15px rgba(255, 71, 87, 0.2);
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  opacity: 0.7;
}

.empty-icon {
  font-size: 72px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #4facfe;
}

.empty-state p {
  font-size: 16px;
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .reports-page {
    padding: 20px;
  }

  .action-buttons {
    justify-content: stretch;
  }

  .btn {
    flex: 1;
    justify-content: center;
    min-width: 0;
  }

  .report-details {
    gap: 8px;
  }

  .reporter-info,
  .report-reason,
  .report-description {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .label {
    min-width: auto;
  }
}
</style>
