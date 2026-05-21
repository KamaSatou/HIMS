/* ═══════════════════════════════════════════
   MedCore — appointment.js
   Appointment module — NEW module
   Create · View · Reschedule · Cancel · Check-in
═══════════════════════════════════════════ */

const AppointmentAPI = {
  async getAll(params = {}) { return api.get('/appointments', params); },
  async getById(id)         { return api.get(`/appointments/${id}`); },
  async create(data)        { return api.post('/appointments', data); },
  async confirm(id)         { return api.patch(`/appointments/${id}/confirm`); },
  async checkIn(id)         { return api.patch(`/appointments/${id}/checkin`); },
  async cancel(id, reason)  { return api.patch(`/appointments/${id}/cancel?reason=${encodeURIComponent(reason)}`); },
  async reschedule(id, date, time) {
    return api.patch(`/appointments/${id}/reschedule?date=${date}&time=${time}`);
  },
};

// ── Load and render appointments section ──
async function loadAndRenderAppointments(dateStr = '') {
  showSectionLoading('sec-appointments');
  try {
    const params = dateStr ? { date: dateStr } : {};
    const list   = await AppointmentAPI.getAll(params);
    renderAppointments(list);
  } catch (err) {
    showToast('❌ Lỗi tải lịch hẹn: ' + err.message, 'error');
  }
}

