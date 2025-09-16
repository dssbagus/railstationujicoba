// Global variables
let currentPage = 'dashboard';
let isLoggedIn = false;
let gangguanData = [];
let editingRowId = null;

// DOM Elements
const sidebar = document.getElementById('sidebar-menu');
const mainContent = document.getElementById('main-content');
const contentContainer = document.getElementById('content-container');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const loginButton = document.getElementById('login-button');
const loginModal = document.getElementById('login-modal');
const closeLoginModal = document.getElementById('close-login-modal');
const loadingOverlay = document.getElementById('loading-overlay');
const messageModal = document.getElementById('message-modal');
const messageText = document.getElementById('message-text');
const messageCloseBtn = document.getElementById('message-close-btn');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDashboard();
});

function initializeApp() {
    // Set initial state
    currentPage = 'dashboard';
    
    // Initialize gangguan data with sample data
    gangguanData = [
        {
            id: 1,
            tanggal: '2025-01-15',
            jenisGangguan: 'Gangguan Sinyal',
            laporKe: 'Dispatcher',
            jam: '08:30',
            penangananGangguan: 'Reset sistem sinyal dan koordinasi dengan teknisi',
            petugas: 'Ahmad Susanto'
        },
        {
            id: 2,
            tanggal: '2025-01-14',
            jenisGangguan: 'Kerusakan Rel',
            laporKe: 'Supervisor Track',
            jam: '14:15',
            penangananGangguan: 'Perbaikan segera dan pengalihan jalur sementara',
            petugas: 'Budi Hartono'
        }
    ];
}

function setupEventListeners() {
    // Sidebar toggle
    sidebarToggleBtn.addEventListener('click', toggleSidebar);
    
    // Menu navigation
    document.getElementById('menu-dashboard').addEventListener('click', (e) => {
        e.preventDefault();
        loadDashboard();
    });
    
    document.getElementById('menu-profil').addEventListener('click', (e) => {
        e.preventDefault();
        loadProfilStasiun();
    });
    
    document.getElementById('menu-pegawai').addEventListener('click', (e) => {
        e.preventDefault();
        loadDataPegawai();
    });
    
    document.getElementById('menu-perjalanan').addEventListener('click', (e) => {
        e.preventDefault();
        loadDataPerka();
    });
    
    // Administrasi submenu toggle
    document.getElementById('menu-administrasi-toggle').addEventListener('click', toggleAdministrasiSubmenu);
    
    // Submenu items
    document.getElementById('submenu-ibpr').addEventListener('click', (e) => {
        e.preventDefault();
        loadIBPR();
    });
    
    document.getElementById('submenu-penjagaan-bentuk').addEventListener('click', (e) => {
        e.preventDefault();
        loadPenjagaanBentuk();
    });
    
    document.getElementById('submenu-penggunaan').addEventListener('click', (e) => {
        e.preventDefault();
        loadPenggunaan();
    });
    
    document.getElementById('submenu-gangguan').addEventListener('click', (e) => {
        e.preventDefault();
        loadGangguanOperasional();
    });
    
    document.getElementById('menu-railibrary').addEventListener('click', (e) => {
        e.preventDefault();
        loadRaiLibrary();
    });
    
    // Login modal
    loginButton.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
    });
    
    closeLoginModal.addEventListener('click', () => {
        loginModal.classList.add('hidden');
    });
    
    // Message modal
    messageCloseBtn.addEventListener('click', () => {
        messageModal.classList.add('hidden');
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.add('hidden');
        }
        if (e.target === messageModal) {
            messageModal.classList.add('hidden');
        }
    });
}

function toggleSidebar() {
    sidebar.classList.toggle('sidebar-minimized');
    mainContent.classList.toggle('main-content-minimized');
}

function toggleAdministrasiSubmenu() {
    const submenu = document.getElementById('administrasi-submenu');
    const chevron = document.querySelector('#menu-administrasi-toggle .fa-chevron-down');
    
    if (submenu.classList.contains('submenu-open')) {
        submenu.classList.remove('submenu-open');
        chevron.classList.remove('rotate-180');
    } else {
        submenu.classList.add('submenu-open');
        chevron.classList.add('rotate-180');
    }
}

