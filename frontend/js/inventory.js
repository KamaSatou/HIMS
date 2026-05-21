/* ═══════════════════════════════════════════
   MedCore — inventory.js
   Medicine / Inventory — Real API integration
═══════════════════════════════════════════ */

const InventoryAPI = {
  async getAll(q = '', cat = '') {
    const params = {};
    if (q)   params.q        = q;
    if (cat) params.category = cat;
    return api.get('/medicines', params);
  },
  async getLowStock()       { return api.get('/medicines/low-stock'); },
  async create(data)        { return api.post('/medicines', data); },
  async update(id, data)    { return api.put(`/medicines/${id}`, data); },
  async restock(id, qty)    { return api.patch(`/medicines/${id}/restock?quantity=${qty}`); },
  async exportExcel() {
    const today = new Date().toISOString().split('T')[0];
    return api.download(`/reports/export/billing/excel?from=2026-01-01&to=${today}`, 'inventory_report.xlsx');
  },
};

async function loadAndRenderInventory(q = '', cat = '') {
  showSectionLoading('sec-inventory');
  try {
    const list = await InventoryAPI.getAll(q, cat);
    DB.inventory = list.map(mapMedFromApi);
    renderInventory(DB.inventory);
  } catch (err) {
    showToast('❌ Lỗi tải kho dược: ' + err.message, 'error');
    renderInventory(DB.inventory);
  }
}

function mapMedFromApi(m) {
  return {
    id:   m.medicineCode || m.id,
    name: m.name,
    cat:  m.category,
    qty:  m.quantity,
    max:  m.maxQuantity,
    exp:  m.expiryDate ? m.expiryDate.split('-').reverse().join('/') : null,
    price: m.unitPrice,
    unit: m.unit,
    _raw: m,
  };
}

async function saveInventory() {
  const name     = document.getElementById('i-name')?.value?.trim();
  const cat      = document.getElementById('i-cat')?.value;
  const unit     = document.getElementById('i-unit')?.value;
  const qty      = parseInt(document.getElementById('i-qty')?.value) || 0;
  const price    = parseFloat(document.getElementById('i-price')?.value) || 0;
  const exp      = document.getElementById('i-exp')?.value; // yyyy-MM
  const supplier = document.getElementById('i-supplier')?.value?.trim();

  if (!name) { showToast('Vui lòng nhập tên sản phẩm!', 'error'); return; }
  if (qty <= 0) { showToast('Số lượng phải lớn hơn 0!', 'error'); return; }

  try {
    await InventoryAPI.create({
      name,
      category:    cat,
      unit,
      quantity:    qty,
      maxQuantity: qty * 2,
      unitPrice:   price,
      expiryDate:  exp ? exp + '-01' : null,
      supplier,
    });
    closeModal();
    showToast(`✅ Đã nhập kho: ${name}`, 'success');
    await loadAndRenderInventory();
  } catch (err) {
    showToast('❌ ' + err.message, 'error');
  }
}

async function restockMedicine(rawId, currentName) {
  const qty = parseInt(prompt(`Nhập số lượng cần thêm cho "${currentName}":`, '100'));
  if (!qty || qty <= 0) return;
  try {
    await InventoryAPI.restock(rawId, qty);
    showToast(`✅ Đã nhập thêm ${qty} đơn vị!`, 'success');
    await loadAndRenderInventory();
  } catch (err) {
    showToast('❌ ' + err.message, 'error');
  }
}

let invSearchTimeout;
function filterInventory(q) {
  clearTimeout(invSearchTimeout);
  invSearchTimeout = setTimeout(() => loadAndRenderInventory(q), 400);
}
function filterInventoryCat(cat) { loadAndRenderInventory('', cat); }