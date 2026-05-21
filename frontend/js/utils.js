/* ═══════════════════════════════════════════
   MedCore — utils.js
   Tiện ích: Toast, Modal, Filter, Export
═══════════════════════════════════════════ */

/* ── TOAST NOTIFICATION ── */
function showToast(msg, type = 'default') {
  const colors = {
    default: '#0F172A',
    success: '#059669',
    error:   '#DC2626',
    warning: '#D97706',
  };
  const t = document.createElement('div');
  t.className = 'toast';
  t.style.background = colors[type] || colors.default;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => t.classList.add('show'));
  });
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

/* ── MODAL ── */
function openModal(title, bodyHtml) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay').classList.remove('open');
  }
}

/* ── FILTER TABLE (full-text search) ── */
function filterTable(inputEl, tableId) {
  const q = inputEl.value.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(tr => {
    tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

/* ── FILTER TABLE BY COLUMN ── */
function filterTableByCol(selectEl, tableId, colIndex) {
  const q = selectEl.value.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(tr => {
    const cell = tr.cells[colIndex];
    const match = !q || (cell && cell.textContent.toLowerCase().includes(q));
    tr.style.display = match ? '' : 'none';
  });
}

/* ── FORMAT CURRENCY (VND) ── */
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

/* ── FORMAT DATE ── */
function formatDate(date) {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

/* ── GET CURRENT DATETIME STRING ── */
function getCurrentDateStr() {
  const d   = new Date();
  const day = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'][d.getDay()];
  const dd  = String(d.getDate()).padStart(2,'0');
  const mm  = String(d.getMonth()+1).padStart(2,'0');
  const yy  = d.getFullYear();
  const hh  = String(d.getHours()).padStart(2,'0');
  const min = String(d.getMinutes()).padStart(2,'0');
  return `${day}, ${dd}/${mm}/${yy} — ${hh}:${min}`;
}

/* ── GENERATE ID ── */
function genId(prefix, list) {
  const max = list.reduce((acc, item) => {
    const n = parseInt(item.id.replace(prefix,'')) || 0;
    return n > acc ? n : acc;
  }, 0);
  return `${prefix}${String(max + 1).padStart(3,'0')}`;
}

/* ── EXPORT PDF (mock) ── */
function exportPDF() {
  showToast('📥 Đang xuất file... Vui lòng chờ!');
  // TODO: tích hợp thư viện jsPDF hoặc gọi API backend /api/export/pdf
  // import jsPDF from 'jspdf';
  // const doc = new jsPDF(); doc.text('MedCore Report', 10, 10); doc.save('report.pdf');
}

/* ── EXPORT EXCEL (mock) ── */
function exportExcel() {
  showToast('📊 Đang xuất Excel...');
  // TODO: tích hợp SheetJS (xlsx)
  // import * as XLSX from 'xlsx';
  // const ws = XLSX.utils.json_to_sheet(data);
  // const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  // XLSX.writeFile(wb, 'medcore_export.xlsx');
}

/* ── STATUS BADGE MAP ── */
const STATUS_CLASS = {
  'Đang chờ':    'badge-yellow',
  'Đang khám':   'badge-blue',
  'Hoàn thành':  'badge-green',
  'Nhập viện':   'badge-purple',
  'Nghỉ':        'badge-gray',
  'Sẵn sàng':   'badge-green',
  'Đã cấp phát': 'badge-green',
  'Chờ duyệt':   'badge-yellow',
  'Đang pha chế':'badge-blue',
};

function badge(text, cls) {
  return `<span class="badge ${cls || STATUS_CLASS[text] || 'badge-gray'}">${text}</span>`;
}

function actionBtns(...btns) {
  return `<div style="display:flex;gap:6px">${btns.join('')}</div>`;
}