// ============================================
// PAWFECT MATCHES - ORDER SYSTEM
// ============================================

const Orders = {

    // GET ALL ORDERS
    getOrders() {
        return Utils.getStorage("orders", []);
    },

    // SAVE ORDER
    saveOrder(order) {
        let orders = this.getOrders();
        orders.unshift(order); // latest first
        Utils.setStorage("orders", orders);
    },

    // PLACE ORDER
    placeOrder(orderData) {
        const order = {
            id: "ORD-" + Date.now(),
            date: new Date().toISOString(),
            items: Cart.getCart(),
            user: orderData.user,
            payment: orderData.payment,
            status: "Placed"
        };

        this.saveOrder(order);
        Cart.clearCart();

        return order;
    }
};

// GLOBAL
window.Orders = Orders;