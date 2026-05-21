/* ═══════════════════════════════════════════
   MedCore — reports.js
   Reports & Export — Real API integration
═══════════════════════════════════════════ */

const ReportAPI = {
  async getStats()           { return api.get('/reports/stats'); },
  async exportPatientsPdf()  { return api.download('/reports/export/patients/pdf', 'patients.pdf'); },
  async exportPatientsExcel(){ return api.download('/reports/export/patients/excel', 'patients.xlsx'); },
  async exportAppointmentsPdf(date) {
    return api.download(`/reports/export/appointments/pdf?date=${date}`, 'appointments.pdf');
  },
  async exportBillingExcel(from, to) {
    return api.download(`/reports/export/billing/excel?from=${from}&to=${to}`, 'billing_report.xlsx');
  },
};

async function loadAndRenderReports() {
  renderReports(); // render shell first
  try {
    const stats = await ReportAPI.getStats();
    // Update stat cards with real numbers
    updateReportStats(stats);
    initReportCharts();
  } catch (err) {
    console.warn('Reports stats error:', err.message);
    initReportCharts(); // show charts with mock data
  }
}

function updateReportStats(stats) {
  const mapping = {
    'stat-total-patients':   stats.totalPatients,
    'stat-today-revenue':    stats.todayRevenue ? (stats.todayRevenue / 1000000).toFixed(1) + ' Triệu' : '—',
    'stat-prescriptions':    stats.totalPrescriptions || '—',
    'stat-satisfaction':     '4.8/5',
  };
  Object.entries(mapping).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
}

/* ── Real export functions (replaces mock) ── */
async function exportPDF() {
  const section = AppState?.currentSection;
  try {
    showToast('📥 Đang xuất PDF...', 'default');
    if (section === 'patients') {
      await ReportAPI.exportPatientsPdf();
    } else if (section === 'appointments') {
      const date = new Date().toISOString().split('T')[0];
      await ReportAPI.exportAppointmentsPdf(date);
    } else {
      await ReportAPI.exportPatientsPdf(); // default
    }
    showToast('✅ Xuất PDF thành công!', 'success');
  } catch (err) {
    showToast('❌ Lỗi xuất PDF: ' + err.message, 'error');
  }
}

async function exportExcel() {
  const today = new Date().toISOString().split('T')[0];
  const from  = today.substring(0,8) + '01';
  try {
    showToast('📊 Đang xuất Excel...', 'default');
    const section = AppState?.currentSection;
    if (section === 'patients') {
      await ReportAPI.exportPatientsExcel();
    } else {
      await ReportAPI.exportBillingExcel(from, today);
    }
    showToast('✅ Xuất Excel thành công!', 'success');
  } catch (err) {
    showToast('❌ Lỗi xuất Excel: ' + err.message, 'error');
  }
}