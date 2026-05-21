/* ═══════════════════════════════════════════
   MedCore — render.js
   Render HTML cho từng Section
═══════════════════════════════════════════ */

/* ══════════════ DASHBOARD ══════════════ */
function renderDashboard() {
  const s = DB.stats;
  document.getElementById('sec-dashboard').innerHTML = `
    <div class="stat-grid">
      <div class="stat-card blue">
        <div class="stat-icon">🧑‍⚕️</div>
        <div class="stat-label">Bệnh nhân hôm nay</div>
        <div class="stat-value">${s.todayPatients}</div>
        <div class="stat-change up">↑ 12% so với hôm qua</div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon">✅</div>
        <div class="stat-label">Ca đã hoàn thành</div>
        <div class="stat-value">${s.completedToday}</div>
        <div class="stat-change up">↑ ${Math.round(s.completedToday/s.todayPatients*100)}% hoàn thành</div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon">💰</div>
        <div class="stat-label">Doanh thu hôm nay</div>
        <div class="stat-value">${(s.revenueToday/1000000).toFixed(1)}M</div>
        <div class="stat-change up">↑ 8% so với hôm qua</div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon">🔢</div>
        <div class="stat-label">Đang chờ khám</div>
        <div class="stat-value">${s.waitingNow}</div>
        <div class="stat-change dn">↓ Giảm 5 trong 30 phút</div>
      </div>
    </div>

    <div class="chart-grid">
      <div class="card">
        <div class="chart-header">
          <div class="chart-title">📈 Lượt khám (7 ngày)</div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost btn-sm">Tuần</button>
            <button class="btn btn-primary btn-sm">Tháng</button>
          </div>
        </div>
        <canvas id="chartWeek" height="200"></canvas>
      </div>
      <div class="card">
        <div class="chart-header"><div class="chart-title">🏥 Phân bố chuyên khoa</div></div>
        <canvas id="chartSpec" height="220"></canvas>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card">
        <div class="chart-header"><div class="chart-title">💊 Top thuốc tiêu thụ</div></div>
        <canvas id="chartMeds" height="180"></canvas>
      </div>
      <div class="card">
        <div class="chart-header">
          <div class="chart-title">🕐 Bệnh nhân chờ gần đây</div>
          <button class="btn btn-outline btn-sm" onclick="nav('queue', document.querySelector('[onclick*=queue]'))">Xem hàng đợi</button>
        </div>
        <div class="table-wrap" style="border:none">
          <table>
            <thead><tr><th>STT</th><th>Bệnh nhân</th><th>Khoa</th><th>Chờ</th></tr></thead>
            <tbody>
              ${DB.queue.slice(0,5).map(q => `
                <tr>
                  <td>${badge(q.current,'badge-blue')}</td>
                  <td>${q.currentName}</td>
                  <td><span class="badge badge-gray">${q.spec}</span></td>
                  <td>${badge('~15p','badge-yellow')}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}

