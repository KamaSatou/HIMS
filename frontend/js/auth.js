/* ═══════════════════════════════════════════
   MedCore — auth.js
   Authentication: Login · Logout · Role guard
═══════════════════════════════════════════ */

/* ── Role → UI mapping ── */
const ROLE_PROFILE = {
  ADMIN: {
    label: 'Ban Giám Đốc',
    avatar: 'AD',
    navAllowed: [
      'dashboard',
      'patients',
      'doctors',
      'queue',
      'prescriptions',
      'inventory',
      'reports',
      'settings'
    ]
  },

  DOCTOR: {
    label: 'Bác Sĩ',
    avatar: 'BS',
    navAllowed: [
      'dashboard',
      'patients',
      'queue',
      'prescriptions'
    ]
  },

  NURSE: {
    label: 'Điều Dưỡng',
    avatar: 'ĐD',
    navAllowed: [
      'dashboard',
      'patients',
      'queue',
      'inventory'
    ]
  },

  RECEPTIONIST: {
    label: 'Tiếp Đón',
    avatar: 'TĐ',
    navAllowed: [
      'dashboard',
      'patients',
      'appointments',
      'queue'
    ]
  },
};

/* ── selectRole() — called from login screen ── */
function selectRole(el, role) {

  document.querySelectorAll('.role-card')
    .forEach(c => c.classList.remove('active'));

  el.classList.add('active');

  // Đồng bộ role với backend
  AppState.currentRole = role.toUpperCase();
}

/* ── doLogin() — calls POST /api/auth/login ── */
async function doLogin() {

  const username =
    document.getElementById('loginUser').value.trim();

  const password =
    document.getElementById('loginPass').value.trim();

  if (!username || !password) {
    showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
    return;
  }

  const btn = document.querySelector('.btn-login');

  btn.textContent = '⏳ Đang đăng nhập...';
  btn.disabled = true;

  try {

    const res = await api.post('/auth/login', {
      username,
      password
    });

    // Save token + user info
    Auth.setToken(res.token);

    Auth.setUser({
      id:       res.userId,
      username: res.username,
      fullName: res.fullName,
      role:     res.role,
    });

    // Save current role
    AppState.currentRole = res.role;

    // Update sidebar
    const profile =
      ROLE_PROFILE[res.role] || ROLE_PROFILE.RECEPTIONIST;

    document.getElementById('sidebarAvatar').textContent =
      profile.avatar;

    document.getElementById('sidebarName').textContent =
      res.fullName;

    document.getElementById('sidebarRole').textContent =
      profile.label;

    // Hide login screen
    document.getElementById('loginScreen').style.display = 'none';

    // Apply permissions
    applyNavRestrictions(res.role);

    // Boot app
    initApp();

  } catch (err) {

    showToast('❌ ' + err.message, 'error');

  } finally {

    btn.textContent = '🔐 Đăng nhập vào hệ thống';
    btn.disabled = false;
  }
}

/* ── logout() ── */
function logout() {

  if (!confirm('Xác nhận đăng xuất?')) return;

  Auth.clear();

  location.reload();
}

/* ── applyNavRestrictions() — hide menu items by role ── */
function applyNavRestrictions(role) {

  const profile = ROLE_PROFILE[role];

  if (!profile) return;

  // Reset tất cả nav trước
  document.querySelectorAll('.nav-item')
    .forEach(el => el.style.display = '');

  // ADMIN thấy tất cả
  if (role === 'ADMIN') return;

  // Sections cần ẩn
  const hiddenSections =
    ROLE_PROFILE.ADMIN.navAllowed
      .filter(s => !profile.navAllowed.includes(s));

  hiddenSections.forEach(section => {

    const navEl = document.querySelector(
      `[onclick*="nav('${section}'"]`
    );

    if (navEl) {
      navEl.style.display = 'none';
    }
  });
}

/* ── checkAuthOnLoad() — called on page load ── */
function checkAuthOnLoad() {

  if (!Auth.isLoggedIn()) {

    document.getElementById('loginScreen').style.display = 'flex';

    return false;
  }

  // Auto-login with stored token
  const user = Auth.getUser();

  if (user) {

    AppState.currentRole = user.role;

    const profile =
      ROLE_PROFILE[user.role] || ROLE_PROFILE.RECEPTIONIST;

    document.getElementById('sidebarAvatar').textContent =
      profile.avatar;

    document.getElementById('sidebarName').textContent =
      user.fullName;

    document.getElementById('sidebarRole').textContent =
      profile.label;

    document.getElementById('loginScreen').style.display = 'none';

    applyNavRestrictions(user.role);

    return true;
  }

  return false;
}