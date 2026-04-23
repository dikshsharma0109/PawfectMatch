// ============================================
// PAWFECT MATCHES - CONFIGURATION (FIXED)
// ============================================

const CONFIG = {
    // API Base URL - ASP.NET backend
    API_BASE_URL: '/api',

    // API Endpoints
    ENDPOINTS: {
        // Auth
        LOGIN: '/users/login',
        REGISTER: '/users/register',
        LOGOUT: '/users/logout',
        REFRESH_TOKEN: '/users/refresh',

        // Users
        USERS: '/users',
        USER_PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile/update',

        // Pets
        PETS: '/pets',
        PET_BY_ID: '/pets/',
        MY_PETS: '/pets/user/',
        ADD_PET: '/pets',
        UPDATE_PET: '/pets/update/',
        DELETE_PET: '/pets/',
        PET_CATEGORIES: '/pets/categories',

        // Products
        PRODUCTS: '/products',
        PRODUCT_BY_ID: '/products/',
        MY_PRODUCTS: '/products/my-products',
        ADD_PRODUCT: '/products',
        UPDATE_PRODUCT: '/products/update/',
        DELETE_PRODUCT: '/products/',
        PRODUCT_CATEGORIES: '/products/categories',

        // Cart
        CART: '/cart',
        ADD_TO_CART: '/cart/add',
        UPDATE_CART: '/cart/update',
        REMOVE_FROM_CART: '/cart/remove/',
        CLEAR_CART: '/cart/clear',

        // Orders
        ORDERS: '/orders',
        CREATE_ORDER: '/orders/create',
        ORDER_BY_ID: '/orders/',

        // Favorites
        FAVORITES: '/favorites',
        ADD_FAVORITE: '/favorites/add',
        REMOVE_FAVORITE: '/favorites/remove/',

        // Messages
        MESSAGES: '/messages',
        SEND_MESSAGE: '/messages/send',
        CONVERSATIONS: '/messages/conversations',

        // Adoption Requests
        ADOPTION_REQUESTS: '/adoption-requests',
        SEND_REQUEST: '/adoption-requests/send',
        UPDATE_REQUEST: '/adoption-requests/update/'
        ,
        // Admin
        ADMIN_METRICS: '/adminapi/metrics'
    },

    // Storage Keys
    STORAGE_KEYS: {
        AUTH_TOKEN: 'pawfect_auth_token',
        USER_DATA: 'pawfect_user_data',
        CART: 'pawfect_cart',
        FAVORITES: 'pawfect_favorites',
        RECENT_SEARCHES: 'pawfect_recent_searches'
    },

    // Pagination
    DEFAULT_PAGE_SIZE: 12,

    // Image Upload
    MAX_IMAGE_SIZE: 5 * 1024 * 1024,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_IMAGES_PER_LISTING: 5,

    // Validation
    VALIDATION: {
        MIN_PASSWORD_LENGTH: 8,
        MAX_NAME_LENGTH: 50,
        MAX_DESCRIPTION_LENGTH: 2000,
        PHONE_REGEX: /^[6-9]\d{9}$/,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PIN_REGEX: /^\d{6}$/
    }
};

// ✅ Freeze AFTER object creation
Object.freeze(CONFIG);
Object.freeze(CONFIG.ENDPOINTS);
Object.freeze(CONFIG.STORAGE_KEYS);
Object.freeze(CONFIG.VALIDATION);