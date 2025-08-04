<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h2>Detail Post & Laporan</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Post Content (menggunakan style dari FeedItem) -->
        <div class="post-preview">
          <div class="feed-header">
            <div class="user-info">
              <img
                :src="getAvatarUrl(report.post.author?.avatar)"
                alt="User Avatar"
                class="avatar"
                @error="(e) => (e.target.src = '/profile.png')"
              />
              <div>
                <div class="username">{{ report.post.author }}</div>
                <div class="timestamp">
                  {{ formatTimestamp(report.post.date) }}
                </div>
              </div>
            </div>
            <div class="post-status">
              <span class="status-badge reported">Dilaporkan</span>
            </div>
          </div>

          <div class="feed-content">
            <p>{{ report.post.content }}</p>

            <!-- Gambar jika ada -->
            <img
              v-if="report.post.image"
              :src="getAvatarUrl(report.post.image)"
              @error="
                (e) =>
                  (e.target.src = 'https://placehold.co/600x400?text=No+Image')
              "
              alt="Post Image"
              class="post-image"
            />
          </div>

          <!-- Post Stats (read-only untuk admin) -->
          <div class="post-stats">
            <div class="stat-item">
              <span class="stat-icon">❤️</span>
              <span class="stat-count">{{ report.post.likes || 0 }} likes</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">💬</span>
              <span class="stat-count"
                >{{ report.post.comments || 0 }} komentar</span
              >
            </div>
            <div class="stat-item">
              <span class="stat-icon">🔗</span>
              <span class="stat-count"
                >{{ report.post.shares || 0 }} bagikan</span
              >
            </div>
          </div>
        </div>

        <!-- Report Details Section -->
        <div class="report-section">
          <h3>Detail Laporan</h3>

          <div class="report-info">
            <div class="report-item">
              <span class="label">ID Laporan:</span>
              <span class="value">#{{ report.id }}</span>
            </div>

            <div class="report-item">
              <span class="label">Dilaporkan oleh:</span>
              <span class="value reporter-name">{{ report.reporter }}</span>
            </div>

            <div class="report-item">
              <span class="label">Tanggal Laporan:</span>
              <span class="value">{{
                formatTimestamp(report.reportDate)
              }}</span>
            </div>

            <div class="report-item">
              <span class="label">Kategori:</span>
              <span class="value">
                <span class="reason-tag" :class="report.category">
                  {{ getCategoryLabel(report.category) }}
                </span>
              </span>
            </div>

            <div v-if="report.description" class="report-item">
              <span class="label">Deskripsi:</span>
              <span class="value description">{{ report.description }}</span>
            </div>

            <div class="report-item">
              <span class="label">Status:</span>
              <span class="value">
                <span class="status-tag" :class="report.status">
                  {{ getStatusLabel(report.status) }}
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- Multiple Reports (jika ada laporan lain untuk post yang sama) -->
        <div v-if="relatedReports.length > 0" class="related-reports">
          <h3>Laporan Lainnya untuk Post Ini</h3>
          <div class="related-list">
            <div
              v-for="relatedReport in relatedReports"
              :key="relatedReport.id"
              class="related-item"
            >
              <div class="related-reporter">{{ relatedReport.reporter }}</div>
              <div class="related-reason">
                {{ getCategoryLabel(relatedReport.category) }}
              </div>
              <div class="related-date">
                {{ formatTimestamp(relatedReport.reportDate) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Actions History (jika ada) -->
        <div v-if="actionHistory.length > 0" class="action-history">
          <h3>Riwayat Tindakan</h3>
          <div class="history-list">
            <div
              v-for="action in actionHistory"
              :key="action.id"
              class="history-item"
            >
              <div class="history-icon" :class="action.type">
                {{ getActionIcon(action.type) }}
              </div>
              <div class="history-content">
                <div class="history-action">{{ action.description }}</div>
                <div class="history-meta">
                  oleh {{ action.admin }} • {{ formatTimestamp(action.date) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <div class="action-buttons">
          <button
            @click="handleReview"
            class="btn btn-review"
            :disabled="report.status === 'review'"
          >
            🔍 {{ report.status === "review" ? "Sedang Ditinjau" : "Tinjau" }}
          </button>

          <button
            @click="handleDismiss"
            class="btn btn-dismiss"
            v-if="report.status !== 'resolved'"
          >
            ❌ Tolak Laporan
          </button>

          <button
            @click="handleDelete"
            class="btn btn-delete"
            v-if="report.status !== 'resolved'"
          >
            🗑️ Hapus Post
          </button>

          <button @click="$emit('close')" class="btn btn-close">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { getAvatarUrl } from "@/utils/avatar";

export default {
  name: "PostDetailModal",
  props: {
    report: {
      type: Object,
      required: true,
    },
  },
  emits: ["close", "review", "dismiss", "delete"],
  setup(props, { emit }) {
    // Mock data untuk related reports (laporan lain untuk post yang sama)
    const relatedReports = ref([
      {
        id: 1005,
        reporter: "User Lain",
        category: "inappropriate",
        reportDate: "2024-01-15T16:20:00Z",
      },
    ]);

    // Mock data untuk action history
    const actionHistory = ref([
      {
        id: 1,
        type: "review",
        description: "Laporan sedang ditinjau",
        admin: "Admin Moderator",
        date: "2024-01-15T15:30:00Z",
      },
    ]);

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

    const getStatusLabel = (status) => {
      const labels = {
        new: "Baru",
        review: "Sedang Ditinjau",
        resolved: "Selesai",
      };
      return labels[status] || status;
    };

    const getActionIcon = (type) => {
      const icons = {
        review: "🔍",
        dismiss: "❌",
        delete: "🗑️",
        approve: "✅",
      };
      return icons[type] || "📝";
    };

    const formatTimestamp = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const handleReview = () => {
      emit("review", props.report);
    };

    const handleDismiss = () => {
      if (confirm("Yakin ingin menolak laporan ini?")) {
        emit("dismiss", props.report);
      }
    };

    const handleDelete = () => {
      emit("delete", props.report);
    };

    return {
      relatedReports,
      actionHistory,
      getCategoryLabel,
      getStatusLabel,
      getActionIcon,
      getAvatarUrl,
      formatTimestamp,
      handleReview,
      handleDismiss,
      handleDelete,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
  box-sizing: border-box;
}

.modal-content {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.modal-header h2 {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Modal Body */
.modal-body {
  padding: 25px;
  overflow-y: auto;
  flex: 1;
}

/* Post Preview (menggunakan style dari FeedItem) */
.post-preview {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(79, 172, 254, 0.3);
}

.username {
  font-weight: 600;
  color: #ffffff;
  font-size: 16px;
}

.timestamp {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.post-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.reported {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

.feed-content {
  margin-bottom: 15px;
}

.feed-content p {
  color: #ffffff;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 15px 0;
}

.post-image {
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
}

.post-stats {
  display: flex;
  gap: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stat-icon {
  font-size: 16px;
}

.stat-count {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

/* Report Section */
.report-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.report-section h3 {
  color: #ffffff;
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 600;
}

.report-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  min-width: 120px;
  font-size: 14px;
}

.value {
  color: #ffffff;
  font-size: 14px;
  flex: 1;
}

.reporter-name {
  color: #00f2fe;
  font-weight: 500;
}

.description {
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
}

.reason-tag,
.status-tag {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.reason-tag.spam,
.reason-tag.other {
  background: rgba(255, 184, 0, 0.2);
  color: #ffb800;
}

.reason-tag.inappropriate,
.reason-tag.harassment {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

.reason-tag.fake {
  background: rgba(255, 99, 71, 0.2);
  color: #ff6347;
}

.status-tag.new {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

.status-tag.review {
  background: rgba(255, 184, 0, 0.2);
  color: #ffb800;
}

.status-tag.resolved {
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
}

/* Related Reports */
.related-reports {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.related-reports h3 {
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 15px;
  font-weight: 600;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.related-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.related-reporter {
  font-weight: 500;
  color: #00f2fe;
}

.related-reason {
  font-size: 12px;
  color: #ffb800;
}

.related-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

/* Action History */
.action-history {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.action-history h3 {
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 15px;
  font-weight: 600;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.history-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: rgba(79, 172, 254, 0.2);
}

.history-content {
  flex: 1;
}

.history-action {
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 4px;
}

.history-meta {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

/* Modal Footer */
.modal-footer {
  padding: 20px 25px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid transparent;
}

.btn-review {
  background: rgba(0, 242, 254, 0.2);
  color: #00f2fe;
  border-color: rgba(0, 242, 254, 0.3);
}

.btn-review:hover:not(:disabled) {
  background: rgba(0, 242, 254, 0.3);
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.2);
}

.btn-review:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-dismiss {
  background: rgba(128, 128, 128, 0.2);
  color: #888;
  border-color: rgba(128, 128, 128, 0.3);
}

.btn-dismiss:hover {
  background: rgba(128, 128, 128, 0.3);
}

.btn-delete {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
  border-color: rgba(255, 71, 87, 0.3);
}

.btn-delete:hover {
  background: rgba(255, 71, 87, 0.3);
  box-shadow: 0 0 15px rgba(255, 71, 87, 0.2);
}

.btn-close {
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
  border-color: rgba(79, 172, 254, 0.3);
}

.btn-close:hover {
  background: rgba(79, 172, 254, 0.3);
  box-shadow: 0 0 15px rgba(79, 172, 254, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .modal-body {
    padding: 20px;
  }

  .action-buttons {
    justify-content: stretch;
  }

  .btn {
    flex: 1;
    justify-content: center;
  }

  .report-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .label {
    min-width: auto;
  }
}
</style>
