// ============================================
// PAWFECT MATCHES - PETS MODULE (FIXED)
// ============================================

const PetManager = {

    pets: [],

    async loadPets() {
        try {
            console.log("🐶 Loading pets...");

            // ✅ DIRECT API CALL (NO API.getPets dependency)
            const res = await API.get("/api/Pets");

            this.pets = res.data || [];

            // Limit to 3 pets on home page (index.html)
            const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
            const petsToRender = isHomePage ? this.pets.slice(0, 3) : this.pets;

            this.renderPets(petsToRender);

        } catch (err) {
            console.error("Error loading pets:", err);
            Toast?.error?.("Failed to load pets");
        }
    },

    renderPets(pets) {
        const grid = document.getElementById("petsGrid");
        if (!grid) return;

        if (!pets || pets.length === 0) {
            grid.innerHTML = "<p>No pets found</p>";
            return;
        }

        grid.innerHTML = pets.map(pet => {

            // ✅ FIX IMAGE (from images array)
            const img = pet.images && pet.images.length > 0
                ? pet.images[0].imageUrl
                : "images/dog.jpg";

            // ✅ DISPLAY PRICE - 0 = Free, > 0 = Paid
            const price = pet.price || 0;
            const priceDisplay = price === 0
                ? '<span style="background: linear-gradient(135deg, #00b894, #00cec9); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Free Adoption</span>'
                : `<span style="background: linear-gradient(135deg, #ff6b6b, #ff8e8e); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">₹${price}</span>`;

            return `
                <div class="pet-card" onclick="PetManager.goToDetails(${pet.petId})" style="cursor:pointer; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: all 0.3s ease; margin: 0 15px 30px 15px;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)';">
                    
                    <div class="pet-image" style="width: 100%; height: 200px; overflow: hidden; position: relative;">
                        <img src="${img}" alt="${pet.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
                        <div style="position: absolute; top: 12px; right: 12px;">${priceDisplay}</div>
                    </div>

                    <div class="pet-info" style="padding: 20px;">
                        <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #333;">${pet.name}</h3>
                        <p style="margin: 0 0 4px 0; font-size: 14px; color: #666; font-weight: 500;">${pet.breed || 'Mixed Breed'}</p>
                        <p style="margin: 0 0 12px 0; font-size: 13px; color: #888;">${pet.age} years • ${pet.location || 'Ahmedabad'}</p>
                        <button style="width: 100%; padding: 10px; background: linear-gradient(135deg, #ff6b6b, #ff8e8e); color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='linear-gradient(135deg, #ff5252, #ff7a7a)';" onmouseout="this.style.background='linear-gradient(135deg, #ff6b6b, #ff8e8e)';">View Details</button>
                    </div>

                </div>
            `;
        }).join("");

        console.log("✅ Pets rendered");
    },

    goToDetails(id) {
        console.log("Opening pet:", id);
        window.location.href = `pet-details.html?id=${id}`;
    }
};

// Init
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("petsGrid")) {
        PetManager.loadPets();
    }
});