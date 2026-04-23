// ============================================
// PAWFECT MATCHES - AUTH (FINAL WORKING)
// ============================================

const Auth = {

    async init() {
        await this.updateNavbar();
        this.setupEventListeners();
        this.redirectAdminIfOnIndex();
    },

    // Email validation with proper regex
    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    },

    redirectAdminIfOnIndex() {
        const user = this.getCurrentUser();
        const currentPath = window.location.pathname;
        
        // Check if current page is index.html and user is admin
        if (user && user.role === "admin" && (currentPath.includes("index.html") || currentPath === "/")) {
            window.location.href = "admin.html";
        }
    },

    isLoggedIn() {
        const token = Utils.getStorage(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        const user = Utils.getStorage(CONFIG.STORAGE_KEYS.USER_DATA);
        return !!(token && user);
    },

    getCurrentUser() {
        const user = Utils.getStorage(CONFIG.STORAGE_KEYS.USER_DATA);
        if (user && !user.id && (user.UserId || user.userId)) {
            // Normalize existing user data if it has UserId but not id
            const normalizedUser = this.normalizeUser(user);
            // Update localStorage with normalized data
            Utils.setStorage(CONFIG.STORAGE_KEYS.USER_DATA, normalizedUser);
            return normalizedUser;
        }
        return user;
    },

    // ========================
    // NAVBAR
    // ========================

    async updateNavbar() {
        const user = this.getCurrentUser();
        const authContainer = Utils.$('.nav-auth');

        if (!authContainer) return;

        if (user && user.firstName) {
            let myPetsButton = '';
            let adoptionRequestButton = '';
            
            // For non-admin users, always show both buttons
            if (user.role !== "admin") {
                myPetsButton = `<a href="owner-dashboard.html" class="btn btn-outline" style="margin-right: 8px;">My Pets</a>`;
                adoptionRequestButton = `<a href="adoption-requests.html" class="btn btn-outline" style="margin-right: 8px;">Adoption Request</a>`;
            }

            authContainer.innerHTML = `
                <div class="user-menu">
                    <span style="margin-right: 10px;">
                        Hi, ${user.firstName} ${user.role === "admin" ? "👑" : ""}
                    </span>
                    ${adoptionRequestButton}
                    ${myPetsButton}
                    <button class="btn btn-outline" id="logoutBtn">Logout</button>
                </div>
            `;

            setTimeout(() => {
                const btn = document.getElementById('logoutBtn');
                if (btn) btn.addEventListener('click', () => this.logout());
            }, 0);

        } else {
            authContainer.innerHTML = `
                <a href="login.html" class="btn btn-dark">Log in</a>
                <a href="register.html" class="btn btn-outline">Sign up</a>
            `;
        }
    },

    // ========================
    // EVENTS
    // ========================

    setupEventListeners() {
        const loginForm = Utils.$('#loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const registerForm = Utils.$('#registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    },

    // ========================
    // NORMALIZE USER
    // ========================

    normalizeUser(raw) {
        return {
            id: raw.userId ?? raw.UserId ?? raw.id ?? raw.ID ?? null,
            firstName: raw.firstName ?? raw.FirstName ?? '',
            lastName: raw.lastName ?? raw.LastName ?? '',
            email: raw.email ?? raw.Email ?? '',
            role: raw.role ?? raw.Role ?? 'user',
            avatar: raw.avatar ?? raw.Avatar ?? null
        };
    },

    // ========================
    // LOGIN ✅ FIXED HERE
    // ========================

    async handleLogin(e) {
        e.preventDefault();

        const formData = {
            email: Utils.$('#loginEmail').value.trim(),
            password: Utils.$('#loginPassword').value
        };

        // Validate email format
        if (!this.validateEmail(formData.email)) {
            Toast.error("Please enter a valid email address (e.g., user@example.com)");
            return;
        }

        try {
            let res;

            // Try common login routes
            try {
                res = await API.post("/api/Users/login", formData);
                console.log("✅ Login via /api/Users/login");
            } catch {
                res = await API.post("/api/Auth/login", formData);
                console.log("✅ Login via /api/Auth/login");
            }

            const user = this.normalizeUser(res.data.user || res.data);

            Utils.setStorage(CONFIG.STORAGE_KEYS.AUTH_TOKEN, res.data.token);
            Utils.setStorage(CONFIG.STORAGE_KEYS.USER_DATA, user);

            Toast.success("Login successful ✅");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 800);

        } catch (err) {
            console.error(err);
            Toast.error("Login failed ❌ (Check API route)");
        }
    },

    // ========================
    // REGISTER
    // ========================

    async handleRegister(e) {
        e.preventDefault();

        const formData = {
            firstName: Utils.$('#firstName').value.trim(),
            lastName: Utils.$('#lastName').value.trim(),
            email: Utils.$('#registerEmail').value.trim(),
            phone: Utils.$('#phone').value.trim(),
            city: Utils.$('#city').value || "Ahmedabad",
            pincode: Utils.$('#pincode').value.trim(),
            password: Utils.$('#registerPassword').value,
            role: "user"
        };

        // Validate email format
        if (!this.validateEmail(formData.email)) {
            Toast.error("Please enter a valid email address (e.g., user@example.com)");
            return;
        }

        if (!formData.email || !formData.password || !formData.firstName) {
            Toast.error("Please fill all required fields");
            return;
        }

        try {
            const res = await API.post("/api/Users/register", formData);

            const user = this.normalizeUser(res.data.user);

            Utils.setStorage(CONFIG.STORAGE_KEYS.AUTH_TOKEN, res.data.token);
            Utils.setStorage(CONFIG.STORAGE_KEYS.USER_DATA, user);

            Toast.success("Registration Successful! ✅ Redirecting...");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } catch (err) {
            Toast.error(err.message || "Registration failed ❌");
        }
    },

    // ========================
    // LOGOUT
    // ========================

    logout() {
        Utils.removeStorage(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        Utils.removeStorage(CONFIG.STORAGE_KEYS.USER_DATA);

        Toast.success("Logged out successfully");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 800);
    }
};

// GLOBAL
window.Auth = Auth;

// INIT
document.addEventListener("DOMContentLoaded", () => {
    Auth.init();
    console.log("✅ Auth system initialized");
});