function setActiveMenu(menuId) {
    // Remove active class from all menu items
    document.querySelectorAll('nav a, nav div').forEach(item => {
        item.classList.remove('bg-blue-500', 'text-white', 'font-semibold', 'shadow-lg', 'transform', 'scale-105');
        item.classList.add('hover:bg-blue-400');
    });
    
    // Add active class to selected menu
    const activeMenu = document.getElementById(menuId);
    if (activeMenu) {
        activeMenu.classList.add('bg-blue-500', 'text-white', 'font-semibold', 'shadow-lg', 'transform', 'scale-105');
        activeMenu.classList.remove('hover:bg-blue-400');
    }
}

function showLoading() {
    loadingOverlay.classList.remove('hidden');
    loadingOverlay.classList.add('flex');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
    loadingOverlay.classList.remove('flex');
}

function showMessage(message) {
    messageText.textContent = message;
    messageModal.classList.remove('hidden');
    messageModal.classList.add('flex');
}

// Page loading functions
function loadDashboard() {
    currentPage = 'dashboard';
    setActiveMenu('menu-dashboard');
    
    contentContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white p-6 rounded-xl shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Total Kereta Hari Ini</p>
                        <p class="text-3xl font-bold text-blue-600">24</p>
                    </div>
                    <div class="p-3 bg-blue-100 rounded-full">
                        <i class="fas fa-train text-blue-600 text-xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Kereta Terlambat</p>
                        <p class="text-3xl font-bold text-red-600">3</p>
                    </div>
                    <div class="p-3 bg-red-100 rounded-full">
                        <i class="fas fa-clock text-red-600 text-xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Kereta Tepat Waktu</p>
                        <p class="text-3xl font-bold text-green-600">21</p>
                    </div>
                    <div class="p-3 bg-green-100 rounded-full">
                        <i class="fas fa-check-circle text-green-600 text-xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-md">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Gangguan Hari Ini</p>
                        <p class="text-3xl font-bold text-orange-600">1</p>
                    </div>
                    <div class="p-3 bg-orange-100 rounded-full">
                        <i class="fas fa-exclamation-triangle text-orange-600 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Jadwal Kereta Hari Ini</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. KA</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama KA</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asal</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tujuan</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">123</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Mutiara Timur</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Surabaya</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Banyuwangi</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08:30</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Tepat Waktu</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function loadProfilStasiun() {
    currentPage = 'profil';
    setActiveMenu('menu-profil');
    
    contentContainer.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Profil Stasiun</h2>
            <p class="text-gray-600">Halaman profil stasiun akan ditampilkan di sini.</p>
        </div>
    `;
}

function loadDataPegawai() {
    currentPage = 'pegawai';
    setActiveMenu('menu-pegawai');
    
    contentContainer.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Data Pegawai</h2>
            <p class="text-gray-600">Halaman data pegawai akan ditampilkan di sini.</p>
        </div>
    `;
}

function loadDataPerka() {
    currentPage = 'perjalanan';
    setActiveMenu('menu-perjalanan');
    
    contentContainer.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Data Perjalanan Kereta Api</h2>
            <p class="text-gray-600">Halaman data perjalanan kereta api akan ditampilkan di sini.</p>
        </div>
    `;
}

function loadIBPR() {
    currentPage = 'ibpr';
    setActiveMenu('submenu-ibpr');
    
    contentContainer.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">IBPR (Informasi Buku Perjalanan Rangkaian)</h2>
            <p class="text-gray-600">Halaman IBPR akan ditampilkan di sini.</p>
        </div>
    `;
}

function loadPenjagaanBentuk() {
    currentPage = 'penjagaan-bentuk';
    setActiveMenu('submenu-penjagaan-bentuk');
    
    contentContainer.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Penjagaan Bentuk - Bentuk</h2>
            <p class="text-gray-600">Halaman penjagaan bentuk-bentuk akan ditampilkan di sini.</p>
        </div>
    `;
}

function loadPenggunaan() {
    currentPage = 'penggunaan';
    setActiveMenu('submenu-penggunaan');
    
    contentContainer.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Penggunaan KR dan SM</h2>
            <p class="text-gray-600">Halaman penggunaan KR dan SM akan ditampilkan di sini.</p>
        </div>
    `;
}

function loadGangguanOperasional() {
    currentPage = 'gangguan';
    setActiveMenu('submenu-gangguan');
    
    contentContainer.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900">Tabel Gangguan Operasional</h2>
                <button id="tambah-gangguan-btn" class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300">
                    <i class="fas fa-plus mr-2"></i>Tambah Baris
                </button>
            </div>
            
            <div class="overflow-x-auto">
                <table id="gangguan-table" class="ibpr-table w-full">
                    <thead>
                        <tr class="bg-blue-600">
                            <th rowspan="2" class="text-white">No.</th>
                            <th rowspan="2" class="text-white">Tanggal</th>
                            <th rowspan="2" class="text-white">Jenis Gangguan</th>
                            <th colspan="3" class="text-white">Tindak Lanjut</th>
                            <th rowspan="2" class="text-white">Petugas</th>
                            <th rowspan="2" class="text-white">Aksi</th>
                        </tr>
                        <tr class="bg-blue-500">
                            <th class="text-white">Lapor Ke</th>
                            <th class="text-white">Jam</th>
                            <th class="text-white">Penanganan Gangguan</th>
                        </tr>
                    </thead>
                    <tbody id="gangguan-tbody">
                        <!-- Data will be populated here -->
                    </tbody>
                </table>
            </div>
        </div>
                    <i class="fas fa-plus mr-2"></i>Tambah Baris
                </button>
            </div>
            
            <div class="overflow-x-auto">
                <table id="gangguan-table" class="ibpr-table w-full">
                    <thead>
                        <tr class="bg-blue-600">
                            <th rowspan="2" class="text-white">No.</th>
                            <th rowspan="2" class="text-white">Tanggal</th>
                            <th rowspan="2" class="text-white">Jenis Gangguan</th>
                            <th colspan="3" class="text-white">Tindak Lanjut</th>
                            <th rowspan="2" class="text-white">Petugas</th>
                            <th rowspan="2" class="text-white">Aksi</th>
                        </tr>
                        <tr class="bg-blue-500">
                            <th class="text-white">Lapor Ke</th>
                            <th class="text-white">Jam</th>
                            <th class="text-white">Penanganan Gangguan</th>
                        </tr>
                    </thead>
                    <tbody id="gangguan-tbody">
                        <!-- Data will be populated here -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Setup event listeners for this page
    setupGangguanEventListeners();
    renderGangguanTable();
}

function loadRaiLibrary() {
    currentPage = 'railibrary';
    setActiveMenu('menu-railibrary');
    
    contentContainer.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">RaiLibrary</h2>
            <p class="text-gray-600">Halaman RaiLibrary akan ditampilkan di sini.</p>
        </div>
    `;
    
    // Setup event listeners for this page
    setupGangguanEventListeners();
    renderGangguanTable();
}

// Gangguan Operasional Functions
function setupGangguanEventListeners() {
    const tambahBtn = document.getElementById('tambah-gangguan-btn');
    if (tambahBtn) {
        tambahBtn.addEventListener('click', tambahGangguanBaris);
    }
}

function renderGangguanTable() {
    const tbody = document.getElementById('gangguan-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    gangguanData.forEach((item, index) => {
        const row = createGangguanRow(item, index + 1, false);
        tbody.appendChild(row);
    });
}

function createGangguanRow(data, no, isEditing = false) {
    const row = document.createElement('tr');
    row.dataset.id = data.id;
    
    if (isEditing) {
        row.innerHTML = `
            <td>${no}</td>
            <td><input type="date" value="${data.tanggal || ''}" class="gangguan-input" data-field="tanggal"></td>
            <td><input type="text" value="${data.jenisGangguan || ''}" class="gangguan-input" data-field="jenisGangguan" placeholder="Jenis Gangguan"></td>
            <td><input type="text" value="${data.laporKe || ''}" class="gangguan-input" data-field="laporKe" placeholder="Lapor Ke"></td>
            <td><input type="time" value="${data.jam || ''}" class="gangguan-input" data-field="jam"></td>
            <td><textarea class="gangguan-input" data-field="penangananGangguan" placeholder="Penanganan Gangguan">${data.penangananGangguan || ''}</textarea></td>
            <td><input type="text" value="${data.petugas || ''}" class="gangguan-input" data-field="petugas" placeholder="Nama Petugas"></td>
            <td>
                <button class="bg-green-500 text-white px-3 py-1 rounded text-xs mr-1 hover:bg-green-600" onclick="simpanGangguan(${data.id})">
                    <i class="fas fa-save"></i> Simpan
                </button>
                <button class="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600" onclick="batalGangguan(${data.id})">
                    <i class="fas fa-times"></i> Batal
                </button>
            </td>
        `;
    } else {
        row.innerHTML = `
            <td>${no}</td>
            <td>${data.tanggal || '-'}</td>
            <td class="text-left">${data.jenisGangguan || '-'}</td>
            <td>${data.laporKe || '-'}</td>
            <td>${data.jam || '-'}</td>
            <td class="text-left">${data.penangananGangguan || '-'}</td>
            <td>${data.petugas || '-'}</td>
            <td>
                <button class="bg-blue-500 text-white px-3 py-1 rounded text-xs mr-1 hover:bg-blue-600" onclick="editGangguan(${data.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </td>
        `;
    }
    
    return row;
}

function tambahGangguanBaris() {
    if (editingRowId !== null) {
        showMessage('Selesaikan editing baris yang sedang aktif terlebih dahulu.');
        return;
    }
    
    const newId = Date.now(); // Simple ID generation
    const newData = {
        id: newId,
        tanggal: '',
        jenisGangguan: '',
        laporKe: '',
        jam: '',
        penangananGangguan: '',
        petugas: ''
    };
    
    // Add to beginning of array
    gangguanData.unshift(newData);
    editingRowId = newId;
    
    renderGangguanTable();
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = document.querySelector(`tr[data-id="${newId}"] .gangguan-input`);
        if (firstInput) firstInput.focus();
    }, 100);
}

function editGangguan(id) {
    if (editingRowId !== null) {
        showMessage('Selesaikan editing baris yang sedang aktif terlebih dahulu.');
        return;
    }
    
    editingRowId = id;
    renderGangguanTable();
}

function simpanGangguan(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;
    
    const inputs = row.querySelectorAll('.gangguan-input');
    const updatedData = {};
    let isValid = true;
    
    inputs.forEach(input => {
        const field = input.dataset.field;
        const value = input.value.trim();
        
        // Basic validation
        if (field === 'tanggal' && !value) {
            showMessage('Tanggal harus diisi.');
            isValid = false;
            return;
        }
        if (field === 'jenisGangguan' && !value) {
            showMessage('Jenis Gangguan harus diisi.');
            isValid = false;
            return;
        }
        if (field === 'petugas' && !value) {
            showMessage('Nama Petugas harus diisi.');
            isValid = false;
            return;
        }
        
        updatedData[field] = value;
    });
    
    if (!isValid) return;
    
    // Update data
    const dataIndex = gangguanData.findIndex(item => item.id === id);
    if (dataIndex !== -1) {
        gangguanData[dataIndex] = { ...gangguanData[dataIndex], ...updatedData };
    }
    
    editingRowId = null;
    renderGangguanTable();
    showMessage('Data berhasil disimpan.');
}

function batalGangguan(id) {
    // If this is a new row (just added), remove it from data
    const dataIndex = gangguanData.findIndex(item => item.id === id);
    if (dataIndex !== -1) {
        const isNewRow = !gangguanData[dataIndex].tanggal && !gangguanData[dataIndex].jenisGangguan;
        if (isNewRow) {
            gangguanData.splice(dataIndex, 1);
        }
    }
    
    editingRowId = null;
    renderGangguanTable();
}

// Make functions globally available
window.editGangguan = editGangguan;
window.simpanGangguan = simpanGangguan;
window.batalGangguan = batalGangguan;

// Gangguan Operasional Functions
function setupGangguanEventListeners() {
    const tambahBtn = document.getElementById('tambah-gangguan-btn');
    if (tambahBtn) {
        tambahBtn.addEventListener('click', tambahGangguanBaris);
    }
}

function renderGangguanTable() {
    const tbody = document.getElementById('gangguan-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    gangguanData.forEach((item, index) => {
        const row = createGangguanRow(item, index + 1, false);
        tbody.appendChild(row);
    });
}

function createGangguanRow(data, no, isEditing = false) {
    const row = document.createElement('tr');
    row.dataset.id = data.id;
    
    if (isEditing) {
        row.innerHTML = `
            <td>${no}</td>
            <td><input type="date" value="${data.tanggal || ''}" class="gangguan-input" data-field="tanggal"></td>
            <td><input type="text" value="${data.jenisGangguan || ''}" class="gangguan-input" data-field="jenisGangguan" placeholder="Jenis Gangguan"></td>
            <td><input type="text" value="${data.laporKe || ''}" class="gangguan-input" data-field="laporKe" placeholder="Lapor Ke"></td>
            <td><input type="time" value="${data.jam || ''}" class="gangguan-input" data-field="jam"></td>
            <td><textarea class="gangguan-input" data-field="penangananGangguan" placeholder="Penanganan Gangguan">${data.penangananGangguan || ''}</textarea></td>
            <td><input type="text" value="${data.petugas || ''}" class="gangguan-input" data-field="petugas" placeholder="Nama Petugas"></td>
            <td>
                <button class="bg-green-500 text-white px-3 py-1 rounded text-xs mr-1 hover:bg-green-600" onclick="simpanGangguan(${data.id})">
                    <i class="fas fa-save"></i> Simpan
                </button>
                <button class="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600" onclick="batalGangguan(${data.id})">
                    <i class="fas fa-times"></i> Batal
                </button>
            </td>
        `;
    } else {
        row.innerHTML = `
            <td>${no}</td>
            <td>${data.tanggal || '-'}</td>
            <td class="text-left">${data.jenisGangguan || '-'}</td>
            <td>${data.laporKe || '-'}</td>
            <td>${data.jam || '-'}</td>
            <td class="text-left">${data.penangananGangguan || '-'}</td>
            <td>${data.petugas || '-'}</td>
            <td>
                <button class="bg-blue-500 text-white px-3 py-1 rounded text-xs mr-1 hover:bg-blue-600" onclick="editGangguan(${data.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </td>
        `;
    }
    
    return row;
}

function tambahGangguanBaris() {
    if (editingRowId !== null) {
        showMessage('Selesaikan editing baris yang sedang aktif terlebih dahulu.');
        return;
    }
    
    const newId = Date.now(); // Simple ID generation
    const newData = {
        id: newId,
        tanggal: '',
        jenisGangguan: '',
        laporKe: '',
        jam: '',
        penangananGangguan: '',
        petugas: ''
    };
    
    // Add to beginning of array
    gangguanData.unshift(newData);
    editingRowId = newId;
    
    renderGangguanTable();
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = document.querySelector(`tr[data-id="${newId}"] .gangguan-input`);
        if (firstInput) firstInput.focus();
    }, 100);
}

function editGangguan(id) {
    if (editingRowId !== null) {
        showMessage('Selesaikan editing baris yang sedang aktif terlebih dahulu.');
        return;
    }
    
    editingRowId = id;
    renderGangguanTable();
}

function simpanGangguan(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;
    
    const inputs = row.querySelectorAll('.gangguan-input');
    const updatedData = {};
    let isValid = true;
    
    inputs.forEach(input => {
        const field = input.dataset.field;
        const value = input.value.trim();
        
        // Basic validation
        if (field === 'tanggal' && !value) {
            showMessage('Tanggal harus diisi.');
            isValid = false;
            return;
        }
        if (field === 'jenisGangguan' && !value) {
            showMessage('Jenis Gangguan harus diisi.');
            isValid = false;
            return;
        }
        if (field === 'petugas' && !value) {
            showMessage('Nama Petugas harus diisi.');
            isValid = false;
            return;
        }
        
        updatedData[field] = value;
    });
    
    if (!isValid) return;
    
    // Update data
    const dataIndex = gangguanData.findIndex(item => item.id === id);
    if (dataIndex !== -1) {
        gangguanData[dataIndex] = { ...gangguanData[dataIndex], ...updatedData };
    }
    
    editingRowId = null;
    renderGangguanTable();
    showMessage('Data berhasil disimpan.');
}

function batalGangguan(id) {
    // If this is a new row (just added), remove it from data
    const dataIndex = gangguanData.findIndex(item => item.id === id);
    if (dataIndex !== -1) {
        const isNewRow = !gangguanData[dataIndex].tanggal && !gangguanData[dataIndex].jenisGangguan;
        if (isNewRow) {
            gangguanData.splice(dataIndex, 1);
        }
    }
    
    editingRowId = null;
    renderGangguanTable();
}

// Make gangguan functions globally available
window.editGangguan = editGangguan;
window.simpanGangguan = simpanGangguan;
window.batalGangguan = batalGangguan;