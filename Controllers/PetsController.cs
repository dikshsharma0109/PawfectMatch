using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawfectMatch.Data;
using PawfectMatch.Models;

namespace PawfectMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PetsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Pets
        [HttpGet]
        public async Task<ActionResult> GetPets([FromQuery] string? type, [FromQuery] string? area, [FromQuery] string? search)
        {
            var query = _context.Pets
                .Include(p => p.Owner)
                .Include(p => p.PetImages)
                .Include(p => p.Vaccinations)
                .Where(p => p.Status == "Available")
                .AsQueryable();

            if (!string.IsNullOrEmpty(type) && type.ToLower() != "all")
            {
                query = query.Where(p => p.Type.ToLower() == type.ToLower());
            }

            if (!string.IsNullOrEmpty(area))
            {
                query = query.Where(p => p.Location.Contains(area));
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p =>
                    p.Name.Contains(search) ||
                    p.Breed.Contains(search) ||
                    p.Description.Contains(search));
            }

            var pets = await query
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    petId = p.PetId,
                    name = p.Name,
                    type = p.Type,
                    breed = p.Breed,
                    age = p.Age,
                    gender = p.Gender,
                    size = p.Size,
                    color = p.Color,
                    description = p.Description,
                    location = p.Location,
                    isNeutered = p.IsNeutered,
                    isHouseTrained = p.IsHouseTrained,
                    goodWith = p.GoodWith,
                    status = p.Status,
                    views = p.Views,
                    createdAt = p.CreatedAt,
                    price = p.Price, // Added - 0 = Free, > 0 = Paid

                    images = p.PetImages.Select(i => new
                    {
                        imageUrl = i.ImageUrl,
                        isPrimary = i.IsPrimary
                    }),

                    vaccinations = p.Vaccinations.Select(v => new
                    {
                        vaccineName = v.VaccineName,
                        vaccinationDate = v.VaccinationDate,
                        status = v.Status
                    }),

                    owner = new
                    {
                        userId = p.Owner.UserId,
                        firstName = p.Owner.FirstName,
                        lastName = p.Owner.LastName,
                        avatar = p.Owner.Avatar,
                        area = p.Owner.Area,
                        isVerified = p.Owner.IsVerified
                    }
                })
                .ToListAsync();

            return Ok(new { success = true, count = pets.Count, data = pets });
        }

        // GET: api/Pets/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetPet(int id)
        {
            var pet = await _context.Pets
                .Include(p => p.Owner)
                .Include(p => p.PetImages)
                .Include(p => p.Vaccinations)
                .FirstOrDefaultAsync(p => p.PetId == id);

            if (pet == null)
            {
                return NotFound(new { success = false, message = "Pet not found" });
            }

            pet.Views++;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                data = new
                {
                    petId = pet.PetId,
                    name = pet.Name,
                    type = pet.Type,
                    breed = pet.Breed,
                    age = pet.Age,
                    gender = pet.Gender,
                    size = pet.Size,
                    color = pet.Color,
                    description = pet.Description,
                    location = pet.Location,
                    isNeutered = pet.IsNeutered,
                    isHouseTrained = pet.IsHouseTrained,
                    goodWith = pet.GoodWith,
                    status = pet.Status,
                    views = pet.Views,
                    createdAt = pet.CreatedAt,
                    price = pet.Price, // Added - 0 = Free, > 0 = Paid

                    images = pet.PetImages.Select(i => new
                    {
                        imageUrl = i.ImageUrl,
                        isPrimary = i.IsPrimary
                    }),

                    vaccinations = pet.Vaccinations.Select(v => new
                    {
                        vaccineName = v.VaccineName,
                        vaccinationDate = v.VaccinationDate,
                        status = v.Status
                    }),

                    owner = new
                    {
                        userId = pet.Owner.UserId,
                        firstName = pet.Owner.FirstName,
                        lastName = pet.Owner.LastName,
                        email = pet.Owner.Email,
                        phone = pet.Owner.Phone,
                        avatar = pet.Owner.Avatar,
                        area = pet.Owner.Area,
                        isVerified = pet.Owner.IsVerified
                    }
                }
            });
        }

        // GET: api/Pets/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetPetsByUser(int userId)
        {
            var pets = await _context.Pets
                .Include(p => p.Owner)
                .Include(p => p.PetImages)
                .Where(p => p.OwnerId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    petId = p.PetId,
                    name = p.Name,
                    type = p.Type,
                    breed = p.Breed,
                    age = p.Age,
                    gender = p.Gender,
                    size = p.Size,
                    color = p.Color,
                    description = p.Description,
                    location = p.Location,
                    status = p.Status,
                    createdAt = p.CreatedAt,
                    price = p.Price,

                    images = p.PetImages.Select(i => new
                    {
                        imageUrl = i.ImageUrl,
                        isPrimary = i.IsPrimary
                    }),

                    owner = new
                    {
                        userId = p.Owner.UserId,
                        firstName = p.Owner.FirstName,
                        lastName = p.Owner.LastName,
                        avatar = p.Owner.Avatar,
                        area = p.Owner.Area
                    }
                })
                .ToListAsync();

            return Ok(new { success = true, count = pets.Count, data = pets });
        }

        // POST: api/Pets
        [HttpPost]
        public async Task<ActionResult> AddPet([FromBody] PetCreateRequest request)
        {
            // Use userId from request body instead of JWT token
            int ownerId = request.UserId;

            if (ownerId == 0)
            {
                return BadRequest(new { success = false, message = "UserId is required" });
            }

            var pet = new Pet
            {
                Name = request.Name,
                Type = request.Type,
                Breed = request.Breed,
                Age = request.Age,
                Gender = request.Gender,
                Size = request.Size,
                Color = request.Color,
                Description = request.Description,
                Location = request.Location,
                IsNeutered = request.IsNeutered,
                IsHouseTrained = request.IsHouseTrained,
                GoodWith = request.GoodWith,
                OwnerId = ownerId, // Auto-assign from authenticated user
                Status = "Available",
                Views = 0,
                CreatedAt = DateTime.Now,
                Price = request.Price // 0 = Free, > 0 = Paid
            };

            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();

            // Images
            if (request.Images != null)
            {
                bool isFirst = true;
                foreach (var img in request.Images)
                {
                    _context.PetImages.Add(new PetImage
                    {
                        PetId = pet.PetId,
                        ImageUrl = img,
                        IsPrimary = isFirst
                    });
                    isFirst = false;
                }
            }

            // Vaccinations
            if (request.Vaccinations != null)
            {
                foreach (var v in request.Vaccinations)
                {
                    _context.Vaccinations.Add(new Vaccination
                    {
                        PetId = pet.PetId,
                        VaccineName = v.VaccineName,
                        VaccinationDate = v.VaccinationDate,
                        Status = v.Status
                    });
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Pet added successfully!",
                data = new { petId = pet.PetId }
            });
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePet(int id)
        {
            var pet = await _context.Pets.FindAsync(id);

            if (pet == null)
                return NotFound(new { success = false });

            _context.Pets.Remove(pet);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }
}

// Request Models

public class PetCreateRequest
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public bool IsNeutered { get; set; }
    public bool IsHouseTrained { get; set; }
    public string? GoodWith { get; set; }
    public int UserId { get; set; } // Added - user ID from frontend
    public decimal Price { get; set; } = 0; // 0 = Free, > 0 = Paid
    public List<string>? Images { get; set; }
    public List<VaccinationRequest>? Vaccinations { get; set; }
}

public class VaccinationRequest
{
    public string VaccineName { get; set; } = string.Empty;
    public DateTime VaccinationDate { get; set; }
    public string Status { get; set; } = "Completed";
}