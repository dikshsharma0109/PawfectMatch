// ============================================
// API SERVICE - CONNECTED TO REAL BACKEND (SECURED)
// ============================================

const API = {
    baseUrl: "https://localhost:44357",

    async request(endpoint, options = {}) {
        const token = localStorage.getItem("token")
            || (typeof Utils !== "undefined" ? Utils.getStorage?.("authToken") : null);

        try {
            const fullUrl = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
            console.log(`📡 API CALL: ${options.method || 'GET'} ${fullUrl}`);

            // 🔥 GET USER FROM LOCAL STORAGE (fresh for each request)
            const user = JSON.parse(localStorage.getItem("pawfect_user_data") || "{}");

            const res = await fetch(fullUrl, {
                ...options,

                headers: {
                    "Content-Type": "application/json",

                    // 🔐 TOKEN (if exists)
                    ...(token && { Authorization: `Bearer ${token}` }),

                    // 🔥 ADMIN ROLE (MOST IMPORTANT - fetched fresh for each request)
                    "role": user?.role || "user",

                    // Keep any custom headers
                    ...(options.headers || {})
                }
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                console.error("❌ API ERROR RESPONSE:", data);
                throw new Error(data.message || data.title || `HTTP ${res.status}`);
            }

            console.log(`✅ API SUCCESS: ${endpoint}`);
            return data;

        } catch (err) {
            console.error(`❌ API FAILED: ${endpoint}`, err.message);
            throw err;
        }
    },

    // ===============================
    // POST
    // ===============================
    post(endpoint, body) {
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(body)
        });
    },

    // ===============================
    // GET
    // ===============================
    get(endpoint) {
        return this.request(endpoint, { method: "GET" });
    },

    // ===============================
    // PUT
    // ===============================
    put(endpoint, body) {
        return this.request(endpoint, {
            method: "PUT",
            body: JSON.stringify(body)
        });
    },

    // ===============================
    // DELETE
    // ===============================
    delete(endpoint) {
        return this.request(endpoint, {
            method: "DELETE"
        });
    }
};

window.API = API;

console.log("✅ API service loaded with baseUrl:", API.baseUrl);