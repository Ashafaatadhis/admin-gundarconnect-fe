<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="page-header">
      <h1>Platform Settings</h1>
      <p>Kelola pengaturan dan konfigurasi platform GundarConnect</p>
    </div>

    <!-- Settings Tabs -->
    <div class="settings-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        {{ tab.name }}
      </button>
    </div>

    <!-- Settings Content -->
    <div class="settings-content">
      
      <!-- General Settings -->
      <div v-if="activeTab === 'general'" class="settings-section">
        <div class="section-header">
          <h2>Pengaturan Umum</h2>
          <p>Konfigurasi dasar platform komunitas kampus</p>
        </div>

        <div class="settings-grid">
          <div class="setting-card">
            <h3>Informasi Platform</h3>
            <div class="form-group">
              <label>Nama Platform</label>
              <input 
                v-model="settings.general.platformName" 
                type="text" 
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Deskripsi Platform</label>
              <textarea 
                v-model="settings.general.platformDescription" 
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Email Admin</label>
              <input 
                v-model="settings.general.adminEmail" 
                type="email" 
                class="form-input"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- User Management -->
      <div v-if="activeTab === 'users'" class="settings-section">
        <div class="section-header">
          <h2>Manajemen Pengguna</h2>
          <p>Pengaturan registrasi dan verifikasi mahasiswa</p>
        </div>

        <div class="settings-grid">
          <div class="setting-card">
            <h3>Registrasi Pengguna</h3>
            <div class="toggle-section">
              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Izinkan Registrasi Baru</span>
                </div>
                <label class="modern-toggle">
                  <input 
                    v-model="settings.users.allowRegistration" 
                    type="checkbox" 
                    class="toggle-input"
                  />
                  <span class="toggle-switch"></span>
                </label>
              </div>
              
              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Wajib Verifikasi Email</span>
                </div>
                <label class="modern-toggle">
                  <input 
                    v-model="settings.users.requireEmailVerification" 
                    type="checkbox" 
                    class="toggle-input"
                  />
                  <span class="toggle-switch"></span>
                </label>
              </div>
              
              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Perlu Persetujuan Admin</span>
                </div>
                <label class="modern-toggle">
                  <input 
                    v-model="settings.users.requireAdminApproval" 
                    type="checkbox" 
                    class="toggle-input"
                  />
                  <span class="toggle-switch"></span>
                </label>
              </div>
            </div>
          </div>

          <div class="setting-card">
            <h3>Verifikasi Mahasiswa</h3>
            <div class="form-group">
              <label>Domain Email Universitas</label>
              <input 
                v-model="settings.users.allowedEmailDomain" 
                type="text" 
                class="form-input"
                placeholder="@student.gunadarma.ac.id"
              />
              <small class="help-text">Hanya email dengan domain ini yang bisa mendaftar</small>
            </div>
            <div class="toggle-section">
              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Wajib NPM Mahasiswa</span>
                </div>
                <label class="modern-toggle">
                  <input 
                    v-model="settings.users.requireStudentId" 
                    type="checkbox" 
                    class="toggle-input"
                  />
                  <span class="toggle-switch"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Moderation -->
      <div v-if="activeTab === 'moderation'" class="settings-section">
        <div class="section-header">
          <h2>Moderasi Konten</h2>
          <p>Pengaturan untuk menjaga kualitas dan keamanan konten</p>
        </div>

        <div class="settings-grid">
          <div class="setting-card">
            <h3>Auto Moderation</h3>
            <div class="toggle-section">
              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Aktifkan Auto Moderation</span>
                </div>
                <label class="modern-toggle">
                  <input 
                    v-model="settings.moderation.autoModeration" 
                    type="checkbox" 
                    class="toggle-input"
                  />
                  <span class="toggle-switch"></span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>Kata-kata Terlarang</label>
              <textarea 
                v-model="settings.moderation.bannedWords" 
                class="form-textarea"
                rows="4"
                placeholder="Masukkan kata-kata yang dilarang, pisahkan dengan koma"
              ></textarea>
              <small class="help-text">Konten dengan kata-kata ini akan otomatis disembunyikan</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="settings-footer">
      <button @click="saveSettings" class="save-btn" :disabled="isSaving">
        <span v-if="isSaving">⏳</span>
        <span v-else">💾</span>
        {{ isSaving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'SettingsPage',
  setup() {
    const activeTab = ref('general')
    const isSaving = ref(false)

    const tabs = [
      { id: 'general', name: 'Umum', icon: '⚙️' },
      { id: 'users', name: 'Pengguna', icon: '👥' },
      { id: 'moderation', name: 'Moderasi', icon: '🛡️' }
    ]

    const settings = reactive({
      general: {
        platformName: 'GundarConnect',
        platformDescription: 'Platform komunitas mahasiswa Universitas Gunadarma untuk berbagi cerita, bertanya, dan berinteraksi.',
        adminEmail: 'admin@gundarconnect.com'
      },
      users: {
        allowRegistration: true,
        requireEmailVerification: true,
        requireAdminApproval: false,
        allowedEmailDomain: '@student.gunadarma.ac.id',
        requireStudentId: true
      },
      moderation: {
        autoModeration: true,
        bannedWords: 'spam, scam, jual, beli, promosi'
      }
    })

    const saveSettings = async () => {
      isSaving.value = true
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Settings saved:', settings)
      isSaving.value = false
      alert('Pengaturan berhasil disimpan!')
    }

    return {
      activeTab,
      tabs,
      settings,
      isSaving,
      saveSettings
    }
  }
}
</script>

<style scoped>
.settings-page {
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

.settings-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #3a3a4e;
  overflow-x: auto;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px 20px;
  background: none;
  border: none;
  color: #8892b0;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: white;
}

.tab-button.active {
  color: #00d4ff;
  border-bottom-color: #00d4ff;
}

.tab-icon {
  font-size: 18px;
}

.settings-content {
  margin-bottom: 30px;
}

.settings-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-header {
  margin-bottom: 25px;
}

.section-header h2 {
  color: white;
  font-size: 24px;
  margin-bottom: 8px;
}

.section-header p {
  color: #8892b0;
  font-size: 14px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.setting-card {
  background: linear-gradient(135deg, #2a2a3e 0%, #1e1e2e 100%);
  padding: 30px;
  border-radius: 16px;
  border: 1px solid #3a3a4e;
  transition: all 0.3s ease;
}

.setting-card:hover {
  border-color: #4a4a5e;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.setting-card h3 {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid #3a3a4e;
}

.form-group {
  margin-bottom: 25px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 14px 16px;
  background: #1a1a2e;
  border: 2px solid #3a3a4e;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: #00d4ff;
  box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.1);
  transform: translateY(-1px);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.help-text {
  color: #8892b0;
  font-size: 13px;
  line-height: 1.4;
  margin-top: 6px;
}

/* Modern Toggle Design */
.toggle-section {
  margin-bottom: 20px;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(58, 58, 78, 0.3);
}

.toggle-row:last-child {
  border-bottom: none;
}

.toggle-info {
  flex: 1;
  margin-right: 20px;
}

.toggle-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  display: block;
}

.toggle-description {
  color: #8892b0;
  font-size: 13px;
  line-height: 1.4;
}

.modern-toggle {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 32px;
  background: #3a3a4e;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3);
}

.toggle-switch:before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 26px;
  height: 26px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 50%;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transform: scale(0.9);
}

.toggle-input:checked + .toggle-switch {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  box-shadow: inset 0 2px 6px rgba(0, 212, 255, 0.2), 0 0 20px rgba(0, 212, 255, 0.3);
}

.toggle-input:checked + .toggle-switch:before {
  transform: translateX(28px) scale(1);
  background: linear-gradient(145deg, #ffffff, #f8f8f8);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
}

.modern-toggle:hover .toggle-switch {
  transform: scale(1.05);
}

.modern-toggle:hover .toggle-switch:before {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
}

.toggle-input:checked + .toggle-switch:hover {
  box-shadow: inset 0 2px 6px rgba(0, 212, 255, 0.2), 0 0 25px rgba(0, 212, 255, 0.4);
}

.settings-footer {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  border-top: 1px solid #3a3a4e;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  justify-content: center;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .settings-page {
    padding: 20px;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-tabs {
    flex-direction: column;
    gap: 5px;
  }
  
  .tab-button {
    justify-content: flex-start;
    border-bottom: none;
    border-left: 2px solid transparent;
    border-radius: 8px;
  }
  
  .tab-button.active {
    border-left-color: #00d4ff;
    border-bottom-color: transparent;
    background: rgba(0, 212, 255, 0.1);
  }
  
  .toggle-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .toggle-info {
    margin-right: 0;
  }
}
</style>