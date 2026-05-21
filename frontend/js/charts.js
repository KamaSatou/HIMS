/* ═══════════════════════════════════════════
   MedCore — charts.js
   Tất cả biểu đồ Chart.js
═══════════════════════════════════════════ */

const Charts = {};

function getChartTheme() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    grid:  dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    text:  dark ? '#64748B' : '#94A3B8',
    font:  'Plus Jakarta Sans',
  };
}

function baseScales(th) {
  return {
    x: { grid: { color: th.grid }, ticks: { color: th.text, font: { family: th.font, size: 11 } } },
    y: { grid: { color: th.grid }, ticks: { color: th.text, font: { family: th.font, size: 11 } } },
  };
}

/* ── Biểu đồ cột: Lượt khám theo ngày ── */
function initChartWeek() {
  const el = document.getElementById('chartWeek');
  if (!el) return;
  if (Charts.week) Charts.week.destroy();
  const th = getChartTheme();
  Charts.week = new Chart(el, {
    type: 'bar',
    data: {
      labels: DB.chartData.weekLabels,
      datasets: [
        { label: 'Tuần này',    data: DB.chartData.weeklyVisits, backgroundColor: 'rgba(14,165,233,0.75)', borderRadius: 8, borderSkipped: false },
        { label: 'Tuần trước', data: DB.chartData.weeklyVisits.map(v => Math.round(v * 0.85)), backgroundColor: 'rgba(6,182,212,0.25)', borderRadius: 8, borderSkipped: false },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true, position: 'top', labels: { color: th.text, font: { family: th.font, size: 11 }, boxWidth: 12 } } },
      scales: baseScales(th),
    },
  });
}

/* ── Biểu đồ donut: Phân bố chuyên khoa ── */
function initChartSpec() {
  const el = document.getElementById('chartSpec');
  if (!el) return;
  if (Charts.spec) Charts.spec.destroy();
  const th = getChartTheme();
  Charts.spec = new Chart(el, {
    type: 'doughnut',
    data: {
      labels: DB.chartData.specLabels,
      datasets: [{ data: DB.chartData.specDist, backgroundColor: ['#0EA5E9','#10B981','#F59E0B','#8B5CF6','#EF4444','#06B6D4'], borderWidth: 0, hoverOffset: 8 }],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: th.text, font: { family: th.font, size: 11 }, padding: 12 } } },
      cutout: '65%',
    },
  });
}

/* ── Biểu đồ ngang: Top thuốc tiêu thụ ── */
function initChartMeds() {
  const el = document.getElementById('chartMeds');
  if (!el) return;
  if (Charts.meds) Charts.meds.destroy();
  const th = getChartTheme();
  Charts.meds = new Chart(el, {
    type: 'bar',
    data: {
      labels: DB.chartData.topMedLabels,
      datasets: [{ data: DB.chartData.topMeds, backgroundColor: ['#10B981','#0EA5E9','#F59E0B','#8B5CF6','#EF4444'], borderRadius: 6, borderSkipped: false }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: baseScales(th),
    },
  });
}

/* ── Biểu đồ đường: Doanh thu theo tháng ── */
function initChartRevenue() {
  const el = document.getElementById('chartRevenue');
  if (!el) return;
  if (Charts.rev) Charts.rev.destroy();
  const th = getChartTheme();
  Charts.rev = new Chart(el, {
    type: 'line',
    data: {
      labels: DB.chartData.monthLabels,
      datasets: [{
        label: 'Doanh thu (Tỷ VND)',
        data: DB.chartData.monthlyRevenue,
        borderColor: '#0EA5E9', backgroundColor: 'rgba(14,165,233,0.08)',
        tension: 0.4, fill: true, borderWidth: 2,
        pointBackgroundColor: '#0EA5E9', pointRadius: 4,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        ...baseScales(th),
        y: { ...baseScales(th).y, ticks: { ...baseScales(th).y.ticks, callback: v => v + ' Tỷ' } },
      },
    },
  });
}

/* ── Biểu đồ đường: Xu hướng bệnh nhân ── */
function initChartPatientTrend() {
  const el = document.getElementById('chartPatientTrend');
  if (!el) return;
  if (Charts.pt) Charts.pt.destroy();
  const th = getChartTheme();
  Charts.pt = new Chart(el, {
    type: 'line',
    data: {
      labels: DB.chartData.monthLabels,
      datasets: [{
        label: 'Bệnh nhân',
        data: DB.chartData.patientTrend,
        borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.08)',
        tension: 0.4, fill: true, borderWidth: 2,
        pointBackgroundColor: '#10B981', pointRadius: 4,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: baseScales(th),
    },
  });
}

/* ── Init tất cả charts Dashboard ── */
function initDashboardCharts() {
  setTimeout(() => {
    initChartWeek();
    initChartSpec();
    initChartMeds();
  }, 100);
}

/* ── Init charts báo cáo ── */
function initReportCharts() {
  setTimeout(() => {
    initChartRevenue();
    initChartPatientTrend();
  }, 100);
}

/* ── Cập nhật màu khi đổi theme ── */
function updateAllCharts() {
  setTimeout(() => {
    initChartWeek();
    initChartSpec();
    initChartMeds();
    const revEl = document.getElementById('chartRevenue');
    const ptEl  = document.getElementById('chartPatientTrend');
    if (revEl && revEl.offsetParent) initChartRevenue();
    if (ptEl  && ptEl.offsetParent)  initChartPatientTrend();
  }, 100);
}