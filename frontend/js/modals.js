/* ═══════════════════════════════════════════
   MedCore — modals.js
   Tất cả hộp thoại Modal
═══════════════════════════════════════════ */

/* ══ XEM HỒ SƠ BỆNH NHÂN ══ */
function modalViewPatient(id) {
  const p = DB.patients.find(x => x.id === id);
  if (!p) return;
  openModal(`🧑‍⚕️ Hồ sơ — ${p.name}`, `
    <div class="patient-hero" style="margin-bottom:20px">
      <div class="patient-avatar-big">🧑</div>
      <div class="patient-hero-info">
        <h2>${p.name}</h2>
        <p>${p.id} · ${p.gender} · ${p.dob}</p>
        <p style="margin-top:4px">📞 ${p.phone} · 🪪 ${p.cccd}</p>
        <p style="margin-top:6px">${badge(p.spec,'badge-blue')} ${badge(p.status)}</p>
      </div>
      <div class="patient-hero-stats">
        <div class="phero-stat"><div class="val">${p.visits}</div><div class="lbl">Lần khám</div></div>
        <div class="phero-stat"><div class="val">3</div><div class="lbl">Đơn thuốc</div></div>
        <div class="phero-stat"><div class="val">4.8</div><div class="lbl">Đánh giá</div></div>
      </div>
    </div>
    <div class="chart-title" style="margin-bottom:12px">📋 Lịch sử khám bệnh</div>
    <div class="timeline">
      <div class="tl-item">
        <div class="tl-date">16/05/2026</div>
        <div class="tl-content">
          <div class="tl-title">Khám ${p.spec} — ${p.doctor}</div>
          <div class="tl-body">Chẩn đoán: Tăng huyết áp độ 1. Kê đơn: Amlodipine 5mg, Metformin 500mg.</div>
        </div>
      </div>
      <div class="tl-item">
        <div class="tl-date">02/04/2026</div>
        <div class="tl-content">
          <div class="tl-title">Tái khám — ${p.doctor}</div>
          <div class="tl-body">Huyết áp ổn định. Duy trì phác đồ điều trị cũ.</div>
        </div>
      </div>
      <div class="tl-item">
        <div class="tl-date">15/02/2026</div>
        <div class="tl-content">
          <div class="tl-title">Khám lần đầu — ${p.doctor}</div>
          <div class="tl-body">Nhập viện với triệu chứng đau ngực, khó thở. Chụp X-quang, xét nghiệm máu.</div>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px">
      <button class="btn btn-outline" onclick="exportPDF()">🖨️ In hồ sơ</button>
      <button class="btn btn-primary" onclick="modalEditPatient('${p.id}');closeModal()">✏️ Chỉnh sửa</button>
    </div>
  `);
}

/* ══ THÊM BỆNH NHÂN ══ */
function modalAddPatient() {
  openModal('➕ Thêm Bệnh Nhân Mới', `
    <div class="form-row">
      <div class="form-field"><label>Họ & Tên *</label><input id="f-name" placeholder="Nguyễn Văn A"></div>
      <div class="form-field"><label>CCCD / Passport *</label><input id="f-cccd" placeholder="079..."></div>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Ngày sinh</label><input id="f-dob" type="date"></div>
      <div class="form-field"><label>Giới tính</label>
        <select id="f-gender"><option>Nam</option><option>Nữ</option></select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Số điện thoại</label><input id="f-phone" placeholder="0912..."></div>
      <div class="form-field"><label>Chuyên khoa</label>
        <select id="f-spec">
          <option>Tim Mạch</option>
          <option>Nội Khoa</option>
          <option>Ngoại Khoa</option>
          <option>Mắt</option>
          <option>Nha Khoa</option>
          <option>Thần Kinh</option>
          <option>Cơ Xương Khớp</option>
        </select>
      </div>
    </div>
    <div class="form-field"><label>Địa chỉ</label><input id="f-addr" placeholder="Số nhà, đường, phường/xã..."></div>
    <div class="form-field"><label>Lý do đến khám</label><textarea id="f-reason" placeholder="Mô tả triệu chứng..."></textarea></div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveNewPatient()">💾 Lưu hồ sơ</button>
    </div>
  `);
}

