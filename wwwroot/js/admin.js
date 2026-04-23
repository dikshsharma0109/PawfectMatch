// ============================================
// PAWFECT MATCHES - ADMIN DASHBOARD
// ============================================

const Admin = {

    editingItem: null,
    editingPet: null,
    cachedItems: [],
    cachedUsers: [],
    cachedOrders: [],
    cachedAdoptionRequests: [],
    cachedPets: [],

    init() {
        this.checkAdmin();
        this.loadDashboardStats();
        this.setupDropdown();
    },

    checkAdmin() {
        const user = Utils.getStorage(CONFIG.STORAGE_KEYS.USER_DATA);
        if (!user || user.role !== "admin") {
            Toast.error("Access denied. Admin privileges required.");
            window.location.href = "index.html";
            return false;
        }
        return true;
    },

    setupDropdown() {
        const dropdown = document.getElementById('navUserDropdown');
        if (dropdown) {
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });
        }
        document.addEventListener('click', () => {
            if (dropdown) dropdown.classList.remove('active');
        });
    },

    showSection(sectionName) {
        document.querySelectorAll('.admin-section').forEach(section => {
            section.style.display = 'none';
        });
        const targetSection = document.getElementById(`${sectionName}Section`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.closest('.sidebar-link')?.classList.add('active');
        if (sectionName === 'dashboard') {
            this.loadDashboardStats();
        } else if (sectionName === 'items') {
            this.loadItems();
        } else if (sectionName === 'users') {
            this.loadUsers();
        } else if (sectionName === 'pets') {
            this.loadPets();
        } else if (sectionName === 'orders') {
            this.loadOrders();
        } else if (sectionName === 'adoptionRequests') {
            this.loadAdoptionRequests();
        } else if (sectionName === 'addPet') {
            // Removed resetPetForm call
        }
    },

    async loadDashboardStats() {
        try {
            const [products, users] = await Promise.all([
                API.get('/api/Products'),
                API.get('/api/Users')
            ]);

            // Try to load orders, but don't fail if endpoint doesn't exist
            let orders = [];
            try {
                orders = await API.get('/api/Orders');
            } catch (e) {
                console.log('Orders endpoint not available, skipping');
            }

            // Try to load pets, but don't fail if endpoint doesn't exist
            let pets = [];
            try {
                pets = await API.get('/api/Pets');
            } catch (e) {
                console.log('Pets endpoint not available, skipping');
            }

            console.log('Dashboard API responses:', { products, users, orders, pets });

            this.cachedItems = products?.data || products || [];
            this.cachedUsers = users?.data || users || [];
            this.cachedOrders = orders?.data || orders || [];
            this.cachedPets = pets?.data || pets || [];
            const categories = [...new Set(this.cachedItems.map(item => item.Category))];
            document.getElementById('totalItems').textContent = this.cachedItems.length;
            document.getElementById('totalCategories').textContent = categories.length;
            document.getElementById('totalUsers').textContent = this.cachedUsers.length;
            document.getElementById('totalOrders').textContent = this.cachedOrders.length;
            document.getElementById('totalPets').textContent = this.cachedPets.length;
            this.loadRecentItems(this.cachedItems);
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            Toast.error('Failed to load dashboard data');
        }
    },

    loadRecentItems(items) {
        const recentItemsContainer = document.getElementById('recentItems');
        if (!items || items.length === 0) {
            recentItemsContainer.innerHTML = '<p style="color: #999;">No items yet</p>';
            return;
        }
        const recentItems = items.slice(-5).reverse();
        recentItemsContainer.innerHTML = recentItems.map(item => {
            const imageUrl = item.Images && item.Images.length > 0 ? item.Images[0].ImageUrl : 'https://via.placeholder.com/50';
            return `
            <div style="display: flex; align-items: center; gap: 15px; padding: 12px; background: #f8f9fa; border-radius: 8px; margin-bottom: 10px;">
                <img src="${imageUrl}" alt="${item.Name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 4px 0; font-size: 14px;">${item.Name}</h4>
                    <p style="margin: 0; font-size: 12px; color: #666;">${item.Category} • ₹${item.Price}</p>
                </div>
                <span style="font-size: 11px; color: #999;">${item.CreatedAt ? Utils.formatDate(item.CreatedAt) : 'N/A'}</span>
            </div>
            `;
        }).join('');
    },

    async loadItems() {
        try {
            const response = await API.get('/api/Products');
            this.cachedItems = response?.data || [];
            this.renderItemsTable(this.cachedItems);
        } catch (error) {
            console.error('Error loading items:', error);
            Toast.error('Failed to load items');
            this.renderItemsTable([]);
        }
    },

    renderItemsTable(items) {
        const tbody = document.getElementById('itemsTableBody');
        if (!items || items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No items found</td></tr>';
            return;
        }
        tbody.innerHTML = items.map(item => {
            const imageUrl = item.Images && item.Images.length > 0 ? item.Images[0].ImageUrl : 'https://via.placeholder.com/50';
            return `
            <tr>
                <td><img src="${imageUrl}" alt="${item.Name}"></td>
                <td>${item.Name}</td>
                <td><span style="padding: 4px 12px; background: rgba(255,107,107,0.1); color: #ff6b6b; border-radius: 20px; font-size: 12px;">${item.Category || 'N/A'}</span></td>
                <td><strong>₹${item.Price}</strong></td>
                <td>${Utils.truncateText(item.Description, 30)}</td>
                <td>
                    <button class="btn-sm btn-edit" onclick="Admin.editItem('${item.ProductId}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-sm btn-delete" onclick="Admin.deleteItem('${item.ProductId}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
            `;
        }).join('');
    },

    filterItems() {
        const searchTerm = document.getElementById('itemSearch').value.toLowerCase();
        const categoryFilter = document.getElementById('itemCategoryFilter').value;
        let items = [...this.cachedItems];
        if (searchTerm) {
            items = items.filter(item =>
                item.Name.toLowerCase().includes(searchTerm) ||
                item.Description.toLowerCase().includes(searchTerm)
            );
        }
        if (categoryFilter) {
            items = items.filter(item => item.Category === categoryFilter);
        }
        this.renderItemsTable(items);
    },

    async addItem(event) {
        event.preventDefault();
        const name = document.getElementById('itemName').value;
        const category = document.getElementById('itemCategory').value;
        const price = parseFloat(document.getElementById('itemPrice').value);
        const description = document.getElementById('itemDescription').value;
        const imageInput = document.getElementById('itemImage');
        
        let images = [];
        if (imageInput.files && imageInput.files[0]) {
            try {
                const imageUrl = await Utils.fileToBase64(imageInput.files[0]);
                images.push(imageUrl);
            } catch (error) {
                console.error('Image upload error:', error);
            }
        }
        
        const newItem = {
            Name: name,
            Category: category,
            Description: description,
            Price: price,
            Stock: 100,
            PetType: 'general',
            SellerId: 1,
            Images: images
        };
        try {
            await API.post('/api/Products', newItem);
            Toast.success('Item added successfully!');
            document.getElementById('addItemForm').reset();
            this.showSection('items');
        } catch (error) {
            console.error('Error adding item:', error);
            Toast.error('Failed to add item');
        }
    },

    editItem(id) {
        const item = this.cachedItems.find(i => i.ProductId == id); // Use == for type coercion
        if (!item) {
            Toast.error('Item not found');
            return;
        }
        this.editingItem = item;
        document.getElementById('itemName').value = item.Name;
        document.getElementById('itemCategory').value = item.Category || '';
        document.getElementById('itemPrice').value = item.Price;
        document.getElementById('itemDescription').value = item.Description;
        const form = document.getElementById('addItemForm');
        form.onsubmit = (e) => this.updateItem(e, id);
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Item';
        this.showSection('addItem');
    },

    async updateItem(event, id) {
        event.preventDefault();
        const name = document.getElementById('itemName').value;
        const category = document.getElementById('itemCategory').value;
        const price = parseFloat(document.getElementById('itemPrice').value);
        const description = document.getElementById('itemDescription').value;
        const imageInput = document.getElementById('itemImage');
        const currentItem = this.cachedItems.find(i => i.ProductId == id); // Use == for type coercion
        if (!currentItem) {
            Toast.error('Item not found');
            return;
        }
        
        let images = currentItem.Images ? currentItem.Images.map(img => img.ImageUrl) : [];
        if (imageInput.files && imageInput.files[0]) {
            try {
                const imageUrl = await Utils.fileToBase64(imageInput.files[0]);
                images = [imageUrl];
            } catch (error) {
                console.error('Image upload error:', error);
            }
        }
        
        const updatedItem = {
            Name: name,
            Category: category,
            Description: description,
            Price: price,
            Stock: currentItem.Stock || 100,
            PetType: currentItem.PetType || 'general',
            SellerId: currentItem.SellerId || 1,
            Images: images
        };
        try {
            await API.put(`/api/Products/${id}`, updatedItem);
            Toast.success('Item updated successfully!');
            document.getElementById('addItemForm').reset();
            this.editingItem = null;
            const form = document.getElementById('addItemForm');
            form.onsubmit = (e) => this.addItem(e);
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Item';
            this.showSection('items');
        } catch (error) {
            console.error('Error updating item:', error);
            Toast.error('Failed to update item');
        }
    },

    async deleteItem(id) {
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }
        try {
            await API.delete(`/api/Products/${id}`);
            Toast.success('Item deleted successfully!');
            this.loadItems();
            this.loadDashboardStats();
        } catch (error) {
            console.error('Error deleting item:', error);
            Toast.error('Failed to delete item');
        }
    },

    async loadUsers() {
        try {
            const users = await API.get('/api/Users');
            this.cachedUsers = users || [];
            this.renderUsersTable(this.cachedUsers);
        } catch (error) {
            console.error('Error loading users:', error);
            Toast.error('Failed to load users');
            this.renderUsersTable([]);
        }
    },

    async loadPets() {
        try {
            const response = await API.get('/api/Pets');
            console.log('Pets API response:', response);
            this.cachedPets = response?.data || response || [];
            console.log('Cached pets:', this.cachedPets);
            if (this.cachedPets.length > 0) {
                console.log('First pet object:', this.cachedPets[0]);
                console.log('Pet keys:', Object.keys(this.cachedPets[0]));
                console.log('Pet values:', Object.values(this.cachedPets[0]));
            }
            this.renderPetsTable(this.cachedPets);
        } catch (error) {
            console.error('Error loading pets:', error);
            Toast.error('Failed to load pets');
            this.renderPetsTable([]);
        }
    },

    renderPetsTable(pets) {
        const tbody = document.getElementById('petsTableBody');
        if (!pets || pets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">No pets found</td></tr>';
            return;
        }
        tbody.innerHTML = pets.map(pet => {
            const ownerName = pet.owner ? `${pet.owner.firstName || ''} ${pet.owner.lastName || ''}`.trim() : 'N/A';
            const ownerEmail = pet.owner ? pet.owner.email : 'N/A';
            const location = pet.location || 'N/A';
            return `
            <tr>
                <td><strong>${pet.name}</strong></td>
                <td><span style="padding: 4px 12px; background: rgba(255,107,107,0.1); color: #ff6b6b; border-radius: 20px; font-size: 12px;">${pet.type || 'N/A'}</span></td>
                <td>${pet.breed || 'N/A'}</td>
                <td>${pet.age || 'N/A'}</td>
                <td><strong>${ownerName}</strong></td>
                <td>${ownerEmail}</td>
                <td>${location}</td>
                <td><strong>₹${pet.price || 0}</strong></td>
                <td><span style="padding: 4px 12px; background: ${this.getPetStatusColor(pet.status)}; color: white; border-radius: 20px; font-size: 12px;">${pet.status || 'Available'}</span></td>
                <td>
                    <button class="btn-sm btn-edit" onclick="Admin.editPet('${pet.petId}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-sm btn-delete" onclick="Admin.deletePet('${pet.petId}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
            `;
        }).join('');
    },

    getPetStatusColor(status) {
        switch (status) {
            case 'Available': return 'rgba(0, 184, 148, 0.8)';
            case 'Adopted': return 'rgba(108, 92, 231, 0.8)';
            case 'Pending': return 'rgba(255, 193, 7, 0.8)';
            default: return 'rgba(150, 150, 150, 0.8)';
        }
    },

    filterPets() {
        const searchTerm = document.getElementById('petSearch').value.toLowerCase();
        const typeFilter = document.getElementById('petTypeFilter').value;
        const statusFilter = document.getElementById('petStatusFilter').value;
        let pets = [...this.cachedPets];
        
        if (searchTerm) {
            pets = pets.filter(pet =>
                (pet.name && pet.name.toLowerCase().includes(searchTerm)) ||
                (pet.breed && pet.breed.toLowerCase().includes(searchTerm)) ||
                (pet.owner && pet.owner.firstName && pet.owner.firstName.toLowerCase().includes(searchTerm)) ||
                (pet.owner && pet.owner.lastName && pet.owner.lastName.toLowerCase().includes(searchTerm)) ||
                (pet.owner && pet.owner.email && pet.owner.email.toLowerCase().includes(searchTerm))
            );
        }
        
        if (typeFilter) {
            pets = pets.filter(pet => pet.type === typeFilter);
        }
        
        if (statusFilter) {
            pets = pets.filter(pet => pet.status === statusFilter);
        }
        
        this.renderPetsTable(pets);
    },

    addPetSection() {
        this.resetPetForm();
        this.showSection('addPet');
    },

    resetPetForm() {
        document.getElementById('addPetForm').reset();
        this.editingPet = null;
        const form = document.getElementById('addPetForm');
        form.onsubmit = (e) => this.addPet(e);
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Pet';
        document.getElementById('petFormTitle').textContent = 'Add New Pet';
    },

    async addPet(event) {
        event.preventDefault();
        const name = document.getElementById('petName').value;
        const type = document.getElementById('petType').value;
        const breed = document.getElementById('petBreed').value;
        const age = parseInt(document.getElementById('petAge').value);
        const gender = document.getElementById('petGender').value;
        const location = document.getElementById('petLocation').value;
        const price = parseFloat(document.getElementById('petPrice').value);
        const status = document.getElementById('petStatus').value;
        const description = document.getElementById('petDescription').value;

        const userData = Utils.getStorage(CONFIG.STORAGE_KEYS.USER_DATA);
        const userId = userData?.id || userData?.userId || userData?.UserId || 1;

        const newPet = {
            name: name,
            type: type,
            breed: breed,
            age: age,
            gender: gender,
            location: location,
            price: price,
            status: status,
            description: description,
            userId: userId
        };

        try {
            await API.post('/api/Pets', newPet);
            Toast.success('Pet added successfully!');
            this.resetPetForm();
            this.showSection('pets');
            this.loadDashboardStats();
        } catch (error) {
            console.error('Error adding pet:', error);
            Toast.error('Failed to add pet');
        }
    },

    editPet(id) {
        const pet = this.cachedPets.find(p => p.petId == id);
        if (!pet) {
            Toast.error('Pet not found');
            return;
        }
        this.editingPet = pet;
        document.getElementById('petName').value = pet.name || '';
        document.getElementById('petType').value = pet.type || '';
        document.getElementById('petBreed').value = pet.breed || '';
        document.getElementById('petAge').value = pet.age || '';
        document.getElementById('petGender').value = pet.gender || '';
        document.getElementById('petLocation').value = pet.location || '';
        document.getElementById('petPrice').value = pet.price || '';
        document.getElementById('petStatus').value = pet.status || '';
        document.getElementById('petDescription').value = pet.description || '';
        const form = document.getElementById('addPetForm');
        form.onsubmit = (e) => this.updatePet(e, id);
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Pet';
        document.getElementById('petFormTitle').textContent = 'Edit Pet';
        this.showSection('addPet');
    },

    async updatePet(event, id) {
        event.preventDefault();
        const name = document.getElementById('petName').value;
        const type = document.getElementById('petType').value;
        const breed = document.getElementById('petBreed').value;
        const age = parseInt(document.getElementById('petAge').value);
        const gender = document.getElementById('petGender').value;
        const location = document.getElementById('petLocation').value;
        const price = parseFloat(document.getElementById('petPrice').value);
        const status = document.getElementById('petStatus').value;
        const description = document.getElementById('petDescription').value;

        const currentPet = this.cachedPets.find(p => p.petId == id);
        if (!currentPet) {
            Toast.error('Pet not found');
            return;
        }

        const updatedPet = {
            petId: id,
            name: name,
            type: type,
            breed: breed,
            age: age,
            gender: gender,
            location: location,
            price: price,
            status: status,
            description: description,
            userId: currentPet.userId || 1
        };

        try {
            await API.put(`/api/Pets/${id}`, updatedPet);
            Toast.success('Pet updated successfully!');
            this.resetPetForm();
            this.showSection('pets');
            this.loadDashboardStats();
        } catch (error) {
            console.error('Error updating pet:', error);
            Toast.error('Failed to update pet');
        }
    },

    async deletePet(id) {
        if (!confirm('Are you sure you want to delete this pet?')) {
            return;
        }
        try {
            await API.delete(`/api/Pets/${id}`);
            Toast.success('Pet deleted successfully!');
            this.loadPets();
            this.loadDashboardStats();
        } catch (error) {
            console.error('Error deleting pet:', error);
            Toast.error('Failed to delete pet');
        }
    },

    renderUsersTable(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found</td></tr>';
            return;
        }
        tbody.innerHTML = users.map(user => `
            <tr>
                <td><strong>${user.FirstName || user.LastName || 'N/A'}</strong></td>
                <td>${user.Email}</td>
                <td>${user.Phone || 'N/A'}</td>
                <td><span style="padding: 4px 12px; background: ${this.getRoleColor(user.Role)}; color: white; border-radius: 20px; font-size: 12px;">${user.Role || 'user'}</span></td>
                <td>
                    <button class="btn-sm btn-edit" onclick="Admin.editUser('${user.UserId}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-sm btn-delete" onclick="Admin.deleteUser('${user.UserId}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    getRoleColor(role) {
        switch (role) {
            case 'admin': return 'rgba(255, 107, 107, 0.8)';
            case 'moderator': return 'rgba(108, 92, 231, 0.8)';
            default: return 'rgba(0, 184, 148, 0.8)';
        }
    },

    filterUsers() {
        const searchTerm = document.getElementById('userSearch').value.toLowerCase();
        let users = [...this.cachedUsers];
        if (searchTerm) {
            users = users.filter(user =>
                (user.FirstName && user.FirstName.toLowerCase().includes(searchTerm)) ||
                (user.Email && user.Email.toLowerCase().includes(searchTerm))
            );
        }
        this.renderUsersTable(users);
    },

    async addUser(event) {
        event.preventDefault();
        const name = document.getElementById('userName').value;
        const Email = document.getElementById('userEmail').value;
        const Phone = document.getElementById('userPhone').value;
        const role = document.getElementById('userRole').value;
        if (!Utils.isValidEmail(Email)) {
            Toast.error('Invalid Email address');
            return;
        }
        if (!Utils.isValidPhone(Phone)) {
            Toast.error('Invalid Phone number');
            return;
        }
        const newUser = {
            FirstName: name,
            LastName: '',
            Email,
            Phone,
            Role: role,
            Password: 'TempPass123!'
        };
        try {
            await API.post('/api/Users/register', newUser);
            Toast.success('User added successfully!');
            document.getElementById('addUserForm').reset();
            this.showSection('users');
        } catch (error) {
            console.error('Error adding user:', error);
            Toast.error('Failed to add user');
        }
    },

    editUser(id) {
        const user = this.cachedUsers.find(u => u.UserId === Number(id));
        if (!user) {
            Toast.error('User not found');
            return;
        }
        document.getElementById('userName').value = user.FirstName || user.name || '';
        document.getElementById('userEmail').value = user.Email || '';
        document.getElementById('userPhone').value = user.Phone || '';
        document.getElementById('userRole').value = user.Role || 'user';
        const form = document.getElementById('addUserForm');
        form.onsubmit = (e) => this.updateUser(e, id);
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update User';
        this.showSection('addUser');
    },

    async updateUser(event, id) {
        event.preventDefault();
        const name = document.getElementById('userName').value;
        const Email = document.getElementById('userEmail').value;
        const Phone = document.getElementById('userPhone').value;
        const role = document.getElementById('userRole').value;
        if (!Utils.isValidEmail(Email)) {
            Toast.error('Invalid Email address');
            return;
        }
        if (!Utils.isValidPhone(Phone)) {
            Toast.error('Invalid Phone number');
            return;
        }
        const currentUser = this.cachedUsers.find(u => u.UserId === id);
        if (!currentUser) {
            Toast.error('User not found');
            return;
        }
        const updatedUser = {
            UserId: id,
            FirstName: name,
            LastName: currentUser.LastName || '',
            Email,
            Phone,
            Role: role
        };
        try {
            await API.put(`/api/Users/${id}`, updatedUser);
            Toast.success('User updated successfully!');
            document.getElementById('addUserForm').reset();
            const form = document.getElementById('addUserForm');
            form.onsubmit = (e) => this.addUser(e);
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Add User';
            this.showSection('users');
        } catch (error) {
            console.error('Error updating user:', error);
            Toast.error('Failed to update user');
        }
    },

    async deleteUser(id) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }
        try {
            await API.delete(`/api/Users/${id}`);
            Toast.success('User deleted successfully!');
            this.loadUsers();
            this.loadDashboardStats();
        } catch (error) {
            console.error('Error deleting user:', error);
            Toast.error('Failed to delete user');
        }
    },

    async loadOrders() {
        try {
            const response = await API.get('/api/Orders');
            console.log('Orders API response:', response);
            this.cachedOrders = response?.data || response || [];
            this.renderOrdersTable(this.cachedOrders);
        } catch (error) {
            console.error('Error loading orders:', error);
            Toast.error('Failed to load orders');
            this.renderOrdersTable([]);
        }
    },

    renderOrdersTable(orders) {
        const tbody = document.getElementById('ordersTableBody');
        if (!orders || orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No orders found</td></tr>';
            return;
        }
        tbody.innerHTML = orders.map(order => {
            const currentStatus = order.Status || order.status || 'pending';
            return `
            <tr>
                <td><strong>${order.OrderId || order.orderId || order.id || 'N/A'}</strong></td>
                <td>${order.FullName || order.fullName || order.customerName || order.customer || 'N/A'}</td>
                <td>${order.Items?.length || order.items?.length || order.itemCount || 0} items</td>
                <td><strong>₹${order.TotalAmount || order.totalAmount || order.total || 0}</strong></td>
                <td><span style="padding: 4px 12px; background: ${this.getPaymentMethodColor(order.PaymentMethod || order.paymentMethod)}; color: white; border-radius: 20px; font-size: 12px;">${this.getPaymentMethodLabel(order.PaymentMethod || order.paymentMethod)}</span></td>
                <td><span style="padding: 4px 12px; background: ${this.getPaymentStatusColor(order.PaymentStatus || order.paymentStatus)}; color: white; border-radius: 20px; font-size: 12px;">${this.getPaymentStatusLabel(order.PaymentStatus || order.paymentStatus)}</span></td>
                <td>
                    <select onchange="Admin.updateOrderStatus(${order.OrderId || order.orderId || order.id}, this.value)" style="padding: 6px 10px; border-radius: 6px; border: 1px solid #ddd; background: ${this.getStatusColor(currentStatus)}; color: white; font-size: 12px; cursor: pointer; outline: none;">
                        <option value="Pending" ${currentStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${currentStatus === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Delivered" ${currentStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Failed" ${currentStatus === 'Failed' ? 'selected' : ''}>Failed</option>
                    </select>
                </td>
                <td>${order.OrderDate || order.orderDate || order.date || order.createdAt ? Utils.formatDate(order.OrderDate || order.orderDate || order.date || order.createdAt) : 'N/A'}</td>
            </tr>
            `;
        }).join('');
    },

    async updateOrderStatus(orderId, status) {
        try {
            await API.put(`/api/Orders/${orderId}/status`, { Status: status });
            Toast.success(`Order status updated to ${status}`);
            this.loadOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            Toast.error('Failed to update order status');
        }
    },

    getStatusColor(status) {
        switch (status) {
            case 'Pending': return 'rgba(255, 193, 7, 0.8)';
            case 'pending': return 'rgba(255, 193, 7, 0.8)';
            case 'Processing': return 'rgba(108, 92, 231, 0.8)';
            case 'processing': return 'rgba(108, 92, 231, 0.8)';
            case 'Delivered': return 'rgba(0, 184, 148, 0.8)';
            case 'delivered': return 'rgba(0, 184, 148, 0.8)';
            case 'Failed': return 'rgba(255, 107, 107, 0.8)';
            case 'failed': return 'rgba(255, 107, 107, 0.8)';
            default: return 'rgba(150, 150, 150, 0.8)';
        }
    },

    getPaymentMethodColor(method) {
        switch (method) {
            case 'cod': return 'rgba(108, 92, 231, 0.8)';
            case 'razorpay': return 'rgba(0, 184, 148, 0.8)';
            case 'online': return 'rgba(0, 184, 148, 0.8)';
            default: return 'rgba(150, 150, 150, 0.8)';
        }
    },

    getPaymentMethodLabel(method) {
        switch (method) {
            case 'cod': return 'Cash on Delivery';
            case 'razorpay': return 'Razorpay';
            default: return method || 'N/A';
        }
    },

    getPaymentStatusColor(status) {
        switch (status) {
            case 'paid': return 'rgba(0, 184, 148, 0.8)';
            case 'pending': return 'rgba(255, 193, 7, 0.8)';
            case 'failed': return 'rgba(255, 107, 107, 0.8)';
            default: return 'rgba(150, 150, 150, 0.8)';
        }
    },

    getPaymentStatusLabel(status) {
        switch (status) {
            case 'paid': return 'Paid';
            case 'pending': return 'Pending';
            case 'failed': return 'Failed';
            default: return status || 'N/A';
        }
    },

    async loadAdoptionRequests() {
        try {
            const response = await API.get('/api/AdoptionRequests');
            this.cachedAdoptionRequests = response?.data || [];
            this.renderAdoptionRequestsTable(this.cachedAdoptionRequests);
        } catch (error) {
            console.error('Error loading adoption requests:', error);
            Toast.error('Failed to load adoption requests');
            this.renderAdoptionRequestsTable([]);
        }
    },

    renderAdoptionRequestsTable(requests) {
        const tbody = document.getElementById('adoptionRequestsTableBody');
        if (!tbody) return;

        if (!requests || requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No adoption requests found</td></tr>';
            return;
        }

        tbody.innerHTML = requests.map(request => {
            const deliveryMethodText = request.PreferredDeliveryMethod === 'visit-owner-location' 
                ? 'Visit owner\'s location' 
                : request.PreferredDeliveryMethod === 'meet-mutual-location' 
                    ? 'Meet at mutual location' 
                    : request.PreferredDeliveryMethod || 'N/A';

            return `
            <tr>
                <td><strong>#${request.RequestId}</strong></td>
                <td>
                    <div style="font-weight: 500;">${request.FullName || (request.Adopter?.FirstName || 'N/A') + ' ' + (request.Adopter?.LastName || '')}</div>
                    <div style="font-size: 11px; color: #666;">${request.Email || request.Adopter?.Email || 'N/A'}</div>
                    <div style="font-size: 11px; color: #666;">${request.Phone || request.Adopter?.Phone || 'N/A'}</div>
                </td>
                <td>
                    <div style="font-weight: 500;">${request.Pet?.Name || 'N/A'}</div>
                    <div style="font-size: 11px; color: #666;">${request.Pet?.Breed || 'N/A'}</div>
                </td>
                <td>
                    <div style="font-size: 12px; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${request.Message || 'N/A'}</div>
                </td>
                <td>
                    <div style="font-size: 12px;">${request.City || 'N/A'}, ${request.Area || 'N/A'}</div>
                    <div style="font-size: 11px; color: #666;">${request.HousingType || 'N/A'}</div>
                </td>
                <td>
                    <div style="font-size: 12px;">${request.Experience || 'N/A'}</div>
                    <div style="font-size: 11px; color: #666;">${deliveryMethodText}</div>
                </td>
                <td>
                    <span style="padding: 4px 12px; background: ${this.getAdoptionStatusColor(request.Status)}; color: white; border-radius: 20px; font-size: 12px;">${request.Status || 'Pending'}</span>
                </td>
                <td>
                    ${request.Status === 'Pending' ? `
                        <div style="display: flex; gap: 8px;">
                            <button onclick="Admin.updateAdoptionRequestStatus(${request.RequestId}, 'Accepted')" style="padding: 6px 12px; border: none; border-radius: 6px; background: #00b894; color: white; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.3s ease;" onmouseover="this.style.background='#00a383'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='#00b894'; this.style.transform='translateY(0)';">
                                <i class="fas fa-check"></i> Accept
                            </button>
                            <button onclick="Admin.updateAdoptionRequestStatus(${request.RequestId}, 'Rejected')" style="padding: 6px 12px; border: none; border-radius: 6px; background: #ff6b6b; color: white; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.3s ease;" onmouseover="this.style.background='#ff5252'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='#ff6b6b'; this.style.transform='translateY(0)';">
                                <i class="fas fa-times"></i> Reject
                            </button>
                        </div>
                    ` : `
                        <span style="font-size: 12px; color: #666;">${request.Status}</span>
                    `}
                </td>
            </tr>
            `;
        }).join('');
    },

    getAdoptionStatusColor(status) {
        switch (status) {
            case 'Accepted': return 'rgba(0, 184, 148, 0.8)';
            case 'Approved': return 'rgba(0, 184, 148, 0.8)';
            case 'Rejected': return 'rgba(255, 107, 107, 0.8)';
            case 'Pending': return 'rgba(255, 193, 7, 0.8)';
            default: return 'rgba(108, 92, 231, 0.8)';
        }
    },

    async updateAdoptionRequestStatus(requestId, status) {
        try {
            await API.put(`/api/AdoptionRequests/${requestId}`, { Status: status });
            Toast.success(`Request ${status.toLowerCase()} successfully!`);
            this.loadAdoptionRequests();
        } catch (error) {
            console.error('Error updating request status:', error);
            Toast.error('Failed to update request status');
        }
    },

    filterAdoptionRequests() {
        const searchTerm = document.getElementById('adoptionRequestSearch').value.toLowerCase();
        const statusFilter = document.getElementById('adoptionStatusFilter').value;
        let requests = [...this.cachedAdoptionRequests];

        if (searchTerm) {
            requests = requests.filter(request =>
                (request.FullName && request.FullName.toLowerCase().includes(searchTerm)) ||
                (request.Adopter?.FirstName && request.Adopter.FirstName.toLowerCase().includes(searchTerm)) ||
                (request.Adopter?.LastName && request.Adopter.LastName.toLowerCase().includes(searchTerm)) ||
                (request.Email && request.Email.toLowerCase().includes(searchTerm)) ||
                (request.Adopter?.Email && request.Adopter.Email.toLowerCase().includes(searchTerm)) ||
                (request.Pet?.Name && request.Pet.Name.toLowerCase().includes(searchTerm))
            );
        }

        if (statusFilter && statusFilter !== 'all') {
            requests = requests.filter(request => request.Status === statusFilter);
        }

        this.renderAdoptionRequestsTable(requests);
    },

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.clear();
            Toast.success('Logged out successfully');
            window.location.href = "index.html";
        }
    }
};

document.addEventListener("DOMContentLoaded", () => Admin.init());