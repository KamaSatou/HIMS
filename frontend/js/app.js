/* ═══════════════════════════════════════════
   MedCore — app.js
   Bộ điều khiển ứng dụng chính
   Login · Navigation · Theme · Realtime
═══════════════════════════════════════════ */

/* ══ TRẠNG THÁI TOÀN CỤC ══ */
const AppState = {
  currentRole: null,
  currentSection: 'dashboard',
};

/* ══ NAVIGATION ══ */
const NAV_CONFIG = {
  dashboard: {
    title: 'Dashboard Tổng Quan',
    render: () => {
      renderDashboard();
      initDashboardCharts();
    }
  },

  // FIX: dùng API thật thay vì mock renderPatients()
  patients: {
    title: 'Danh sách Bệnh nhân',
    render: loadAndRenderPatients
  },

  doctors: {
    title: 'Bác sĩ & Nhân viên',
    render: renderDoctors
  },

  queue: {
    title: 'Hàng đợi Khám',
    render: renderQueue
  },

  prescriptions: {
    title: 'Kê đơn Thuốc điện tử',
    render: renderPrescriptions
  },

  inventory: {
    title: 'Kho Dược phẩm & Vật Tư',
    render: renderInventory
  },

  reports: {
    title: 'Thống kê & Báo cáo',
    render: () => {
      renderReports();
      initReportCharts();
    }
  },

  settings: {
    title: 'Cài đặt Hệ thống',
    render: renderSettings
  },
};

// function nav(section, el) {

//   // Ẩn section cũ
//   document.querySelectorAll('.section')
//     .forEach(s => s.classList.remove('active'));

//   document.querySelectorAll('.nav-item')
//     .forEach(n => n.classList.remove('active'));

//   // Hiện section mới
//   const sec = document.getElementById('sec-' + section);

//   if (sec) sec.classList.add('active');
//   if (el)  el.classList.add('active');

//   // Update topbar
//   const cfg = NAV_CONFIG[section];

//   if (cfg) {
//     document.getElementById('topbarTitle').textContent = cfg.title;

//     // render section
//     cfg.render();
//   }

//   AppState.currentSection = section;
// }

// ── NAVIGATION ── lấy section trong div có active

function nav(section, el) {
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('sec-'+section).classList.add('active');
  if(el) el.classList.add('active');
  const titles = {dashboard:'Dashboard Tổng Quan',patients:'Danh sách Bệnh nhân',doctors:'Bác sĩ & Nhân viên',queue:'Hàng đợi Khám',prescriptions:'Kê đơn Thuốc điện tử',inventory:'Kho Dược phẩm',reports:'Thống kê & Báo cáo',settings:'Cài đặt Hệ thống'};
  document.getElementById('topbarTitle').textContent = titles[section]||section;
  if(section==='reports') { setTimeout(initReportCharts,100); }
}


/* ══ THEME ══ */
function toggleTheme() {

  const html = document.documentElement;

  const dark =
    html.getAttribute('data-theme') === 'dark';

  html.setAttribute(
    'data-theme',
    dark ? 'light' : 'dark'
  );

  updateAllCharts();
}

/* ══ TOPBAR DATE / TIME ══ */
function updateTopbarTime() {

  const topbarSub =
    document.getElementById('topbarSub');

  if (!topbarSub) return;

  topbarSub.textContent =
    getCurrentDateStr() +
    ' — Ca sáng đang hoạt động';
}

/* ══ REALTIME QUEUE SIMULATION ══ */

const FAKE_NAMES = [
  'Nguyễn Thị Ánh Hồng',
  'Trần Văn Bảo',
  'Lê Thị Cam',
  'Phạm Văn Dương',
  'Hoàng Minh Em',
  'Vũ Thị Fang',
  'Đặng Văn Giang'
];

function startRealtimeQueue() {

  setInterval(() => {

    // FIX: tránh crash nếu queue rỗng
    if (!DB.queue || DB.queue.length === 0) return;

    const q =
      DB.queue[
        Math.floor(Math.random() * DB.queue.length)
      ];

    // FIX: tránh undefined
    if (!q || !q.waiting) return;

    // const name =
    //   FAKE_NAMES[
    //     Math.floor(Math.random() * FAKE_NAMES.length)
    //   ];

    const num =
      String(
        Math.floor(Math.random() * 40) + 50
      ).padStart(3, '0');

    const wait =
      `~${(q.waiting.length + 1) * 8}p`;

    // q.waiting.push({
    //   n: num,
    //   name,
    //   t: wait
    // });

    // Cập nhật badge queue
    const total =
      DB.queue.reduce(
        (a, x) => a + x.waiting.length,
        0
      );

    const badge =
      document.getElementById('badgeQueue');

    if (badge)
      badge.textContent = total;

    // Re-render nếu đang ở queue
    if (AppState.currentSection === 'queue') {
      renderQueue();
    }

  }, 10000);
}

/* ══ KHỞI ĐỘNG ỨNG DỤNG ══ */
async function initApp() {

  // Render lần đầu
  renderDashboard();

  // FIX: dùng API thật
  loadAndRenderPatients();
  loadAndRenderDoctors();
  loadAndRenderQueue();

  renderDoctors();
  renderQueue();
  renderPrescriptions();
  renderInventory();
  renderReports();
  renderSettings();

  // Hiện dashboard mặc định
  const dashboard =
    document.getElementById('sec-dashboard');

  if (dashboard)
    dashboard.classList.add('active');

  const firstNav =
    document.querySelector('.nav-item');

  if (firstNav)
    firstNav.classList.add('active');

  // Charts
  initDashboardCharts();

  // Time
  updateTopbarTime();

  setInterval(
    updateTopbarTime,
    60000
  );

  // Queue realtime
  startRealtimeQueue();

  // Badge bệnh nhân
  // const bp =
  //   document.getElementById('badgePatients');

  // if (bp)
  //   bp.textContent = DB.patients.length;
}

/* ══ KHỞI TẠO KHI LOAD TRANG ══ */
document.addEventListener('DOMContentLoaded', () => {

  // Time login screen
  updateTopbarTime();

  // FIX: auto auth login
  if (typeof checkAuthOnLoad === 'function') {

    if (checkAuthOnLoad()) {
      initApp();
    }

  } else {

    // fallback nếu chưa có auth.js
    initApp();
  }

  // FIX: tránh null modal crash
  const modal =
    document.getElementById('modalOverlay');

  if (modal) {

    modal.addEventListener('click', e => {

      if (e.target === modal) {
        closeModal();
      }

    });
  }
  document.getElementById('badgePatients').textContent = DB.patients.length;
  console.info(DB.patients.length);
});