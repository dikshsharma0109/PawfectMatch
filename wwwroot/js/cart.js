// ============================================
// PAWFECT MATCHES - CART (FINAL FIXED)
// ============================================

const Cart = {

    key: "cart",

    getCart() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    },

    saveCart(cart) {
        localStorage.setItem(this.key, JSON.stringify(cart));
        this.updateUI();
        this.renderCart();
    },

    addToCart(productId, qty = 1) {
        const cart = this.getCart();

        const existing = cart.find(i => i.productId == productId);

        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({ productId, qty });
        }

        this.saveCart(cart);
    },

    updateQuantity(productId, qty) {
        const cart = this.getCart();

        const item = cart.find(i => i.productId == productId);

        if (item) {
            item.qty = Math.max(1, qty);
        }

        this.saveCart(cart);
    },

    removeItem(productId) {
        let cart = this.getCart();
        cart = cart.filter(i => i.productId != productId);
        this.saveCart(cart);
    },

    getTotalCount() {
        return this.getCart().reduce((sum, i) => sum + i.qty, 0);
    },

    getTotalPrice() {
        const cart = this.getCart();
        const products = ShopManager.products || [];
        return cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            return sum + (product ? product.price * item.qty : 0);
        }, 0);
    },

    updateUI() {
        const count = this.getTotalCount();

        const cartIcon = document.getElementById("cartCount");
        if (cartIcon) {
            cartIcon.innerText = count;
        }

        const totalEl = document.getElementById("total");
        if (totalEl) {
            totalEl.innerText = `Total: ₹${this.getTotalPrice()}`;
        }
    },

    renderCart() {
        const cart = this.getCart();
        const container = document.getElementById("cartItems");
        if (!container) return;

        const products = ShopManager.products || [];

        if (cart.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #999;">
                    <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 15px; color: #ddd;"></i>
                    <p style="font-size: 16px;">Your cart is empty</p>
                    <button onclick="closeCart()" style="margin-top: 15px; padding: 10px 25px; background: #ff6b6b; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">Continue Shopping</button>
                </div>
            `;
            return;
        }

        container.innerHTML = cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return '';

            return `
                <div style="display: flex; gap: 15px; margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 12px; transition: all 0.3s ease;" onmouseover="this.style.background='#f0f0f0';" onmouseout="this.style.background='#f9f9f9'">
                    <img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <h4 style="margin: 0 0 5px 0; font-size: 15px; font-weight: 600; color: #333;">${product.name}</h4>
                            <p style="margin: 0 0 10px 0; color: #ff6b6b; font-weight: 700; font-size: 16px;">₹${product.price}</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button onclick="Cart.updateQuantity(${item.productId}, ${item.qty - 1})" style="width: 32px; height: 32px; background: white; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; color: #333; transition: all 0.3s ease;" onmouseover="this.style.borderColor='#ff6b6b'; this.style.color='#ff6b6b';" onmouseout="this.style.borderColor='#e0e0e0'; this.style.color='#333';">−</button>
                            <span style="font-weight: 700; font-size: 16px; min-width: 30px; text-align: center;">${item.qty}</span>
                            <button onclick="Cart.updateQuantity(${item.productId}, ${item.qty + 1})" style="width: 32px; height: 32px; background: white; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; color: #333; transition: all 0.3s ease;" onmouseover="this.style.borderColor='#ff6b6b'; this.style.color='#ff6b6b';" onmouseout="this.style.borderColor='#e0e0e0'; this.style.color='#333';">+</button>
                            <button onclick="Cart.removeItem(${item.productId})" style="margin-left: auto; padding: 8px 15px; background: #ff6b6b; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.3s ease;" onmouseover="this.style.background='#ff5252';" onmouseout="this.style.background='#ff6b6b';">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML += `
            <div style="margin-top: 25px; padding: 25px; background: linear-gradient(135deg, #f9f9f9, #f0f0f0); border-radius: 12px; border: 2px solid #e0e0e0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <span style="font-size: 18px; font-weight: 600; color: #666;">Subtotal:</span>
                    <span style="font-size: 24px; font-weight: 700; color: #333;">₹${this.getTotalPrice()}</span>
                </div>
                <button onclick="window.location.href='checkout-form.html'" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #ff6b6b, #ff8e8e); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255,107,107,0.3);" onmouseover="this.style.background='linear-gradient(135deg, #ff5252, #ff7a7a)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='linear-gradient(135deg, #ff6b6b, #ff8e8e)'; this.style.transform='translateY(0)';">Proceed to Checkout</button>
            </div>
        `;
    },

    loadCart() {
        this.renderCart();
    }
};

// ============================================
// PAWFECT MATCHES - WISHLIST
// ============================================

const Wishlist = {

    key: "wishlist",

    getWishlist() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    },

    saveWishlist(wishlist) {
        localStorage.setItem(this.key, JSON.stringify(wishlist));
        this.updateUI();
        this.renderWishlist();
    },

    toggle(productId) {
        const wishlist = this.getWishlist();
        const index = wishlist.indexOf(productId);

        if (index > -1) {
            wishlist.splice(index, 1);
        } else {
            wishlist.push(productId);
        }

        this.saveWishlist(wishlist);
    },

    remove(productId) {
        let wishlist = this.getWishlist();
        wishlist = wishlist.filter(id => id !== productId);
        this.saveWishlist(wishlist);
    },

    isInWishlist(productId) {
        const wishlist = this.getWishlist();
        return wishlist.includes(productId);
    },

    updateUI() {
        const count = this.getWishlist().length;
        const wishlistIcon = document.getElementById("wishlistCount");
        if (wishlistIcon) {
            wishlistIcon.innerText = count;
        }
    },

    renderWishlist() {
        const wishlist = this.getWishlist();
        const container = document.getElementById("wishlistItems");
        if (!container) return;

        const products = ShopManager.products || [];

        if (wishlist.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #999;">
                    <i class="fas fa-heart" style="font-size: 48px; margin-bottom: 15px; color: #ddd;"></i>
                    <p style="font-size: 16px;">Your wishlist is empty</p>
                    <button onclick="closeWishlist()" style="margin-top: 15px; padding: 10px 25px; background: #ff6b6b; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">Continue Shopping</button>
                </div>
            `;
            return;
        }

        container.innerHTML = wishlist.map(productId => {
            const product = products.find(p => p.id === productId);
            if (!product) return '';

            return `
                <a href="shop.html" style="display: flex; gap: 10px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; text-decoration: none; color: inherit; transition: all 0.3s ease;" onmouseover="this.style.background='#f9f9f9';" onmouseout="this.style.background='transparent';">
                    <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0; font-size: 14px;">${product.name}</h4>
                        <p style="margin: 0 0 5px 0; color: #ff6b6b; font-weight: 600;">₹${product.price}</p>
                        <button onclick="event.preventDefault(); event.stopPropagation(); Wishlist.remove(${productId}); ShopManager.renderProducts(ShopManager.products);" style="padding: 4px 8px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Remove</button>
                    </div>
                </a>
            `;
        }).join('');
    }
};

// INIT
document.addEventListener("DOMContentLoaded", () => {
    Cart.updateUI();
    Wishlist.updateUI();
});