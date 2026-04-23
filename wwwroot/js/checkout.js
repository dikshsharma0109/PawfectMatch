async function loadSummary() {
    const res = await API.get(CONFIG.ENDPOINTS.CART);
    const items = res.data.items;

    const container = document.getElementById("summary");
    const totalEl = document.getElementById("total");

    container.innerHTML = "";
    let total = 0;

    items.forEach(item => {
        total += item.product.price * item.quantity;

        container.innerHTML += `
            <div class="summary-item">
                ${item.product.name} x ${item.quantity}
                <br>₹${item.product.price}
            </div>
        `;
    });

    totalEl.innerText = "Total: ₹" + total;
}

async function placeOrder() {
    const data = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        pincode: document.getElementById("pincode").value,
        paymentMethod: document.getElementById("payment").value
    };

    // Basic validation
    if (!data.name || !data.phone || !data.address) {
        alert("Please fill all required fields ❌");
        return;
    }
    if (data.city !== "Ahmedabad") {
        alert("Service only available in Ahmedabad ❌");
        return;
    }

    try {
        await API.post(CONFIG.ENDPOINTS.CREATE_ORDER, data);

        alert("Order placed successfully 🎉");

        window.location.href = "success.html";
    } catch (err) {
        alert("Order failed ❌");
    }
}

loadSummary();