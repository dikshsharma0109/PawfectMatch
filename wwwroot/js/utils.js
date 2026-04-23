// ============================================
// PAWFECT MATCHES - UTILITY FUNCTIONS
// ============================================

const Utils = {

    // ============ DOM UTILITIES ============

    $(selector, parent = document) {
        return parent.querySelector(selector);
    },

    $$(selector, parent = document) {
        return parent.querySelectorAll(selector);
    },

    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on')) {
                element.addEventListener(key.substring(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });

        if (typeof content === 'string') {
            element.innerHTML = content;
        } else if (content instanceof Node) {
            element.appendChild(content);
        } else if (Array.isArray(content)) {
            content.forEach(child => {
                if (child instanceof Node) element.appendChild(child);
            });
        }

        return element;
    },

    // ============ STORAGE UTILITIES ============

    getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage read error:', error);
            return defaultValue;
        }
    },

    setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage write error:', error);
            return false;
        }
    },

    removeStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    clearStorage() {
        Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    },

    // ============ VALIDATION UTILITIES ============

    isValidEmail(email) {
        return CONFIG.VALIDATION.EMAIL_REGEX.test(email);
    },

    isValidPhone(phone) {
        return CONFIG.VALIDATION.PHONE_REGEX.test(phone);
    },

    isValidPIN(pin) {
        return CONFIG.VALIDATION.PIN_REGEX.test(pin);
    },

    isValidPassword(password) {
        return password.length >= CONFIG.VALIDATION.MIN_PASSWORD_LENGTH;
    },

    validateForm(formData, rules) {
        const errors = {};

        Object.entries(rules).forEach(([field, fieldRules]) => {
            const value = formData[field];

            fieldRules.forEach(rule => {
                if (errors[field]) return;

                switch (rule.type) {

                    case 'required':
                        if (!value || (typeof value === 'string' && !value.trim())) {
                            errors[field] = rule.message || `${field} is required`;
                        }
                        break;

                    case 'email':
                        if (value && !this.isValidEmail(value)) {
                            errors[field] = rule.message || 'Invalid email';
                        }
                        break;

                    case 'phone':
                        if (value && !this.isValidPhone(value)) {
                            errors[field] = rule.message || 'Invalid phone number';
                        }
                        break;

                    case 'pin':
                        if (value && !this.isValidPIN(value)) {
                            errors[field] = rule.message || 'Invalid PIN';
                        }
                        break;

                    case 'minLength':
                        if (value && value.length < rule.value) {
                            errors[field] = rule.message || `Min ${rule.value} chars required`;
                        }
                        break;

                    case 'match':
                        if (value !== formData[rule.field]) {
                            errors[field] = rule.message || 'Values do not match';
                        }
                        break;

                    case 'pattern':
                        if (value && !rule.value.test(value)) {
                            errors[field] = rule.message || 'Invalid format';
                        }
                        break;
                }
            });
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    },

    // ============ FORMAT UTILITIES ============

    formatPrice(price, currency = '₹') {
        return `${currency}${parseFloat(price || 0).toLocaleString('en-IN')}`;
    },

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-IN');
    },

    formatAge(months) {
        months = parseInt(months);

        if (months < 12) return `${months} month(s)`;

        const years = Math.floor(months / 12);
        const remaining = months % 12;

        return remaining
            ? `${years}y ${remaining}m`
            : `${years} year(s)`;
    },

    truncateText(text, max = 100) {
        return text.length > max ? text.slice(0, max) + '...' : text;
    },

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // ============ ID GENERATION ============

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    },

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // ============ URL UTILITIES ============

    getUrlParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    },

    // ============ IMAGE UTILITIES ============

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    },

    validateImage(file) {
        const errors = [];

        if (!CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
            errors.push('Only JPG, PNG, WEBP allowed');
        }

        if (file.size > CONFIG.MAX_IMAGE_SIZE) {
            errors.push('Max size 5MB');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // ============ ARRAY UTILITIES ============

    filterBySearch(array, search, keys) {
        const term = search.toLowerCase();

        return array.filter(item =>
            keys.some(key =>
                item[key]?.toString().toLowerCase().includes(term)
            )
        );
    },

    sortBy(array, key) {
        return [...array].sort((a, b) => a[key] > b[key] ? 1 : -1);
    },

    // ============ CLONE ============

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};

// Make global
window.Utils = Utils;