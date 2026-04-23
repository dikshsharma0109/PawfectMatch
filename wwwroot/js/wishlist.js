const Wishlist = {

    toggle(productId) {
        let list = JSON.parse(localStorage.getItem("wishlist") || "[]");

        if (list.includes(productId)) {
            list = list.filter(id => id !== productId);
        } else {
            list.push(productId);
        }

        localStorage.setItem("wishlist", JSON.stringify(list));
        this.updateCount();
    },

    updateCount() {
        const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
        const el = document.getElementById("wishlistCount");

        if (el) el.innerText = list.length;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    Wishlist.updateCount();
});