// ── Render appointments section HTML ──
function renderAppointments(list) {
  const sec = document.getElementById('sec-appointments');
  if (!sec) return;

  const statusMap = {
    'CHO_XAC_NHAN':'badge-yellow', 'Chờ xác nhận':'badge-yellow',
    'DA_XAC_NHAN':'badge-blue',    'Đã xác nhận':'badge-blue',
    'DA_CHECK_IN':'badge-purple',  'Đã check-in':'badge-purple',
    'HOAN_THANH':'badge-green',    'Hoàn thành':'badge-green',
    'DA_HUY':'badge-red',          'Đã hủy':'badge-red',
  };

  sec.innerHTML = `
    <div class="section-header">
      <div class="section-title">📅 Quản lý Lịch Hẹn</div>
      <div class="section-count">${list.length} lịch hẹn hôm nay</div>
      <div style="margin-left:auto;display:flex;gap:10px">
        <input type="date" class="filter-select" id="aptDateFilter"
          value="${new Date().toISOString().split('T')[0]}"
          onchange="loadAndRenderAppointments(this.value)">
        <button class="btn btn-primary" onclick="modalAddAppointment()">+ Đặt lịch hẹn</button>
      </div>
    </div>

    <!-- Summary cards -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">
      ${[
        { label:'Chờ xác nhận', val: list.filter(a=>a.status?.includes('CHO_XAC_NHAN')||a.status?.includes('Chờ')).length, cls:'blue' },
        { label:'Đã xác nhận',  val: list.filter(a=>a.status?.includes('DA_XAC_NHAN')||a.status?.includes('xác nhận')).length, cls:'green' },
        { label:'Đã check-in',  val: list.filter(a=>a.status?.includes('CHECK_IN')||a.status?.includes('check-in')).length, cls:'purple' },
        { label:'Đã hủy',       val: list.filter(a=>a.status?.includes('DA_HUY')||a.status?.includes('hủy')).length, cls:'orange' },
      ].map(s => `
        <div class="stat-card ${s.cls}">
          <div class="stat-label">${s.label}</div>
          <div class="stat-value">${s.val}</div>
        </div>`).join('')}
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Mã LH</th><th>Bệnh nhân</th><th>Bác sĩ</th>
          <th>Ngày</th><th>Giờ</th><th>Lý do</th><th>Trạng thái</th><th>Thao tác</th>
        </tr></thead>
        <tbody>
          ${list.length === 0 ? `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text3)">📭 Không có lịch hẹn nào</td></tr>` : ''}
          ${list.map(a => {
            const statusLabel = a.status?.label || a.status || '—';
            const statusKey   = a.status?.name  || a.status || '';
            const bdg = statusMap[statusKey] || statusMap[statusLabel] || 'badge-gray';
            const date = a.appointmentDate ? formatDateDisplay(a.appointmentDate) : '—';
            const time = a.appointmentTime ? a.appointmentTime.substring(0,5) : '—';
            return `
              <tr>
                <td><span class="badge badge-gray mono">${a.appointmentCode || '—'}</span></td>
                <td>${a.patient?.fullName || a.patientName || '—'}</td>
                <td style="color:var(--text2)">${a.doctor?.fullName || a.doctorName || '—'}</td>
                <td>${date}</td>
                <td><strong>${time}</strong></td>
                <td style="color:var(--text2);max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.reason || '—'}</td>
                <td><span class="badge ${bdg}">${statusLabel}</span></td>
                <td>
                  <div style="display:flex;gap:4px">
                    ${!statusKey.includes('HOAN_THANH') && !statusKey.includes('DA_HUY') ? `
                      <button class="btn btn-success btn-sm" onclick="aptCheckIn(${a.id})">✅ Check-in</button>
                      <button class="btn btn-outline btn-sm" onclick="modalReschedule(${a.id})">📅 Đổi</button>
                      <button class="btn btn-danger btn-sm"  onclick="aptCancel(${a.id})">✕ Hủy</button>
                    ` : ''}
                  </div>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

function formatDateDisplay(isoDate) {
  if (!isoDate) return '—';
  const parts = isoDate.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : isoDate;
}

// ── Modal: Add appointment ──
async function modalAddAppointment() {
  // Load patients and doctors for selects
  let patients = DB.patients || [];
  let doctors  = DB.doctors  || [];

  openModal('📅 Đặt Lịch Hẹn Mới', `
    <div class="form-row">
      <div class="form-field">
        <label>Bệnh nhân *</label>
        <select id="apt-patient">
          <option value="">— Chọn bệnh nhân —</option>
          ${patients.map(p=>`<option value="${p._raw?.id || ''}">${p.name} — ${p.id}</option>`).join('')}
        </select>
      </div>
      <div class="form-field">
        <label>Bác sĩ *</label>
        <select id="apt-doctor">
          <option value="">— Chọn bác sĩ —</option>
          ${doctors.map(d=>`<option value="${d._raw?.id || ''}">${d.name} (${d.spec})</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-field">
        <label>Ngày hẹn *</label>
        <input type="date" id="apt-date" min="${new Date().toISOString().split('T')[0]}">
      </div>
      <div class="form-field">
        <label>Giờ hẹn *</label>
        <input type="time" id="apt-time" min="07:00" max="17:00" step="1800">
      </div>
    </div>
    <div class="form-field">
      <label>Lý do khám *</label>
      <input type="text" id="apt-reason" placeholder="Tái khám, kiểm tra sức khỏe...">
    </div>
    <div class="form-field">
      <label>Ghi chú</label>
      <textarea id="apt-notes" placeholder="Ghi chú thêm..."></textarea>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveAppointment()">📅 Đặt lịch</button>
    </div>
  `);
}

async function saveAppointment() {
  const patientId = document.getElementById('apt-patient')?.value;
  const doctorId  = document.getElementById('apt-doctor')?.value;
  const date      = document.getElementById('apt-date')?.value;
  const time      = document.getElementById('apt-time')?.value;
  const reason    = document.getElementById('apt-reason')?.value?.trim();
  const notes     = document.getElementById('apt-notes')?.value?.trim();

  if (!patientId) { showToast('Vui lòng chọn bệnh nhân!', 'error'); return; }
  if (!doctorId)  { showToast('Vui lòng chọn bác sĩ!', 'error'); return; }
  if (!date)      { showToast('Vui lòng chọn ngày hẹn!', 'error'); return; }
  if (!time)      { showToast('Vui lòng chọn giờ hẹn!', 'error'); return; }
  if (!reason)    { showToast('Vui lòng nhập lý do khám!', 'error'); return; }

  try {
    await AppointmentAPI.create({
      patientId: parseInt(patientId),
      doctorId:  parseInt(doctorId),
      appointmentDate: date,
      appointmentTime: time + ':00',
      reason,
      notes,
    });
    closeModal();
    showToast('✅ Đã đặt lịch hẹn thành công!', 'success');
    await loadAndRenderAppointments(date);
  } catch (err) {
    showToast('❌ ' + err.message, 'error');
  }
}

async function aptCheckIn(id) {
  try {
    await AppointmentAPI.checkIn(id);
    showToast('✅ Check-in thành công!', 'success');
    await loadAndRenderAppointments();
  } catch (err) { showToast('❌ ' + err.message, 'error'); }
}

async function aptCancel(id) {
  const reason = prompt('Lý do hủy lịch hẹn?', '');
  if (reason === null) return;
  try {
    await AppointmentAPI.cancel(id, reason);
    showToast('Đã hủy lịch hẹn', 'warning');
    await loadAndRenderAppointments();
  } catch (err) { showToast('❌ ' + err.message, 'error'); }
}

function modalReschedule(id) {
  openModal('📅 Đổi Lịch Hẹn', `
    <div class="form-row">
      <div class="form-field"><label>Ngày mới</label><input type="date" id="rs-date" min="${new Date().toISOString().split('T')[0]}"></div>
      <div class="form-field"><label>Giờ mới</label><input type="time" id="rs-time" step="1800"></div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveReschedule(${id})">💾 Xác nhận đổi lịch</button>
    </div>
  `);
}

async function saveReschedule(id) {
  const date = document.getElementById('rs-date')?.value;
  const time = document.getElementById('rs-time')?.value;
  if (!date || !time) { showToast('Vui lòng chọn ngày và giờ mới!', 'error'); return; }
  try {
    await AppointmentAPI.reschedule(id, date, time + ':00');
    closeModal();
    showToast('✅ Đã đổi lịch hẹn!', 'success');
    await loadAndRenderAppointments();
  } catch (err) { showToast('❌ ' + err.message, 'error'); }
}