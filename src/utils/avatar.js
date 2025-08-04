const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getAvatarUrl(avatar) {
  if (!avatar) return "/profile.png";
  if (avatar.startsWith("http://") || avatar.startsWith("https://"))
    return avatar;
  // Jika sudah diawali /uploads/ atau uploads/, jangan tambah uploads lagi
  if (avatar.startsWith("/uploads/")) return `${API_BASE_URL}${avatar}`;
  if (avatar.startsWith("uploads/")) return `${API_BASE_URL}/${avatar}`;
  return `${API_BASE_URL}/uploads/${avatar}`;
}