/* ══════════════ PATIENTS ══════════════ */
function renderPatients(list) {
  let dok = false;
  list = DB.patients;
  document.getElementById('sec-patients').innerHTML = `
    <div class="section-header">
      <div class="section-title">🧑‍⚕️ Danh sách Bệnh nhân</div>
      <div class="section-count">${list.length} bệnh nhân</div>
      <div style="margin-left:auto;display:flex;gap:10px">
        <button class="btn btn-outline" onclick="exportExcel()">📊 Xuất Excel</button>
        <button class="btn btn-primary" onclick="modalAddPatient()">+ Thêm bệnh nhân</button>
      </div>
    </div>
    <div class="filter-bar">
      <div class="search-bar">
        <span>🔍</span>
        <input type="text" placeholder="Tìm theo tên, mã BN, CCCD..." oninput="filterTable(this,'patientTable')">
      </div>
      <select class="filter-select" onchange="filterTableByCol(this,'patientTable',3)">
        <option value="">Tất cả chuyên khoa</option>
        ${[...new Set(DB.patients.map(p=>p.specialty))].map(s=>`<option>${s}</option>`).join('')}
      </select>
      <select class="filter-select" onchange="filterTableByCol(this,'patientTable',5)">
        <option value="">Tất cả trạng thái</option>
        <option>Đang chờ</option><option>Đang khám</option><option>Hoàn thành</option><option>Nhập viện</option>
      </select>
    </div>
    <div class="table-wrap">
      <table id="patientTable">
        <thead><tr><th>Mã BN</th><th>Họ & Tên</th><th>Ngày sinh</th><th>CCCD</th><th>Thao tác</th></tr></thead>
        <tbody>
          ${list.map(p => `
            <tr>
              <td><span class="badge badge-gray mono">${p.id}</span></td>
              <td><div style="display:flex;align-items:center;gap:10px"><div class="avatar-sm">${p.name[0]}</div>${p.name}</div></td>
              <td>${p.dob}</td>
              
              <td style="color:var(--text2)">
              ${
                p.cccd
              }
              </td>
              
              <td class="${dok = true}">${actionBtns(
                `<button class="btn btn-ghost btn-sm" onclick="modalViewPatient('${p.id}')">👁 Xem</button>`,
                `<button class="btn btn-outline btn-sm" onclick="modalEditPatient('${p.id}')">✏️ Sửa</button>`,
                `<button class="btn btn-danger btn-sm" onclick="deletePatient('${p.id}')">🗑</button>`
              )}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ══════════════ DOCTORS ══════════════ */
function renderDoctors(list) {
  list = DB.doctors;
  document.getElementById('sec-doctors').innerHTML = `
    <div class="section-header">
      <div class="section-title">👨‍⚕️ Danh sách Bác sĩ & Nhân viên</div>
      <div class="section-count">${list.length} bác sĩ</div>
      <div style="margin-left:auto;display:flex;gap:10px">
        <select class="filter-select" onchange="filterDoctors(this.value)">
          <option value="">Tất cả chuyên khoa</option>
          ${[...new Set(DB.doctors.map(d=>d.spec))].map(s=>`<option>${s}</option>`).join('')}
        </select>
        <button class="btn btn-primary" onclick="modalAddDoctor()">+ Thêm bác sĩ</button>
      </div>
    </div>
    <div class="table-wrap">
      <table id="doctorTable">
        <thead><tr><th>Mã BS</th><th>Họ & Tên</th><th>Chuyên khoa</th><th>Học hàm</th><th>Ca trực</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
        <tbody>
          ${list.map(d => `
            <tr>
              <td><span class="badge badge-gray mono">${d.id}</span></td>
              <td><div style="display:flex;align-items:center;gap:10px"><div class="avatar-sm">${d.name[0]}</div>${d.name}</div></td>
              <td>${badge(d.spec,'badge-blue')}</td>
              <td>${badge(d.degree,'badge-purple')}</td>
              <td>${d.shift}</td>
              <td>${badge(d.status)}</td>
              <td>${actionBtns(
                `<button class="btn btn-ghost btn-sm">📅 Lịch trực</button>`,
                `<button class="btn btn-outline btn-sm" onclick="modalEditDoctor('${d.id}')">✏️ Sửa 123</button>`,
                `<button class="btn btn-danger btn-sm" onclick="deleteDoctor('${d.id}')">🗑</button>`
              )}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function filterDoctors(spec) {
  renderDoctors(spec ? DB.doctors.filter(d => d.spec === spec) : DB.doctors);
}

/* ══════════════ QUEUE ══════════════ */
function renderQueue() {
  document.getElementById('sec-queue').innerHTML = `
    <div class="section-header">
      <div class="section-title">🔢 Quản lý Hàng đợi Khám</div>
      <div class="section-count">6 phòng đang hoạt động</div>
      <div style="margin-left:auto">
        <button class="btn btn-primary" onclick="modalAddQueue()">+ Tiếp nhận bệnh nhân</button>
      </div>
    </div>
    <div class="queue-grid">
      ${DB.queue.map((q, i) => `
        <div class="queue-room">
          <div class="queue-room-header">
            <div>
              <div class="queue-room-name">${q.room}</div>
              <div class="queue-room-spec">${q.spec}</div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="callNext(${i})">▶ Gọi tiếp</button>
          </div>
          <div class="queue-current">
            <div class="queue-current-label">Đang khám</div>
            <div class="queue-number">${q.current}</div>
            <div class="queue-name-display">${q.currentName}</div>
          </div>
          <div class="queue-list">
            ${q.waiting.slice(0,3).map(w => `
              <div class="queue-item">
                <span class="queue-num">${w.n}</span>
                <span class="queue-patient">${w.name}</span>
              </div>`).join('')}
            ${q.waiting.length > 3 ? `<div style="text-align:center;font-size:11px;color:var(--text3);padding:8px">+${q.waiting.length-3} bệnh nhân nữa</div>` : ''}
            ${q.waiting.length === 0 ? `<div class="empty-state" style="padding:20px"><div class="empty-icon">✅</div><p>Không còn bệnh nhân chờ</p></div>` : ''}
          </div>
        </div>`).join('')}
    </div>`;
}

function callNext(index) {
  const q = DB.queue[index];
  if (q.waiting.length > 0) {
    const next = q.waiting.shift();
    q.current = next.n;
    q.currentName = next.name;
    renderQueue();
    showToast(`📢 ${q.room}: Gọi STT ${next.n} — ${next.name}`, 'success');
  } else {
    showToast('Không còn bệnh nhân chờ!', 'warning');
  }
}

/* ══════════════ PRESCRIPTIONS ══════════════ */
function renderPrescriptions() {
  document.getElementById('sec-prescriptions').innerHTML = `
    <div class="section-header">
      <div class="section-title">📋 Kê Đơn Thuốc Điện Tử</div>
      <div style="margin-left:auto;display:flex;gap:10px">
        <button class="btn btn-outline" onclick="exportPDF()">🖨️ In đơn thuốc</button>
        <button class="btn btn-primary" onclick="modalAddRx()">+ Tạo đơn mới</button>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 380px;gap:20px">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Mã đơn</th><th>Bệnh nhân</th><th>Bác sĩ</th><th>Ngày kê</th><th>Tổng tiền</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            ${DB.prescriptions.map(r => `
              <tr>
                <td><span class="badge badge-gray mono">${r.id}</span></td>
                <td>${r.patient}</td>
                <td style="color:var(--text2)">${r.doctor}</td>
                <td>${r.date}</td>
                <td class="mono" style="font-weight:700;color:var(--primary)">${formatVND(r.total)}</td>
                <td>${badge(r.status)}</td>
                <td>${actionBtns(
                  `<button class="btn btn-ghost btn-sm" onclick="exportPDF()">🖨️</button>`,
                  `<button class="btn btn-outline btn-sm" onclick="modalViewRx('${r.id}')">👁 Xem</button>`
                )}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div id="rxBuilder">
        ${renderRxBuilder()}
      </div>
    </div>`;
}

function renderRxBuilder() {
  const defaultMeds = [
    {name:'Amoxicillin 500mg',qty:30,price:2500},
    {name:'Paracetamol 500mg',qty:20,price:800},
    {name:'Vitamin C 1000mg', qty:15,price:1200},
  ];
  const total = defaultMeds.reduce((a,m) => a + m.qty * m.price, 0);
  return `
    <div class="card">
      <div class="chart-title" style="margin-bottom:16px">💊 Đơn đang soạn</div>
      <div class="form-field">
        <label>Bệnh nhân</label>
        <select style="width:100%;padding:10px 14px;border-radius:8px;border:1.5px solid var(--border);background:var(--surface2);font-family:inherit;color:var(--text);outline:none">
          ${DB.patients.map(p=>`<option>${p.name} — ${p.id}</option>`).join('')}
        </select>
      </div>
      <div class="form-field">
        <label>Chẩn đoán</label>
        <input type="text" placeholder="Nhập chẩn đoán..." style="width:100%;padding:10px 14px;border-radius:8px;border:1.5px solid var(--border);background:var(--surface2);font-family:inherit;color:var(--text);outline:none">
      </div>
      <div class="rx-meds" id="rxMedList">
        <div style="font-size:12px;font-weight:700;color:var(--text3);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">Danh sách thuốc</div>
        ${defaultMeds.map(m => `
          <div class="rx-med-item">
            <span class="rx-med-name">${m.name}</span>
            <span class="rx-med-qty">x ${m.qty}</span>
            <button class="btn btn-danger btn-sm" onclick="this.closest('.rx-med-item').remove();recalcRx()">✕</button>
          </div>`).join('')}
      </div>
      <button class="btn btn-ghost" style="width:100%;margin-top:10px;margin-bottom:16px" onclick="addMedToRx()">+ Thêm thuốc</button>
      <div class="rx-total">
        <div class="rx-total-label">Tổng tiền đơn thuốc</div>
        <div class="rx-total-amount" id="rxTotalDisplay">${formatVND(total)}</div>
      </div>
      <button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="saveRx()">💾 Lưu & In đơn thuốc</button>
    </div>`;
}

function addMedToRx() {
  const meds = DB.inventory.filter(i => i.cat !== 'Vật tư y tế');
  const m    = meds[Math.floor(Math.random() * meds.length)];
  const qty  = Math.floor(Math.random() * 20) + 5;
  const item = document.createElement('div');
  item.className = 'rx-med-item';
  item.innerHTML = `<span class="rx-med-name">${m.name}</span><span class="rx-med-qty">x ${qty}</span><button class="btn btn-danger btn-sm" onclick="this.closest('.rx-med-item').remove();recalcRx()">✕</button>`;
  document.getElementById('rxMedList').appendChild(item);
  recalcRx();
}

function recalcRx() {
  const count = document.querySelectorAll('#rxMedList .rx-med-item').length;
  const total = count * 15000 + Math.floor(Math.random() * 50000);
  const el    = document.getElementById('rxTotalDisplay');
  if (el) el.textContent = formatVND(total);
}

function saveRx() {
  showToast('✅ Đơn thuốc đã lưu & gửi in!', 'success');
}

/* ══════════════ INVENTORY ══════════════ */
function renderInventory(list) {
  list = list || DB.inventory;
  document.getElementById('sec-inventory').innerHTML = `
    <div class="section-header">
      <div class="section-title">💊 Kho Dược Phẩm & Vật Tư</div>
      <div class="section-count">${list.length} mặt hàng</div>
      <div style="margin-left:auto;display:flex;gap:10px">
        <button class="btn btn-outline" onclick="exportExcel()">📊 Báo cáo kho</button>
        <button class="btn btn-primary" onclick="modalAddInventory()">+ Nhập hàng</button>
      </div>
    </div>
    <div class="filter-bar">
      <div class="search-bar">
        <span>🔍</span>
        <input type="text" placeholder="Tìm tên thuốc, mã hàng..." oninput="filterInventory(this.value)">
      </div>
      <select class="filter-select" onchange="filterInventoryCat(this.value)">
        <option value="">Tất cả danh mục</option>
        ${[...new Set(DB.inventory.map(i=>i.cat))].map(c=>`<option>${c}</option>`).join('')}
      </select>
    </div>
    <div class="inv-grid">
      ${list.map(item => {
        const pct = Math.round(item.qty / item.max * 100);
        const cls = pct > 50 ? 'ok' : pct > 20 ? 'warn' : 'low';
        return `
          <div class="inv-card">
            <div class="inv-name">${item.name}</div>
            <div class="inv-cat">${badge(item.cat,'badge-gray')}</div>
            <div class="inv-bar-label"><span>Tồn: ${item.qty.toLocaleString()} ${item.unit}</span><span>${pct}%</span></div>
            <div class="inv-bar"><div class="inv-bar-fill ${cls}" style="width:${pct}%"></div></div>
            <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:12px">
              <div>
                <div class="inv-price">${formatVND(item.price)}/${item.unit}</div>
                <div class="inv-exp">HSD: ${item.exp || '—'}</div>
              </div>
              <div style="display:flex;gap:6px">
                <button class="btn btn-ghost btn-sm">✏️</button>
                <button class="btn btn-success btn-sm" onclick="showToast('Đã nhập thêm hàng!','success')">+ Nhập</button>
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

function filterInventory(q) {
  renderInventory(q ? DB.inventory.filter(i => i.name.toLowerCase().includes(q.toLowerCase())) : DB.inventory);
}
function filterInventoryCat(cat) {
  renderInventory(cat ? DB.inventory.filter(i => i.cat === cat) : DB.inventory);
}

/* ══════════════ REPORTS ══════════════ */
function renderReports() {
  document.getElementById('sec-reports').innerHTML = `
    <div class="section-header">
      <div class="section-title">📈 Thống kê & Báo cáo</div>
      <div style="margin-left:auto;display:flex;gap:10px">
        <select class="filter-select"><option>Tháng 5/2026</option><option>Tháng 4/2026</option><option>Q1/2026</option></select>
        <button class="btn btn-primary" onclick="exportPDF()">📥 Xuất PDF</button>
      </div>
    </div>
    <div class="stat-grid" style="margin-bottom:20px">
      <div class="stat-card blue"><div class="stat-icon">👥</div><div class="stat-label">Tổng BN tháng</div><div class="stat-value">1,842</div><div class="stat-change up">↑ 18% so với tháng trước</div></div>
      <div class="stat-card green"><div class="stat-icon">💰</div><div class="stat-label">Doanh thu tháng</div><div class="stat-value">2.4 Tỷ</div><div class="stat-change up">↑ 24% so với tháng trước</div></div>
      <div class="stat-card orange"><div class="stat-icon">💊</div><div class="stat-label">Đơn thuốc kê</div><div class="stat-value">1,284</div><div class="stat-change up">↑ 9% so với tháng trước</div></div>
      <div class="stat-card purple"><div class="stat-icon">⭐</div><div class="stat-label">Hài lòng</div><div class="stat-value">4.8/5</div><div class="stat-change up">↑ 0.2 điểm</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card">
        <div class="chart-header"><div class="chart-title">📊 Doanh thu theo tháng</div></div>
        <canvas id="chartRevenue" height="220"></canvas>
      </div>
      <div class="card">
        <div class="chart-header"><div class="chart-title">👥 Xu hướng bệnh nhân</div></div>
        <canvas id="chartPatientTrend" height="220"></canvas>
      </div>
    </div>`;
}

/* ══════════════ SETTINGS ══════════════ */
function renderSettings() {
  document.getElementById('sec-settings').innerHTML = `
    <div class="section-header"><div class="section-title">⚙️ Cài đặt Hệ thống</div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="card">
        <div class="chart-title" style="margin-bottom:20px">🏥 Thông tin Bệnh viện</div>
        <div class="form-field"><label>Tên bệnh viện</label><input type="text" value="Bệnh Viện Đa Khoa Phúc Yên"></div>
        <div class="form-field"><label>Địa chỉ</label><input type="text" value="123 Đường Ngô Gia Tự, Phúc Yên, Vĩnh Phúc"></div>
        <div class="form-field"><label>Điện thoại</label><input type="text" value="0211 3868 xxx"></div>
        <div class="form-field"><label>Email</label><input type="text" value="info@bvphucyen.vn"></div>
        <button class="btn btn-primary" onclick="showToast('✅ Đã lưu thay đổi!','success')">💾 Lưu thay đổi</button>
      </div>
      <div class="card">
        <div class="chart-title" style="margin-bottom:20px">🔐 Bảo mật & Phân quyền</div>
        <div class="form-field"><label>Tự đăng xuất sau</label>
          <select style="width:100%;padding:10px 14px;border-radius:8px;border:1.5px solid var(--border);background:var(--surface2);color:var(--text);font-family:inherit;outline:none">
            <option>30 phút</option><option>1 giờ</option><option>8 giờ</option>
          </select></div>
        <div class="form-field"><label>Xác thực 2 bước (2FA)</label>
          <select style="width:100%;padding:10px 14px;border-radius:8px;border:1.5px solid var(--border);background:var(--surface2);color:var(--text);font-family:inherit;outline:none">
            <option>Bật cho Admin</option><option>Bật cho tất cả</option><option>Tắt</option>
          </select></div>
        <div class="form-field"><label>Log hệ thống</label>
          <select style="width:100%;padding:10px 14px;border-radius:8px;border:1.5px solid var(--border);background:var(--surface2);color:var(--text);font-family:inherit;outline:none">
            <option>Chi tiết</option><option>Cơ bản</option><option>Chỉ lỗi</option>
          </select></div>
        <button class="btn btn-primary" onclick="showToast('✅ Đã lưu cài đặt!','success')">💾 Lưu cài đặt</button>
      </div>
    </div>`;
}