function saveNewPatient() {
  const name = document.getElementById('f-name')?.value?.trim();
  if (!name) { showToast('Vui lòng nhập họ tên bệnh nhân!', 'error'); return; }
  const newPatient = {
    id:     genId('BN', DB.patients),
    name,
    dob:    document.getElementById('f-dob')?.value || '01/01/2000',
    gender: document.getElementById('f-gender')?.value || 'Nam',
    cccd:   document.getElementById('f-cccd')?.value || '—',
    phone:  document.getElementById('f-phone')?.value || '—',
    // spec:   document.getElementById('f-spec')?.value || 'Nội Khoa',
    doctor: DB.doctors.find(d => d.spec === document.getElementById('f-spec')?.value)?.name || '—',
    status: 'Đang chờ',
    visits: 0,
    address: document.getElementById('f-addr')?.value || '—',
  };
  DB.patients.unshift(newPatient);
  closeModal();
  renderPatients();
  showToast(`✅ Đã thêm bệnh nhân ${name}!`, 'success');
}

/* ══ SỬA BỆNH NHÂN ══ */
function modalEditPatient(id) {
  const p = DB.patients.find(x => x.id === id);
  if (!p) return;
  openModal(`✏️ Chỉnh sửa — ${p.name}`, `
    <div class="form-row">
      <div class="form-field"><label>Họ & Tên</label><input id="e-name" value="${p.name}"></div>
      <div class="form-field"><label>Số điện thoại</label><input id="e-phone" value="${p.phone}"></div>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Chuyên khoa</label>
        <select id="e-spec">
          <option>Tim Mạch</option>
          <option>Nội Khoa</option>
          <option>Ngoại Khoa</option>
          <option>Mắt</option>
          <option>Nha Khoa</option>
          <option>Thần Kinh</option>
          <option>Cơ Xương Khớp</option>
        </select>
      </div>
      <div class="form-field"><label>Trạng thái</label>
        <select id="e-status">
          ${['Đang chờ','Đang khám','Hoàn thành','Nhập viện'].map(s=>`<option ${s===p.status?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="updatePatient('${id}')">💾 Lưu thay đổi</button>
    </div>
  `);
}

function updatePatient(id) {
  const p = DB.patients.find(x => x.id === id);
  if (!p) return;
  p.name   = document.getElementById('e-name').value;
  p.phone  = document.getElementById('e-phone').value;
  // p.spec   = document.getElementById('e-spec').value;
  p.status = document.getElementById('e-status').value;
  closeModal();
  renderPatients();
  showToast('✅ Đã cập nhật hồ sơ!', 'success');
}

/* ══ SỬA Bac Si ══ */
function modalEditDoctor(id) {
  const d = DB.doctors.find(x => x.id === id);
  if (!d) return;
  openModal(`✏️ Chỉnh sửa — ${d.name}`, `
    <div class="form-row">
      <div class="form-field"><label>Họ & Tên</label><input id="doc-name" value="${d.name}"></div>
      <div class="form-field"><label>Học hàm</label>
        <select id="doc-degree">
          <option>BSCKI</option>
          <option>BSCKII</option>
          <option>ThS.BS</option>
          <option>TS.BS</option>
          <option>PGS.TS.BS</option>
          <option>GS.TS.BS</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Chuyên khoa</label>
        <select id="doc-spec">
          <option>Tim Mạch</option>
          <option>Nội Khoa</option>
          <option>Ngoại Khoa</option>
          <option>Mắt</option>
          <option>Nha Khoa</option>
          <option>Thần Kinh</option>
          <option>Cơ Xương Khớp</option>
        </select>
      </div>
      <div class="form-field"><label>Trạng thái</label>
        <select id="doc-status">
          ${['Đang khám','Sẵn sàng','Nghỉ'].map(s=>`<option ${s===d.status?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="updateDoctor('${id}')">💾 Lưu thay đổi</button>
    </div>
  `);
}

function updateDoctor(id) {
  const d = DB.doctors.find(x => x.id === id);
  if (!d) return;
  d.name   = document.getElementById('doc-name').value;
  d.spec   = document.getElementById('doc-spec').value;
  d.degree = document.getElementById('doc-degree').value;
  d.status = document.getElementById('doc-status').value;
  closeModal();
  renderDoctors();
  showToast('✅ Đã cập nhật hồ sơ!', 'success');
}

/* ══ XÓA BỆNH NHÂN ══ */
function deletePatient(id) {
  if (!confirm(`Xác nhận xóa bệnh nhân ${id}?`)) return;
  const idx = DB.patients.findIndex(p => p.id === id);
  if (idx > -1) {
    DB.patients.splice(idx, 1);
    renderPatients();
    showToast(`Đã xóa bệnh nhân ${id}`, 'warning');
  }
}
/* ══ XÓA DOKuTAH ══ */
function deleteDoctor(id) {
  if (!confirm(`Xác nhận xóa bệnh nhân ${id}?`)) return;
  const idx = DB.doctors.findIndex(d => d.id === id);
  if (idx > -1) {
    DB.doctors.splice(idx, 1);
    renderDoctors();
    showToast(`Đã xóa bệnh nhân ${id}`, 'warning');
  }
}

/* ══ THÊM BÁC SĨ ══ */
function modalAddDoctor() {
  openModal('➕ Thêm Bác Sĩ / Nhân Viên', `
    <div class="form-row">
      <div class="form-field"><label>Họ & Tên *</label><input id="d-name" placeholder="BS. Nguyễn Văn A"></div>
      <div class="form-field"><label>Học hàm</label>
        <select id="d-degree"><option>BSCKI</option><option>BSCKII</option><option>ThS.BS</option><option>TS.BS</option><option>PGS.TS.BS</option><option>GS.TS.BS</option></select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Chuyên khoa</label>
        <select id="d-spec">
          <option>Tim Mạch</option>
          <option>Nội Khoa</option>
          <option>Ngoại Khoa</option>
          <option>Mắt</option>
          <option>Nha Khoa</option>
          <option>Thần Kinh</option>
          <option>Cơ Xương Khớp</option>
        </select>
      </div>
      <div class="form-field"><label>Ca làm việc</label>
        <select id="d-shift"><option>Ca sáng</option><option>Ca chiều</option><option>Ca trực đêm</option></select>
      </div>
    </div>
    <div class="form-field"><label>Email</label><input id="d-email" placeholder="bsnguyenvana@bvphucyen.vn"></div>
    <div class="form-field"><label>Điện thoại</label><input id="d-phone" placeholder="0901..."></div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveNewDoctor()">💾 Lưu</button>
    </div>
  `);
}

function saveNewDoctor() {
  const name = document.getElementById('d-name')?.value?.trim();
  if (!name) { showToast('Vui lòng nhập tên bác sĩ!', 'error'); return; }
  DB.doctors.push({
    id:     genId('BS', DB.doctors),
    name,
    degree: document.getElementById('d-degree').value,
    spec:   document.getElementById('d-spec').value,
    shift:  document.getElementById('d-shift').value,
    phone:  document.getElementById('d-phone').value,
    email:  document.getElementById('d-email').value,
    status: 'Sẵn sàng',
  });
  closeModal();
  renderDoctors();
  showToast(`✅ Đã thêm bác sĩ ${name}!`, 'success');
}

/* ══ TIẾP NHẬN HÀNG ĐỢI ══ */
function modalAddQueue() {
  openModal('🔢 Tiếp Nhận Bệnh Nhân', `
    <div class="form-field"><label>Bệnh nhân</label>
      <select id="q-patient">
        ${DB.patients.map(p=>`<option value="${p.id}">${p.name} — ${p.id}</option>`).join('')}
      </select>
    </div>
    <div class="form-field"><label>Phòng khám / Chuyên khoa</label>
      <select id="q-room">
        ${DB.queue.map(q=>`<option value="${q.room}">${q.room} (${q.spec})</option>`).join('')}
      </select>
    </div>
    <div class="form-field"><label>Mức độ ưu tiên</label>
      <select id="q-priority">
        <option value="normal">Thường</option>
        <option value="high">Ưu tiên (Thai phụ / Trẻ em / Người cao tuổi)</option>
        <option value="emergency">🚨 Cấp cứu</option>
      </select>
    </div>
    <div class="form-field"><label>Ghi chú</label>
      <textarea id="q-note" placeholder="Triệu chứng ban đầu..."></textarea>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveQueue()">✅ Xác nhận tiếp nhận</button>
    </div>
  `);
}

function saveQueue() {
  const roomName = document.getElementById('q-room').value;
  const q = DB.queue.find(x => x.room === roomName);
  const p = DB.patients.find(x => x.id === document.getElementById('q-patient').value);
  if (q && p) {
    const nextNum = String(parseInt(q.current) + q.waiting.length + 1).padStart(3,'0');
    q.waiting.push({ n: nextNum, name: p.name, t: `~${(q.waiting.length+1)*8}p` });
    closeModal();
    renderQueue();
    showToast(`✅ Đã xếp ${p.name} vào ${roomName} — STT ${nextNum}`, 'success');
  }
}

/* ══ XEM ĐƠN THUỐC ══ */
function modalViewRx(id) {
  const rx = DB.prescriptions.find(x => x.id === id);
  if (!rx) return;
  openModal(`📋 Đơn thuốc — ${rx.id}`, `
    <div style="background:var(--surface2);border-radius:12px;padding:16px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <div><div style="font-size:11px;color:var(--text3)">Bệnh nhân</div><div style="font-weight:700">${rx.patient}</div></div>
        <div><div style="font-size:11px;color:var(--text3)">Bác sĩ</div><div style="font-weight:700">${rx.doctor}</div></div>
        <div><div style="font-size:11px;color:var(--text3)">Ngày kê</div><div style="font-weight:700">${rx.date}</div></div>
      </div>
      <div><span style="font-size:11px;color:var(--text3)">Chẩn đoán: </span><span style="font-weight:600">${rx.diagnosis}</span></div>
    </div>
    <div class="table-wrap" style="margin-bottom:16px">
      <table>
        <thead><tr><th>Tên thuốc</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
        <tbody>
          ${rx.items.map(i=>`
            <tr>
              <td>${i.name}</td>
              <td>${i.qty} viên</td>
              <td class="mono">${formatVND(i.price)}</td>
              <td class="mono" style="font-weight:700;color:var(--primary)">${formatVND(i.qty*i.price)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="rx-total">
      <div class="rx-total-label">Tổng tiền đơn thuốc</div>
      <div class="rx-total-amount">${formatVND(rx.total)}</div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-ghost" onclick="closeModal()">Đóng</button>
      <button class="btn btn-primary" onclick="exportPDF()">🖨️ In đơn thuốc</button>
    </div>
  `);
}

/* ══ THÊM VÀO KHO ══ */
function modalAddInventory() {
  openModal('📦 Nhập Hàng Vào Kho', `
    <div class="form-field"><label>Tên thuốc / Vật tư *</label><input id="i-name" placeholder="Amoxicillin 500mg..."></div>
    <div class="form-row">
      <div class="form-field"><label>Danh mục</label>
        <select id="i-cat">
          ${[...new Set(DB.inventory.map(i=>i.cat))].map(c=>`<option>${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-field"><label>Đơn vị</label>
        <select id="i-unit"><option>viên</option><option>hộp</option><option>chai</option><option>cái</option><option>gói</option></select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Số lượng nhập</label><input id="i-qty" type="number" placeholder="500"></div>
      <div class="form-field"><label>Đơn giá (VNĐ)</label><input id="i-price" type="number" placeholder="2500"></div>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Hạn sử dụng</label><input id="i-exp" type="month"></div>
      <div class="form-field"><label>Nhà cung cấp</label><input id="i-supplier" placeholder="Công ty Dược XYZ"></div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveInventory()">💾 Xác nhận nhập kho</button>
    </div>
  `);
}

function saveInventory() {
  const name = document.getElementById('i-name')?.value?.trim();
  if (!name) { showToast('Vui lòng nhập tên sản phẩm!', 'error'); return; }
  const qty   = parseInt(document.getElementById('i-qty').value) || 0;
  const price = parseInt(document.getElementById('i-price').value) || 0;
  DB.inventory.push({
    id:    genId('INV', DB.inventory),
    name,
    cat:   document.getElementById('i-cat').value,
    unit:  document.getElementById('i-unit').value,
    qty,
    max:   qty * 2,
    price,
    exp:   document.getElementById('i-exp').value || null,
  });
  closeModal();
  renderInventory();
  showToast(`✅ Đã nhập kho: ${name}`, 'success');
}

/* ══ TẠO ĐƠN THUỐC MỚI ══ */
function modalAddRx() {
  openModal('📋 Tạo Đơn Thuốc Mới', `
    <div class="form-row">
      <div class="form-field"><label>Bệnh nhân</label>
        <select id="rx-patient">
          ${DB.patients.map(p=>`<option value="${p.id}">${p.name} — ${p.id}</option>`).join('')}
        </select>
      </div>
      <div class="form-field"><label>Bác sĩ</label>
        <select id="rx-doctor">
          ${DB.doctors.map(d=>`<option>${d.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-field"><label>Chẩn đoán</label><input id="rx-diag" placeholder="Viêm họng cấp, tăng huyết áp..."></div>
    <div class="form-field"><label>Thuốc (chọn nhiều)</label>
      <select id="rx-meds" multiple style="width:100%;padding:10px 14px;border-radius:8px;border:1.5px solid var(--border);background:var(--surface2);color:var(--text);font-family:inherit;outline:none;height:120px">
        ${DB.inventory.filter(i=>i.cat!=='Vật tư y tế').map(i=>`<option value="${i.id}">${i.name} — ${formatVND(i.price)}</option>`).join('')}
      </select>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
      <button class="btn btn-ghost" onclick="closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveRxFromModal()">💾 Tạo đơn thuốc</button>
    </div>
  `);
}

function saveRxFromModal() {
  const pId  = document.getElementById('rx-patient')?.value;
  const p    = DB.patients.find(x => x.id === pId);
  if (!p) return;
  closeModal();
  showToast('✅ Đã tạo đơn thuốc mới!', 'success');
  renderPrescriptions();
}