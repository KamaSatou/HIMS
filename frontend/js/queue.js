/* ═══════════════════════════════════════════
   MedCore — queue.js
   Realtime Queue — WebSocket native
   Connects to ws://localhost:8080/ws/queue
═══════════════════════════════════════════ */

const QueueAPI = {
  async getToday()         { return api.get('/queue'); },
  async getByRoom(room)    { return api.get(`/queue/room/${encodeURIComponent(room)}`); },
  async addToQueue(data)   { return api.post('/queue', data); },
  async callNext(roomName) { return api.patch(`/queue/call-next?roomName=${encodeURIComponent(roomName)}`); },
};

// CAN SUA LAI BACKEND



// ── WebSocket State ──
// let queueWs       = null;
// let wsReconnectTimer = null;
// let wsConnected   = false;

// const WS_URL = 'ws://localhost:8080/ws/queue';

// function connectQueueWebSocket() {
//   if (queueWs && (queueWs.readyState === WebSocket.OPEN || queueWs.readyState === WebSocket.CONNECTING)) return;

//   try {
//     queueWs = new WebSocket(WS_URL);

//     queueWs.onopen = () => {
//       wsConnected = true;
//       console.log('[WS] Queue WebSocket connected');
//       updateWsStatusBadge(true);
//       // Send ping every 30s
//       setInterval(() => {
//         if (queueWs?.readyState === WebSocket.OPEN) queueWs.send('ping');
//       }, 30000);
//     };

//     queueWs.onmessage = (event) => {
//       try {
//         const msg = JSON.parse(event.data);
//         handleWsMessage(msg);
//       } catch {
//         // Non-JSON message (pong etc.)
//       }
//     };

//     queueWs.onclose = () => {
//       wsConnected = false;
//       updateWsStatusBadge(false);
//       console.log('[WS] Queue disconnected — reconnecting in 5s');
//       wsReconnectTimer = setTimeout(connectQueueWebSocket, 5000);
//     };

//     queueWs.onerror = (err) => {
//       console.warn('[WS] WebSocket error', err);
//       queueWs.close();
//     };

//   } catch (e) {
//     console.warn('[WS] Cannot connect to WebSocket:', e.message);
//   }
// }

// function disconnectQueueWebSocket() {
//   clearTimeout(wsReconnectTimer);
//   if (queueWs) { queueWs.close(); queueWs = null; }
// }

// ── Handle incoming WS messages ──
function handleWsMessage(msg) {
  if (msg.type === 'QUEUE_UPDATE') {
    // Only re-render if queue section is visible
    if (AppState?.currentSection === 'queue') {
      loadAndRenderQueue();
      updateTickerForRoom(msg.room, msg.current);
    }
    // Always update the badge
    if (msg.waitingCount !== undefined) {
      const badge = document.getElementById('badgeQueue');
      if (badge) badge.textContent = msg.waitingCount;
    }
  }
}

// ── Update LIVE ticker ──
function updateTickerForRoom(roomName, current) {
  if (!current) return;
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  // Update all ticker spans that match this room
  track.querySelectorAll('span').forEach(span => {
    if (span.textContent.includes(roomName)) {
      span.innerHTML = `🏥 ${roomName} — Đang gọi: <strong>STT ${String(current.number).padStart(3,'0')} - ${current.patient}</strong>`;
    }
  });
}

// ── WS status indicator (shows in topbar) ──
function updateWsStatusBadge(connected) {
  let badge = document.getElementById('wsBadge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'wsBadge';
    badge.style.cssText = 'font-size:11px;padding:3px 8px;border-radius:20px;font-weight:700;cursor:default';
    document.querySelector('.topbar-right')?.prepend(badge);
  }
  badge.textContent  = connected ? '🟢 LIVE' : '🔴 Offline';
  badge.title        = connected ? 'WebSocket kết nối thành công' : 'WebSocket chưa kết nối';
  badge.style.background = connected ? '#D1FAE5' : '#FEE2E2';
  badge.style.color      = connected ? '#059669'  : '#DC2626';
}

