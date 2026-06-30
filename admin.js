// Autentikasi Credential Konfigurasi
const AUTH_CONFIG = {
    username: "WINXSTEALTH",
    password: "123456"
};

// Handle Logic Login admin
document.getElementById("btn-login").addEventListener("click", () => {
    const userIn = document.getElementById("admin-user").value;
    const passIn = document.getElementById("admin-pass").value;
    const errorDiv = document.getElementById("login-error");

    if (userIn === AUTH_CONFIG.username && passIn === AUTH_CONFIG.password) {
        sessionStorage.setItem("winx_admin_logged", "true");
        checkAuth();
    } else {
        errorDiv.innerText = "Kredensial Salah! Otoritas Ditolak.";
    }
});

function checkAuth() {
    const isLogged = sessionStorage.getItem("winx_admin_logged");
    if (isLogged === "true") {
        document.getElementById("login-overlay").style.display = "none";
        document.getElementById("admin-content").style.display = "block";
        renderAdminTable();
    } else {
        document.getElementById("login-overlay").style.display = "flex";
        document.getElementById("admin-content").style.display = "none";
    }
}

// Sidebar Navigation Tab Switching
const tabs = document.querySelectorAll(".admin-sidebar li");
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        
        const targetSection = tab.getAttribute("data-target");
        document.querySelectorAll(".admin-section").forEach(sec => sec.classList.remove("active"));
        document.getElementById(targetSection).classList.add("active");
    });
});

// CRUD Logic Engine (Tambah / Edit / Hapus)
function renderAdminTable() {
    const tbody = document.getElementById("admin-table-body");
    const products = JSON.parse(localStorage.getItem("winx_products")) || [];
    tbody.innerHTML = "";

    products.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${p.name}</strong></td>
            <td><span style="color:var(--blue-neon)">${p.badge || '-'}</span></td>
            <td><span style="color:var(--purple-neon); font-weight:bold;">${p.price}</span></td>
            <td><small>${p.features.join(", ")}</small></td>
            <td>
                <div class="actions-btn-group">
                    <button class="edit-btn" onclick="openEditModal('${p.id}')"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" onclick="deleteProduct('${p.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Modal Toggle System
const modal = document.getElementById("product-modal");
document.getElementById("open-modal-add").addEventListener("click", () => {
    document.getElementById("modal-title").innerText = "Tambah Produk Baru";
    document.getElementById("prod-id").value = "";
    document.getElementById("prod-name").value = "";
    document.getElementById("prod-badge").value = "";
    document.getElementById("prod-price").value = "";
    document.getElementById("prod-features").value = "";
    modal.classList.add("active");
});

document.getElementById("close-modal").addEventListener("click", () => {
    modal.classList.remove("active");
});

// Simpan Data Produk Baru atau Hasil Edit Perubahan
document.getElementById("save-product-btn").addEventListener("click", () => {
    const id = document.getElementById("prod-id").value;
    const name = document.getElementById("prod-name").value;
    const badge = document.getElementById("prod-badge").value;
    const price = document.getElementById("prod-price").value;
    const featuresRaw = document.getElementById("prod-features").value;

    if(!name || !price) { alert("Nama dan Harga wajib diisi!"); return; }

    const featuresArray = featuresRaw.split(",").map(f => f.trim()).filter(f => f !== "");
    let products = JSON.parse(localStorage.getItem("winx_products")) || [];

    if (id) {
        // Mode Edit Produk
        products = products.map(p => p.id === id ? { ...p, name, badge, price, features: featuresArray } : p);
    } else {
        // Mode Buat Baru
        const newProduct = {
            id: Date.now().toString(),
            name, badge, price, features: featuresArray
        };
        products.push(newProduct);
    }

    localStorage.setItem("winx_products", JSON.stringify(products));
    modal.classList.remove("active");
    renderAdminTable();
});

// Buka Modal dengan Mengisi Data Edit Terpilih
window.openEditModal = function(id) {
    let products = JSON.parse(localStorage.getItem("winx_products")) || [];
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    document.getElementById("modal-title").innerText = "Edit Data Produk";
    document.getElementById("prod-id").value = prod.id;
    document.getElementById("prod-name").value = prod.name;
    document.getElementById("prod-badge").value = prod.badge || '';
    document.getElementById("prod-price").value = prod.price;
    document.getElementById("prod-features").value = prod.features.join(", ");
    modal.classList.add("active");
}

// Hapus Data Produk
window.deleteProduct = function(id) {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
        let products = JSON.parse(localStorage.getItem("winx_products")) || [];
        products = products.filter(p => p.id !== id);
        localStorage.setItem("winx_products", JSON.stringify(products));
        renderAdminTable();
    }
}

// Simpan Setingan Banner Teks Modifikasi
document.getElementById("save-banner-settings").addEventListener("click", () => {
    const t = document.getElementById("custom-hero-title").value;
    const s = document.getElementById("custom-hero-subtitle").value;
    if(t) localStorage.setItem("winx_hero_title", t);
    if(s) localStorage.setItem("winx_hero_sub", s);
    alert("Kustomisasi tampilan berhasil disimpan!");
});

// Logout Admin Controller
document.getElementById("btn-logout").addEventListener("click", () => {
    sessionStorage.removeItem("winx_admin_logged");
    checkAuth();
});

// Cek Login Saat File Diload
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
});
