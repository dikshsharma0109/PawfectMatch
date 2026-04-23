// ============================================
// PAWFECT MATCHES - PRODUCTS (FINAL FIX)
// ============================================

const ShopManager = {

    products: [],

    init() {
        this.loadProducts();
    },

    async loadProducts() {
        try {
            const res = await API.get("/api/products");

            console.log("🔥 FULL API RESPONSE:", res);

            // ✅ FIX 1: HANDLE ALL POSSIBLE RESPONSE STRUCTURES
            let products = [];

            if (Array.isArray(res)) {
                products = res;
            }
            else if (Array.isArray(res.data)) {
                products = res.data;
            }
            else if (res.data && Array.isArray(res.data.data)) {
                products = res.data.data;
            }

            console.log("🔥 Extracted products:", products);

            // ❌ If still empty → show error
            if (!products.length) {
                document.getElementById("productsGrid").innerHTML =
                    "<h2>No products found</h2>";
                return;
            }

            // ✅ FIX 2: CORRECT PROPERTY NAMES
            this.products = products.map(p => {

                let image = "https://via.placeholder.com/200";

                if (p.Images && p.Images.length > 0) {
                    const primary = p.Images.find(i => i.IsPrimary);
                    image = primary?.ImageUrl || p.Images[0].ImageUrl;
                }

                return {
                    id: p.ProductId,
                    name: p.Name,
                    description: p.Description,
                    price: p.Price,
                    category: p.Category || 'other',
                    image: image
                };
            });

            console.log("✅ Final mapped products:", this.products);

            // Limit to 3 products on home page (index.html)
            const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
            const productsToRender = isHomePage ? this.products.slice(0, 3) : this.products;

            this.renderProducts(productsToRender);

        } catch (err) {
            console.error("❌ Failed to load products:", err);

            document.getElementById("productsGrid").innerHTML =
                "<h2 style='padding:20px'>Failed to load products 😢</h2>";
        }
    },

    renderProducts(products) {
        const grid = document.getElementById("productsGrid");

        grid.innerHTML = products.map(p => {
            const isInWishlist = Wishlist.isInWishlist(p.id);
            const heartIcon = isInWishlist ? '❤️' : '🤍';
            const heartStyle = isInWishlist ? 'color: #ff6b6b;' : 'color: #ccc;';

            return `
            <div class="product-card" style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: all 0.3s ease; margin: 0; padding: 20px;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">

                <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 12px; margin-bottom: 15px;">

                <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #333;">${p.name}</h3>
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #666; line-height: 1.4;">${p.description || "Premium product"}</p>

                <h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700; color: #ff6b6b;">₹${p.price}</h2>

                <div class="qty-control" style="display: flex; gap: 10px; margin: 15px 0; align-items: center; justify-content: center;">
                    <button onclick="changeQty(${p.id}, -1)" style="padding: 8px 12px; background: #f0f0f0; border: none; border-radius: 6px; cursor: pointer; font-size: 18px;">−</button>
                    <span id="qty-${p.id}" style="font-size: 16px; font-weight: 600; min-width: 30px; text-align: center;">0</span>
                    <button onclick="changeQty(${p.id}, 1)" style="padding: 8px 12px; background: #f0f0f0; border: none; border-radius: 6px; cursor: pointer; font-size: 18px;">+</button>
                </div>

                <div class="actions" style="display: flex; gap: 10px;">
                    <button onclick="addToCart(${p.id})" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #ff6b6b, #ff8e8e); color: white; border: none; cursor: pointer; border-radius: 8px; font-weight: 500; transition: all 0.3s ease;" onmouseover="this.style.background='linear-gradient(135deg, #ff5252, #ff7a7a)';" onmouseout="this.style.background='linear-gradient(135deg, #ff6b6b, #ff8e8e)'">Add to Cart</button>
                    <button onclick="toggleWishlist(${p.id})" style="padding: 12px; background: #f0f0f0; border: none; cursor: pointer; border-radius: 8px; font-size: 18px; transition: all 0.3s ease;" onmouseover="this.style.background='#e0e0e0';" onmouseout="this.style.background='#f0f0f0'" id="wishlist-btn-${p.id}" style="${heartStyle}">${heartIcon}</button>
                </div>

            </div>
        `;
        }).join('');
    }
};

// ===== Quantity =====
const qtyMap = {};

function changeQty(id, change) {
    if (!qtyMap[id]) qtyMap[id] = 0;

    qtyMap[id] += change;
    if (qtyMap[id] < 0) qtyMap[id] = 0;

    document.getElementById(`qty-${id}`).innerText = qtyMap[id];
}

// ===== Add to Cart =====
function addToCart(id) {
    const qty = qtyMap[id] || 0;
    if (qty === 0) {
        // If quantity is 0, add 1 item by default
        Cart.addToCart(id, 1);
    } else {
        // Add the selected quantity
        Cart.addToCart(id, qty);
    }
    // Reset quantity to 0 after adding to cart
    qtyMap[id] = 0;
    document.getElementById(`qty-${id}`).innerText = 0;
    Toast?.success?.("Added to cart 🛒") || alert("Added to cart 🛒");
}

// ===== Wishlist =====
function toggleWishlist(id) {
    Wishlist.toggle(id);
    const isInWishlist = Wishlist.isInWishlist(id);
    const heartIcon = isInWishlist ? '❤️' : '🤍';
    const heartStyle = isInWishlist ? 'color: #ff6b6b;' : 'color: #ccc;';
    
    const btn = document.getElementById(`wishlist-btn-${id}`);
    if (btn) {
        btn.innerText = heartIcon;
        btn.style.color = heartStyle;
    }
    
    Toast?.success?.(isInWishlist ? "Added to wishlist ❤️" : "Removed from wishlist") || alert(isInWishlist ? "Added to wishlist ❤️" : "Removed from wishlist");
    
    // Re-render to update all wishlist states
    ShopManager.renderProducts(ShopManager.products);
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
    ShopManager.init();
});
