/* ═══════════════════════════════════════════
   MedCore — data.js
   Dữ liệu mẫu (Mock Data)
   Thay bằng fetch() API thực tế khi có Backend
═══════════════════════════════════════════ */

const DB = {

  patients: [
  //   { id:'BN001', name:'Nguyễn Văn An',      dob:'12/03/1985', gender:'Nam', cccd:'079085003421', phone:'0912345678', spec:'Tim Mạch',        doctor:'BS. Trần Quốc Hùng',  status:'Đang khám',   visits:12, address:'Phúc Yên, Vĩnh Phúc' },
  //   { id:'BN002', name:'Trần Thị Bình',      dob:'08/07/1972', gender:'Nữ',  cccd:'079072005632', phone:'0987654321', spec:'Nội Khoa',         doctor:'BS. Lê Thị Mai',      status:'Đang chờ',    visits:5,  address:'Vĩnh Yên, Vĩnh Phúc' },
  //   { id:'BN003', name:'Lê Văn Cường',       dob:'25/11/1990', gender:'Nam', cccd:'079090007843', phone:'0901122334', spec:'Ngoại Khoa',       doctor:'BS. Nguyễn Đức Anh',  status:'Hoàn thành',  visits:3,  address:'Tam Dương, Vĩnh Phúc' },
  //   { id:'BN004', name:'Phạm Thị Dung',      dob:'14/02/1968', gender:'Nữ',  cccd:'079068009054', phone:'0978811223', spec:'Mắt',              doctor:'BS. Hoàng Văn Bình',  status:'Đang chờ',    visits:8,  address:'Lập Thạch, Vĩnh Phúc' },
  //   { id:'BN005', name:'Hoàng Minh Đức',     dob:'30/09/1995', gender:'Nam', cccd:'079095011265', phone:'0934455667', spec:'Nha Khoa',         doctor:'BS. Phạm Thị Thu',    status:'Hoàn thành',  visits:2,  address:'Bình Xuyên, Vĩnh Phúc' },
  //   { id:'BN006', name:'Vũ Thị Hoa',         dob:'22/04/1980', gender:'Nữ',  cccd:'079080013476', phone:'0966778899', spec:'Thần Kinh',        doctor:'BS. Cao Văn Lâm',     status:'Nhập viện',   visits:15, address:'Phúc Yên, Vĩnh Phúc' },
  //   { id:'BN007', name:'Đặng Văn Kiên',      dob:'17/08/1963', gender:'Nam', cccd:'079063015687', phone:'0912233445', spec:'Tim Mạch',         doctor:'BS. Trần Quốc Hùng',  status:'Đang chờ',    visits:20, address:'Vĩnh Yên, Vĩnh Phúc' },
  //   { id:'BN008', name:'Bùi Thị Lan',        dob:'05/01/1988', gender:'Nữ',  cccd:'079088017898', phone:'0945566778', spec:'Nội Khoa',         doctor:'BS. Lê Thị Mai',      status:'Đang khám',   visits:7,  address:'Tam Đảo, Vĩnh Phúc' },
  //   { id:'BN009', name:'Trịnh Văn Nam',      dob:'19/06/1975', gender:'Nam', cccd:'079075020109', phone:'0978900112', spec:'Cơ Xương Khớp',    doctor:'BS. Nguyễn Đức Anh',  status:'Đang chờ',    visits:4,  address:'Yên Lạc, Vĩnh Phúc' },
  //   { id:'BN010', name:'Ngô Thị Oanh',       dob:'11/12/1992', gender:'Nữ',  cccd:'079092022310', phone:'0901234567', spec:'Ngoại Khoa',       doctor:'BS. Hoàng Văn Bình',  status:'Hoàn thành',  visits:1,  address:'Sông Lô, Vĩnh Phúc' },
  ],

  doctors: [],
  //   { id:'BS001', name:'Trần Quốc Hùng',    spec:'Tim Mạch',     degree:'PGS.TS.BS', shift:'Ca sáng',   status:'Đang khám', phone:'0901111222', email:'hùng.tq@bvphucyen.vn' },
  //   { id:'BS002', name:'Lê Thị Mai',        spec:'Nội Khoa',     degree:'TS.BS',      shift:'Ca sáng',   status:'Sẵn sàng',  phone:'0912222333', email:'mai.lt@bvphucyen.vn'  },
  //   { id:'BS003', name:'Nguyễn Đức Anh',   spec:'Ngoại Khoa',   degree:'BSCKII',     shift:'Ca chiều',  status:'Nghỉ',      phone:'0923333444', email:'anh.nd@bvphucyen.vn'  },
  //   { id:'BS004', name:'Hoàng Văn Bình',   spec:'Mắt',          degree:'BSCKI',      shift:'Ca sáng',   status:'Sẵn sàng',  phone:'0934444555', email:'binh.hv@bvphucyen.vn' },
  //   { id:'BS005', name:'Phạm Thị Thu',     spec:'Nha Khoa',     degree:'ThS.BS',     shift:'Ca chiều',  status:'Đang khám', phone:'0945555666', email:'thu.pt@bvphucyen.vn'  },
  //   { id:'BS006', name:'Cao Văn Lâm',      spec:'Thần Kinh',    degree:'GS.TS.BS',   shift:'Ca trực',   status:'Sẵn sàng',  phone:'0956666777', email:'lam.cv@bvphucyen.vn'  },
  // ],

  queue: [
    // { room:'Phòng Tim Mạch',       spec:'Tim Mạch',        current:'042', currentName:'Nguyễn Văn An',     waiting:[{n:'043',name:'Lê Quang Hải',t:'28p'},{n:'044',name:'Bùi Thị Kim',t:'35p'},{n:'045',name:'Đỗ Văn Long',t:'42p'}] },
    // { room:'Phòng Nội Khoa',       spec:'Nội Khoa',        current:'017', currentName:'Trần Thị Bình',     waiting:[{n:'018',name:'Vũ Minh Phúc',t:'15p'},{n:'019',name:'Ngô Thị Quỳnh',t:'22p'}] },
    // { room:'Phòng Ngoại Khoa',     spec:'Ngoại Khoa',      current:'029', currentName:'Hoàng Văn Sơn',     waiting:[{n:'030',name:'Trịnh Thị Tâm',t:'10p'},{n:'031',name:'Đinh Văn Uy',t:'17p'},{n:'032',name:'Lương Thị Vân',t:'25p'}] },
    // { room:'Phòng Mắt',            spec:'Mắt',             current:'008', currentName:'Phạm Thị Lan',      waiting:[{n:'009',name:'Cao Văn Xuân',t:'12p'}] },
    // { room:'Phòng Nha Khoa',       spec:'Nha Khoa',        current:'031', currentName:'Hoàng Văn Yên',     waiting:[{n:'032',name:'Đặng Thị Yến',t:'8p'},{n:'033',name:'Bùi Văn Zung',t:'16p'}] },
    // { room:'Phòng Thần Kinh',      spec:'Thần Kinh',       current:'021', currentName:'Nguyễn Thị Ánh',    waiting:[{n:'022',name:'Trần Văn Bảo',t:'20p'},{n:'023',name:'Lê Thị Cam',t:'28p'},{n:'024',name:'Phạm Văn Dũng',t:'36p'}] },
    { room:'Phòng Tim Mạch',       spec:'Tim Mạch',        current:null, currentName:null,     waiting:[]},
    { room:'Phòng Nội Khoa',       spec:'Nội Khoa',        current:null, currentName:null,     waiting:[]},
    { room:'Phòng Ngoại Khoa',       spec:'Ngoại Khoa',        current:null, currentName:null,     waiting:[]},
    { room:'Phòng Mắt',       spec:'Mắt',        current:null, currentName:null,     waiting:[]},
    { room:'Phòng Nha Khoa',       spec:'Nha Khoa',        current:null, currentName:null,     waiting:[]},
    { room:'Phòng Thần Kinh',       spec:'Thần Kinh',        current:null, currentName:null,     waiting:[{n:'999',name:'dokuta',t:null}]},
  ],

  inventory: [
    { id:'INV001', name:'Amoxicillin 500mg',    cat:'Kháng sinh',      qty:850,  max:1000, exp:'12/2026', price:2500,    unit:'viên' },
    { id:'INV002', name:'Paracetamol 500mg',    cat:'Giảm đau',        qty:1200, max:2000, exp:'06/2027', price:800,     unit:'viên' },
    { id:'INV003', name:'Metformin 500mg',      cat:'Tim mạch',        qty:240,  max:500,  exp:'03/2027', price:3200,    unit:'viên' },
    { id:'INV004', name:'Omeprazole 20mg',      cat:'Dạ dày',          qty:80,   max:400,  exp:'09/2026', price:4500,    unit:'viên' },
    { id:'INV005', name:'Vitamin C 1000mg',     cat:'Vitamin',         qty:600,  max:800,  exp:'08/2027', price:1200,    unit:'viên' },
    { id:'INV006', name:'Amlodipine 5mg',       cat:'Tim mạch',        qty:30,   max:300,  exp:'11/2026', price:5800,    unit:'viên' },
    { id:'INV007', name:'Găng tay y tế (L)',    cat:'Vật tư y tế',     qty:2000, max:5000, exp:null,      price:1500,    unit:'cái' },
    { id:'INV008', name:'Khẩu trang N95',       cat:'Vật tư y tế',     qty:150,  max:1000, exp:null,      price:25000,   unit:'cái' },
    { id:'INV009', name:'Bông gòn y tế 500g',  cat:'Vật tư y tế',     qty:450,  max:600,  exp:null,      price:12000,   unit:'gói' },
  ],

  prescriptions: [
    { id:'RX2026001', patientId:'BN001', patient:'Nguyễn Văn An',   doctor:'BS. Trần Quốc Hùng', date:'16/05/2026', total:285000, status:'Đã cấp phát',
      items:[{name:'Amoxicillin 500mg',qty:30,price:2500},{name:'Paracetamol 500mg',qty:20,price:800},{name:'Vitamin C 1000mg',qty:15,price:1200}],
      diagnosis:'Viêm họng cấp, tăng huyết áp độ 1' },
    { id:'RX2026002', patientId:'BN002', patient:'Trần Thị Bình',   doctor:'BS. Lê Thị Mai',      date:'16/05/2026', total:164000, status:'Chờ duyệt',
      items:[{name:'Omeprazole 20mg',qty:28,price:4500},{name:'Metformin 500mg',qty:15,price:3200}],
      diagnosis:'Viêm loét dạ dày, tiểu đường type 2' },
    { id:'RX2026003', patientId:'BN004', patient:'Phạm Thị Dung',   doctor:'BS. Hoàng Văn Bình',  date:'15/05/2026', total:520000, status:'Đã cấp phát',
      items:[{name:'Amlodipine 5mg',qty:30,price:5800},{name:'Vitamin C 1000mg',qty:60,price:1200},{name:'Paracetamol 500mg',qty:40,price:800}],
      diagnosis:'Tăng nhãn áp, viêm kết mạc' },
    { id:'RX2026004', patientId:'BN006', patient:'Vũ Thị Hoa',      doctor:'BS. Cao Văn Lâm',     date:'15/05/2026', total:890000, status:'Đang pha chế',
      items:[{name:'Amlodipine 5mg',qty:60,price:5800},{name:'Metformin 500mg',qty:60,price:3200},{name:'Amoxicillin 500mg',qty:30,price:2500}],
      diagnosis:'Đau nửa đầu mãn tính, hội chứng tiền đình' },
  ],

  /* Thống kê Dashboard */
  stats: {
    todayPatients:  248,
    completedToday: 186,
    revenueToday:   84200000,
    waitingNow:     62,
  },

  chartData: {
    weeklyVisits:  [210, 185, 248, 196, 272, 248, 168],
    weekLabels:    ['T2','T3','T4','T5','T6','T7','CN'],
    specDist:      [28, 22, 18, 12, 10, 10],
    specLabels:    ['Tim Mạch','Nội Khoa','Ngoại Khoa','Mắt','Nha Khoa','Thần Kinh'],
    topMeds:       [1240, 850, 760, 520, 480],
    topMedLabels:  ['Paracetamol','Amoxicillin','Vitamin C','Amlodipine','Metformin'],
    monthlyRevenue:[1.8, 2.0, 1.9, 2.2, 2.4],
    monthLabels:   ['T1','T2','T3','T4','T5'],
    patientTrend:  [1420, 1580, 1490, 1720, 1842],
  },
};

/* ── API Helper (thay bằng fetch thật khi có backend) ── */
const API = {
  baseUrl: 'http://localhost:8080/api', // Spring Boot endpoint

  async get(endpoint) {
    // TODO: bỏ comment khi có backend
    // const res = await fetch(`${this.baseUrl}${endpoint}`, {
    //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    // });
    // return res.json();
    console.log(`[API GET] ${endpoint} — dùng mock data`);
    return null;
  },

  async post(endpoint, body) {
    // const res = await fetch(`${this.baseUrl}${endpoint}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    //   body: JSON.stringify(body)
    // });
    // return res.json();
    console.log(`[API POST] ${endpoint}`, body);
    return { success: true };
  },

  async put(endpoint, body) {
    console.log(`[API PUT] ${endpoint}`, body);
    return { success: true };
  },

  async delete(endpoint) {
    console.log(`[API DELETE] ${endpoint}`);
    return { success: true };
  },
};