// ── Load queue from API + render ──
async function loadAndRenderQueue() {
  try {
    const queueItems = await QueueAPI.getToday();
    console.log('All queue items:', queueItems);
    
    // Group by roomName
    const grouped = {};
    
    queueItems.forEach(q => {
      const roomName = (q.roomName || '').trim();
      
      if (!grouped[roomName]) {
        grouped[roomName] = {
          room: roomName,
          roomName: roomName,
          spec: q.specialty || '',
          specialty: q.specialty || '',
          current: null,
          currentName: null,
          currentNumber: null,
          waiting: []
        };
      }
      
      if (q.status === 'DANG_KHAM') {
        grouped[roomName].current = String(q.queueNumber).padStart(3, '0');
        grouped[roomName].currentName = q.patient ? q.patient.fullName : '—';
        grouped[roomName].currentNumber = q.queueNumber;
      }
      
      if (q.status === 'DANG_CHO') {
        const waited = calcWaitTime(q.checkInTime);
        grouped[roomName].waiting.push({
          n: String(q.queueNumber).padStart(3, '0'),
          name: q.patient ? q.patient.fullName : '—',
          t: waited,
          id: q.id,
          priority: q.priority
        });
      }
    });
    console.log('Grouped data:', grouped);

    // Merge với DB.queue theo thứ tự cố định
    let orderedRooms = [];
    
    if (typeof DB !== 'undefined' && DB.queue) {
      DB.queue.forEach(staticRoom => {
        const roomName = staticRoom.room;
        if (grouped[roomName]) {
          orderedRooms.push(grouped[roomName]);
        } else {
          orderedRooms.push({
            room: roomName,
            roomName: roomName,
            spec: staticRoom.spec || '',
            specialty: staticRoom.spec || '',
            current: null,
            currentName: null,
            currentNumber: null,
            waiting: [],
            _static: true
          });
        }
      });
    } else {
      orderedRooms = Object.values(grouped);
    }

    renderQueueFromGrouped(orderedRooms);

  } catch (err) {
    console.warn('Queue API error:', err.message);
    if (typeof DB !== 'undefined' && DB.queue) {
      const fallback = DB.queue.map(r => ({
        room: r.room,
        roomName: r.room,
        spec: r.spec || '',
        specialty: r.spec || '',
        current: null,
        currentName: null,
        currentNumber: null,
        waiting: [],
        _static: true
      }));
      renderQueueFromGrouped(fallback);
    }
  }
}

function calcWaitTime(checkInTime) {
  if (!checkInTime) return '—';
  const mins = Math.round((Date.now() - new Date(checkInTime).getTime()) / 60000);
  return mins + 'p';
}

