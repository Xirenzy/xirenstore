// DUMMY DEFAULT DATA (Jika LocalStorage Kosong)
const defaultProducts = [
    {
        id: "1",
        name: "WINX KERNEL PANEL",
        badge: "Best Seller",
        price: "Rp600.000",
        features: ["FAST INJECT AIMBOT", "SCANING AI", "ESP MENU NO LAG", "SUPPORT BLUESTACK 5.22 OPREKAN", "SUPPORT LAGA MID", "ONCAM", "HANDCAM", "SHARE SCREEN", "HARD TO TRACE", "HIDDEN PROCESS"]
    },
    {
        id: "2",
        name: "REMOTE CYBER",
        badge: "Popular",
        price: "Rp400.000",
        features: ["FAST INJECT AIMBOT", "HIDDEN PROCESS", "SUPPORT", "ONCAM", "SHARE SCREEN"]
    },
    {
        id: "3",
        name: "WRDRV",
        badge: "Premium Ultimate",
        price: "Rp900.000",
        features: ["FAST INJECT AIMBOT", "ESP NO LAG", "SUPPORT FF PLAYSTORE ALL EMULATOR", "SUPPORT REINSTALL EMULATOR", "SUPPORT LAGA", "ONCAM", "HANDCAM", "SHARE SCREEN", "HARD TO TRACE", "HIDDEN PROCESS"]
    },
    {
        id: "4",
        name: "STEALTH PANEL",
        badge: "Verified",
        price: "Rp400.000",
        features: ["FAST AIMBOT", "SUPPORT LAGA MID", "SUPPORT LAGA", "ONCAM", "SHARE SCREEN", "HIDDEN"]
    }
];

// Inisialisasi Database LocalStorage
if (!localStorage.getItem("winx_products")) {
    localStorage.setItem("winx_products", JSON.stringify(defaultProducts));
}

// Fungsi Load & Display Produk
function displayProducts(filterText = "", sortBy = "default") {
    const productGrid = document.getElementById("product-display");
    let products = JSON.parse(localStorage.getItem("winx_products")) || [];

    // Filter Berdasarkan Pencarian
    if (filterText) {
        products = products.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()));
    }

    // Sorting System
    if (sortBy === "low-high") {
        products.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortBy === "high-low") {
        products.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    productGrid.innerHTML = "";

    if (products.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Produk tidak ditemukan.</p>`;
        return;
    }

    products.forEach((product, idx) => {
        const card = document.createElement("div");
        card.className = "premium-card";
        card.style.animation = `floating ${10 + idx}s infinite ease-in-out`;
        
        let featuresHTML = "";
        product.features.forEach(feat => {
            featuresHTML += `<li><i class="fas fa-check-circle"></i> ${feat}</li>`;
        });

        card.innerHTML = `
            <span class="card-badge">${product.badge || 'PRO'}</span>
            <div>
                <h3 class="card-title">${product.name}</h3>
                <ul class="feature-list">
                    ${featuresHTML}
                </ul>
            </div>
            <div class="card-footer">
                <div class="price-tag">
                    <span class="price-label">Price</span>
                    <span class="price-value">${product.price}</span>
                </div>
                <button class="buy-btn ripple">Beli</button>
            </div>
        `;
        productGrid.appendChild(card);
    });

    initRippleEffect();
}

// Helper Ubah String Harga ke Angka Int
function parsePrice(priceStr) {
    return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
}

// Loading Animation Controller
window.addEventListener("load", () => {
    const loader = document.getElementById("loading-screen");
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 500);
    }, 800);
});

// Event Listeners
document.getElementById("search-input").addEventListener("input", (e) => {
    displayProducts(e.target.value, document.getElementById("sort-select").value);
});

document.getElementById("sort-select").addEventListener("change", (e) => {
    displayProducts(document.getElementById("search-input").value, e.target.value);
});

// Mobile Menu Toggle
document.getElementById("mobile-menu").addEventListener("click", () => {
    document.querySelector(".nav-menu").classList.toggle("active");
});

// RIPPLE WATER EFFECT CLICK ENGINE
function initRippleEffect() {
    const ripples = document.querySelectorAll(".ripple, .buy-btn, .btn-primary, .btn-secondary");
    ripples.forEach(button => {
        button.addEventListener("click", function(e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;
            let ripple = document.createElement("span");
            ripple.className = "ripple-effect";
            ripple.style.left = x + "px";
            ripple.style.top = y + "px";
            this.appendChild(ripple);
            setTimeout(() => { ripple.remove(); }, 600);
        });
    });
}

// Jalankan saat load awal
document.addEventListener("DOMContentLoaded", () => {
    displayProducts();
    
    // Custom Hero title Banner Edit Check
    const customHero = localStorage.getItem("winx_hero_title");
    const customSub = localStorage.getItem("winx_hero_sub");
    if(customHero) document.getElementById("hero-title").innerText = customHero;
    if(customSub) document.getElementById("hero-subtitle").innerText = customSub;
});
