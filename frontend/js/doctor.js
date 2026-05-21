/* ═══════════════════════════════════════════
   MedCore — doctor.js
   Doctor CRUD — Real API integration
═══════════════════════════════════════════ */

const DoctorAPI = {
  async getAll(specialty = '') {
    const params = specialty ? { specialty } : {};
    return api.get('/doctors', params);
  },

  async getById(id)        { return api.get(`/doctors/${id}`); },

  async create(data)       { return api.post('/doctors', data); },

  async update(id, data)   { return api.put(`/doctors/${id}`, data); },

  async updateStatus(id, status) {
    return api.patch(`/doctors/${id}/status?status=${status}`);
  },

  async delete(id)         { return api.delete(`/doctors/${id}`); },
};

async function loadAndRenderDoctors(specialty = '') {
  // showSectionLoading('sec-doctors');
  try {
    const doctors = await DoctorAPI.getAll(specialty);
    DB.doctors = doctors.map(mapDoctorFromApi);
    renderDoctors(DB.doctors);
  } catch (err) {
    showToast('❌ Lỗi tải danh sách bác sĩ: ' + err.message, 'error');
    renderDoctors(DB.doctors);
  }
}

function mapDoctorFromApi(d) {
  return {
    rawId:  d.id,
    id:     d.doctorCode,
    name:   d.fullName,
    spec:   d.specialty,
    degree: d.degree || '—',
    shift:  d.shift?.label || d.shift || '—',
    status: d.status?.label || d.status || '—',
    phone:  d.phone || '—',
    email:  d.email || '—',
    _raw:   d,
  };
}

async function saveNewDoctor() {
  const name   = document.getElementById('d-name')?.value?.trim();
  const degree = document.getElementById('d-degree')?.value;
  const spec   = document.getElementById('d-spec')?.value;
  const shift  = document.getElementById('d-shift')?.value;
  const email  = document.getElementById('d-email')?.value?.trim();
  const phone  = document.getElementById('d-phone')?.value?.trim();

  if (!name) { showToast('Vui lòng nhập tên bác sĩ!', 'error'); return; }

  const shiftMap = { 'Ca sáng':'CA_SANG','Ca chiều':'CA_CHIEU','Ca trực đêm':'CA_TRUC_DEM' };

  try {
    console.info({ fullName: name, degree, specialty: spec, shift: shiftMap[shift] || 'CA_SANG', email, phone });
    await DoctorAPI.create({ fullName: name, degree, specialty: spec, shift: shiftMap[shift] || 'CA_SANG', email, phone });
    closeModal();
    showToast(`✅ Đã thêm bác sĩ ${name}!`, 'success');
    await loadAndRenderDoctors();
  } catch (err) {
    showToast('❌ ' + err.message, 'error');
  }
}

async function updateDoctor(id) {
  const rawId = DB.doctors.find(d => d.id === id)?.rawId;
  console.info(id);
  console.info(rawId);
  if (!rawId) { showToast('Không tìm thấy ID bệnh nhân!', 'error'); return; }

  const name   = document.getElementById('doc-name')?.value;
  const degree = document.getElementById('doc-degress')?.value;
  const spec   = document.getElementById('doc-spec')?.value;
  const status = document.getElementById('doc-status')?.value;
  console.info(status);

  // Map label back to enum key
  const statusMap = { 'Đang khám':'DANG_KHAM', 'Sẵn sàng':'SAN_SANG', 'Nghỉ':'NGHI' };

  try {
    await DoctorAPI.update(rawId, { fullName: name, degree: degree, status: statusMap[status] || status , specialty:spec});
    closeModal();
    showToast('✅ Đã cập nhật hồ sơ!', 'success');
    await loadAndRenderDoctors();
  } catch (err) {
    showToast('❌ ' + err.message, 'error');
  }
}

async function deleteDoctor(id) {
  if (!confirm(`Xác nhận xóa bệnh nhân ${id}?`)) return;
  const rawId = DB.doctors.find(d => d.id === id)?.rawId;
  if (!rawId) return;

  try {
    await DoctorAPI.delete(rawId);
    showToast(`Đã xóa bác sĩ ${id}`, 'warning');
    await loadAndRenderDoctors();
  } catch (err) {
    showToast('❌ ' + err.message, 'error');
  }
}

async function filterDoctors(spec) {
  await loadAndRenderDoctors(spec);
}