/* ═══════════════════════════════════════════
   MedCore — prescription.js
   Prescription CRUD — Real API integration
═══════════════════════════════════════════ */

const PrescriptionAPI = {
  async getAll(patientId = null) {
    return api.get('/prescriptions', patientId ? { patientId } : {});
  },
  async getById(id)        { return api.get(`/prescriptions/${id}`); },
  async create(data)       { return api.post('/prescriptions', data); },
  async updateStatus(id, status) {
    return api.patch(`/prescriptions/${id}/status?status=${status}`);
  },
  async exportPdf(id) {
    return api.download(`/reports/export/prescription/${id}/pdf`, `prescription_${id}.pdf`);
  },
};

async function loadAndRenderPrescriptions() {
  showSectionLoading('sec-prescriptions');
  try {
    const list = await PrescriptionAPI.getAll();
    DB.prescriptions = list.map(mapRxFromApi);
    renderPrescriptions();
  } catch (err) {
    showToast('❌ Lỗi tải đơn thuốc: ' + err.message, 'error');
    renderPrescriptions();
  }
}

function mapRxFromApi(r) {
  return {
    id:       r.prescriptionCode || r.id,
    patient:  r.patient?.fullName || '—',
    doctor:   r.doctor?.fullName  || '—',
    date:     r.createdAt ? r.createdAt.split('T')[0].split('-').reverse().join('/') : '—',
    total:    r.totalAmount || 0,
    status:   r.status?.label || r.status || '—',
    diagnosis: r.diagnosis || '—',
    items:    (r.items || []).map(i => ({
      name:  i.medicine?.name || '—',
      qty:   i.quantity,
      price: i.unitPrice,
    })),
    _raw: r,
  };
}

async function saveRxFromModal() {
  const patientEl = document.getElementById('rx-patient');
  const doctorEl  = document.getElementById('rx-doctor');
  const diagEl    = document.getElementById('rx-diag');
  const medsEl    = document.getElementById('rx-meds');

  if (!patientEl?.value || !doctorEl?.value) {
    showToast('Vui lòng chọn bệnh nhân và bác sĩ!', 'error');
    return;
  }

  const selectedMedIds = Array.from(medsEl?.selectedOptions || []).map(o => parseInt(o.value));
  if (!selectedMedIds.length) {
    showToast('Vui lòng chọn ít nhất 1 loại thuốc!', 'error');
    return;
  }

  // Build prescription items with default qty=10
  const items = selectedMedIds.map(medId => {
    const med = DB.inventory.find(i => i._raw?.id === medId);
    return {
      medicine: { id: medId },
      quantity: 10,
      unitPrice: med?._raw?.unitPrice || 0,
    };
  });

  const patient = DB.patients.find(p => p.id === patientEl.value || p.patientCode === patientEl.value);
  const doctor  = DB.doctors.find(d => d.id === doctorEl.value  || d.doctorCode  === doctorEl.value);

  try {
    await PrescriptionAPI.create({
      patient: { id: patient?._raw?.id || parseInt(patientEl.value) },
      doctor:  { id: doctor?._raw?.id  || parseInt(doctorEl.value) },
      diagnosis: diagEl?.value || '',
      items,
    });
    closeModal();
    showToast('✅ Đã tạo đơn thuốc mới!', 'success');
    await loadAndRenderPrescriptions();
  } catch (err) {
    showToast('❌ ' + err.message, 'error');
  }
}

// ── Export prescription PDF ──
async function exportRxPdf(rawId) {
  try {
    showToast('📥 Đang xuất đơn thuốc...', 'default');
    await PrescriptionAPI.exportPdf(rawId);
  } catch (err) {
    showToast('❌ Lỗi xuất PDF: ' + err.message, 'error');
  }
}