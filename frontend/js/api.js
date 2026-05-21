/* ═══════════════════════════════════════════
   MedCore — api.js
   Core API client — Fetch + JWT + Error handling
   All backend calls go through this module.
═══════════════════════════════════════════ */

const API_BASE = 'http://localhost:8081/api';

// ── Token management ──────────────────────
const Auth = {
  getToken: ()  => localStorage.getItem('medcore_token'),
  setToken: (t) => localStorage.setItem('medcore_token', t),
  clear:    ()  => { localStorage.removeItem('medcore_token'); localStorage.removeItem('medcore_user'); },
  getUser:  ()  => JSON.parse(localStorage.getItem('medcore_user') || 'null'),
  setUser:  (u) => localStorage.setItem('medcore_user', JSON.stringify(u)),
  isLoggedIn: () => !!localStorage.getItem('medcore_token'),
};

// ── Core fetch wrapper ────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = Auth.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = { ...options, headers };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);

    // Token expired
    if (res.status === 401) {
      Auth.clear();
      // location.reload();
      return;
    }

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const msg = data?.error || data?.message || `HTTP ${res.status}`;
      throw new ApiError(msg, res.status, data);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('Không thể kết nối đến server. Kiểm tra backend đang chạy.', 0);
  }
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data   = data;
    this.name   = 'ApiError';
  }
}

// ── REST helpers ──────────────────────────
const api = {
  get:    (url, params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(url + qs);
  },
  post:   (url, body)   => apiFetch(url, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (url, body)   => apiFetch(url, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (url, body)   => apiFetch(url, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (url)         => apiFetch(url, { method: 'DELETE' }),

  // Binary download (PDF/Excel)
  download: async (url, filename) => {
    const token = Auth.getToken();
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new ApiError('Lỗi tải file', res.status);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = href;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(href);
  },
};