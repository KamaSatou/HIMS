/* ═══════════════════════════════════════════
   MedCore — patient.js
   Patient CRUD — Real API integration
   Replaces mock data from data.js
═══════════════════════════════════════════ */

const PatientAPI = {

  /* GET /api/patients or /api/patients?q=keyword */
  async getAll(query = '') {
    const params = query ? { q: query } : {};
    return api.get('/patients', params);
  },

  /* GET /api/patients/:id */
  async getById(id) {
    return api.get(`/patients/${id}`);
  },

  /* POST /api/patients */
  async create(data) {
    return api.post('/patients', data);
  },

  /* PUT /api/patients/:id */
  async update(id, data) {
    // try {
    //   console.info(data);
    //   return api.put(`/patients/${id}`, data);
    // } catch (error) {
    //   console.info(error)
    // }
    const currentPatient = await api.get(`/patients/${id}`);
    console.info(data);
    console.info(currentPatient);
    console.info(currentPatient.dob);
    Object.assign(currentPatient,data);
    console.info(currentPatient);
    return api.put(`/patients/${id}`, currentPatient);
  },

  /* PATCH /api/patients/:id/status */
  async updateStatus(id, status) {
    return api.patch(`/patients/${id}/status?status=${status}`);
  },

  /* DELETE /api/patients/:id */
  async delete(id) {
    return api.delete(`/patients/${id}`);
  },
};

// ── Render patients section from API ──
async function loadAndRenderPatients(query = '') {
  // showSectionLoading('sec-patients');
  try {
    const patients = await PatientAPI.getAll(query);

    // Sync into local DB cache for renders that still reference DB.patients
    DB.patients = patients.map(mapPatientFromApi);

    renderPatients(DB.patients);
    pt = document.getElementById('badgePatients');
    if (pt){
      pt.textContent = DB.patients.length;
    }
  } catch (err) {
    showToast('❌ Lỗi tải danh sách bệnh nhân: ' + err.message, 'error');
    // Fall back to existing cached data
    renderPatients(DB.patients);
  }
}

// ── Map API response shape → UI shape ──
function mapPatientFromApi(p) {
  return {
    rawId:   p.id,
    patientCode: p.patientCode,

    // render.js vẫn dùng id = BN001
    id:      p.patientCode,

    name:    p.fullName,
    dob:     p.dateOfBirth ? formatDateFromIso(p.dateOfBirth) : '—',
    gender:  p.gender,
    cccd:    p.cccd || '—',
    phone:   p.phone || '—',
    spec:    p.specialty || '—',
    doctor:  p.doctorName || '—',
    status:  p.status?.label || p.status || '—',
    visits:  p.totalVisits || 0,
    address: p.address || '—',
    _raw:    p,
  };
}

function formatDateFromIso(isoDate) {
  if (!isoDate) return '—';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

// ── Override saveNewPatient to call real API ──
async function saveNewPatient() {
  const name   = document.getElementById('f-name')?.value?.trim();
  const cccd   = document.getElementById('f-cccd')?.value?.trim();
  const dob    = document.getElementById('f-dob')?.value;
  const gender = document.getElementById('f-gender')?.value;
  const phone  = document.getElementById('f-phone')?.value?.trim();
  const spec   = document.getElementById('f-spec')?.value;
  const addr   = document.getElementById('f-addr')?.value?.trim();

  if (!name)  { showToast('Vui lòng nhập họ tên bệnh nhân!', 'error'); return; }
  if (!dob)   { showToast('Vui lòng nhập ngày sinh!', 'error'); return; }

  const btn = document.querySelector('#modalBody .btn-primary');
  if (btn) { btn.textContent = '⏳ Đang lưu...'; btn.disabled = true; }

  try {
    await PatientAPI.create({
      fullName:    name,
      dateOfBirth: dob,
      gender,
      cccd,
      phone,
      address:     addr,
      status:      'DANG_CHO',
    });

    closeModal();
    showToast(`✅ Đã thêm bệnh nhân ${name}!`, 'success');
    await loadAndRenderPatients();

  } catch (err) {
    showToast('❌ ' + err.message, 'error');
    if (btn) { btn.textContent = '💾 Lưu hồ sơ'; btn.disabled = false; }
  }
}

// ── Override updatePatient to call real API ──
async function updatePatient(id) {
  const rawId = DB.patients.find(p => p.id === id)?.rawId;
  if (!rawId) { showToast('Không tìm thấy ID bệnh nhân!', 'error'); return; }

  const name   = document.getElementById('e-name')?.value;
  const phone  = document.getElementById('e-phone')?.value;
  const status = document.getElementById('e-status')?.value;

  // Map label back to enum key
  const statusMap = { 'Đang chờ':'DANG_CHO','Đang khám':'DANG_KHAM','Hoàn thành':'HOAN_THANH','Nhập viện':'NHAP_VIEN' };

  try {
    await PatientAPI.update(rawId, { fullName: name, phone, status: statusMap[status] || status });
    closeModal();
    showToast('✅ Đã cập nhật hồ sơ!', 'success');
    await loadAndRenderPatients();
  } catch (err) {
    showToast('❌ ' + err.message, 'error');
  }
}

// ── Override deletePatient to call real API ──
async function deletePatient(id) {
  if (!confirm(`Xác nhận xóa bệnh nhân ${id}?`)) return;
  const rawId = DB.patients.find(p => p.id === id)?.rawId;
  if (!rawId) return;

  try {
    await PatientAPI.delete(rawId);
    showToast(`Đã xóa bệnh nhân ${id}`, 'warning');
    await loadAndRenderPatients();
  } catch (err) {
    showToast('❌ ' + err.message, 'error');
  }
}

// ── Search handler ──
let patientSearchTimeout;
function onPatientSearch(input) {
  clearTimeout(patientSearchTimeout);
  patientSearchTimeout = setTimeout(() => {
    loadAndRenderPatients(input.value.trim());
  }, 400);
}