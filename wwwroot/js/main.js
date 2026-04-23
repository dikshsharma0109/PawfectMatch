// ============================================
// PAWFECT MATCHES - MAIN INITIALIZATION
// ============================================

const Toast = {
    container: null,
    init() {
        this.container = document.getElementById('toastContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toastContainer';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },
    show(message, type = 'info', duration = 3000) {
        if (!this.container) this.init();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            <span class="toast-close" onclick="this.parentElement.remove()">×</span>
        `;
        this.container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    success(msg) { this.show(msg, 'success'); },
    error(msg) { this.show(msg, 'error'); }
};

const App = {
    init() {
        console.log("🚀 App initializing...");
        Toast.init();
        this.updateAuthUI();
        // Removed throttle call to prevent error
    },

    updateAuthUI() {
        if (typeof Auth === "undefined") {
            console.warn("Auth not loaded yet");
            return;
        }
        const user = Auth.getCurrentUser();
        console.log("Current user:", user ? user.firstName : "Not logged in");
    }
};

// Globals
window.Toast = Toast;
window.App = App;

// Init when everything is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});