// ── Render queue with real data ──
function renderQueueFromGrouped(rooms) {
  const sec = document.getElementById('sec-queue');
  if (!sec) return;

  // Sắp xếp theo thứ tự DB.queue
  let sortedRooms = rooms;
  if (typeof DB !== 'undefined' && DB.queue && DB.queue.length > 0) {
    sortedRooms = [];
    DB.queue.forEach(staticRoom => {
      const found = rooms.find(r => 
        (r.room || r.roomName || '') === (staticRoom.room || '')
      );
      if (found) sortedRooms.push(found);
    });
    rooms.forEach(r => {
      const exists = sortedRooms.find(s => s.room === r.room || s.roomName === r.roomName);
      if (!exists) sortedRooms.push(r);
    });
  }

  const MAX_SLOTS = 6;

  sec.innerHTML = `
    <div class="section-header">
      <div class="section-title">🔢 Quản lý Hàng đợi Khám</div>
      <div class="section-count">${sortedRooms.length} phòng hoạt động</div>
      <div style="margin-left:auto">
        <button class="btn btn-primary" onclick="modalAddQueue()">+ Tiếp nhận bệnh nhân</button>
      </div>
    </div>
    <div class="queue-grid">
      ${sortedRooms.map((q) => {
        const roomName = q.room || q.roomName || 'Unknown';
        const waiting = q.waiting || [];
        const hasCurrent = q.current && q.currentName; 
        
        // Tạo 6 slot waiting
        let slotsHtml = '';
        for (let i = 0; i < MAX_SLOTS; i++) {
          const w = waiting[i];
          if (w && w.n) {
            slotsHtml += `
              <div class="queue-item">
                <span class="queue-num">${w.n}</span>
                <span class="queue-patient">${w.name || '—'}</span>
                <span class="queue-time">⏳ ${w.t || '—'}</span>
              </div>`;
          } else {
            slotsHtml += `
              <div class="queue-item queue-item-empty">
                <span class="queue-num">—</span>
                <span class="queue-patient">Trống</span>
                <span class="queue-time">—</span>
              </div>`;
          }
        }
        
        if (waiting.length > MAX_SLOTS) {
          slotsHtml += `<div class="queue-more">+${waiting.length - MAX_SLOTS} bệnh nhân nữa</div>`;
        }
        
        return `
        <div class="queue-room${q._static ? ' room-static' : ''}">
          <div class="queue-room-header">
            <div>
              <div class="queue-room-name">${roomName}</div>
              <div class="queue-room-spec">${q.spec || q.specialty || '—'}</div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="callNextRoom('${roomName}')">▶ Gọi tiếp</button>
          </div>
          <div class="queue-current">
            <div class="queue-current-label">🩺 Đang khám</div>
            ${hasCurrent ? `
              <div class="queue-number" style="font-size:48px;font-weight:800;color:var(--primary)">${q.current}</div>
              <div class="queue-name-display" style="font-size:16px;font-weight:600">${q.currentName}</div>
            ` : `
              <div class="queue-number" style="color:var(--text3)">—</div>
              <div class="queue-name-display" style="color:var(--text3)">Chưa có bệnh nhân</div>
            `}
          </div>
          <div class="queue-list">
            <div style="font-size:11px;color:var(--text3);padding:4px 0">📋 Danh sách chờ:</div>
            ${slotsHtml}
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

// ── Call next via API (not mock) ──
async function callNextRoom(roomName) {
  try {
    console.info(roomName);
    const next = await QueueAPI.callNext(roomName);
    console.log('Call next result:', next);
    
    const stt = String(next.queueNumber || '—').padStart(3, '0');
    const name = next.patient?.fullName || '—';
    
    showToast(`📢 ${roomName}: Gọi STT ${stt} — ${name}`, 'success');
    await loadAndRenderQueue();
  } catch (err) {
    showToast('⚠️ ' + err.message, 'warning');
    try { await loadAndRenderQueue(); } catch (e) {}
  }
}

// ── Override saveQueue modal to use real API ──
async function saveQueue() {
  const roomName  = document.getElementById('q-room')?.value;
  const patientEl = document.getElementById('q-patient');
  const patientId = patientEl?.value;
  const priority  = document.getElementById('q-priority')?.value || 'THUONG';
  const notes     = document.getElementById('q-note')?.value || '';

  const room = DB.queue.find(q => q.room === roomName);
  const spec  = room?.spec || roomName;

  const priorityMap = { 'normal':'THUONG', 'high':'UU_TIEN', 'emergency':'CAP_CUU' };

  if (!patientId || !roomName) { showToast('Vui lòng chọn đủ thông tin!', 'error'); return; }

  // Get real patient id from cache
  const patient = DB.patients.find(p => p.id === patientId || p.patientCode === patientId);
  const realPatientId = patient?._raw?.id || patientId;

  try {
    await QueueAPI.addToQueue({
      patientId:  parseInt(realPatientId),
      roomName,
      specialty:  spec,
      priority:   priorityMap[priority] || priority,
      notes,
    });
    closeModal();
    showToast(`✅ Đã xếp hàng đợi thành công!`, 'success');
    await loadAndRenderQueue();
  } catch (err) {
    showToast('❌ ' + err.message, 'error');
  }
}