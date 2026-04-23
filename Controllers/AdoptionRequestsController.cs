using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawfectMatch.Data;
using PawfectMatch.Models;

namespace PawfectMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdoptionRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdoptionRequestsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/AdoptionRequests
        [HttpGet("")]
        public async Task<ActionResult> GetAllRequests()
        {
            var requests = await _context.AdoptionRequests
                .Include(ar => ar.Adopter)
                .Include(ar => ar.Pet)
                .ThenInclude(p => p.PetImages)
                .OrderByDescending(ar => ar.RequestDate)
                .Select(ar => new
                {
                    ar.RequestId,
                    ar.Message,
                    ar.Status,
                    ar.RequestDate,
                    ar.FullName,
                    ar.Email,
                    ar.Phone,
                    ar.City,
                    ar.Area,
                    ar.PreferredDeliveryMethod,
                    ar.HousingType,
                    ar.Experience,
                    Adopter = new
                    {
                        ar.Adopter.UserId,
                        ar.Adopter.FirstName,
                        ar.Adopter.LastName,
                        ar.Adopter.Email,
                        ar.Adopter.Phone,
                        ar.Adopter.Area,
                        ar.Adopter.Avatar
                    },
                    Pet = new
                    {
                        ar.Pet.PetId,
                        ar.Pet.Name,
                        ar.Pet.Type,
                        ar.Pet.Breed,
                        PrimaryImage = ar.Pet.PetImages.Where(i => i.IsPrimary).Select(i => i.ImageUrl).FirstOrDefault()
                    }
                })
                .ToListAsync();

            return Ok(new { success = true, count = requests.Count, data = requests });
        }

        // POST: api/AdoptionRequests
        [HttpPost]
        public async Task<ActionResult> SendRequest([FromBody] AdoptionRequestCreate request)
        {
            // Check if request already exists
            var existingRequest = await _context.AdoptionRequests
                .FirstOrDefaultAsync(ar => ar.PetId == request.PetId && ar.AdopterId == request.AdopterId);

            if (existingRequest != null)
            {
                return BadRequest(new { success = false, message = "You have already sent a request for this pet" });
            }

            var adoptionRequest = new AdoptionRequest
            {
                PetId = request.PetId,
                AdopterId = request.AdopterId,
                Message = request.Message,
                Status = "Pending",
                RequestDate = DateTime.Now,

                // Personal Information
                FullName = request.FullName,
                Email = request.Email,
                Phone = request.Phone,
                StreetAddress = request.StreetAddress,
                StreetAddressLine2 = request.StreetAddressLine2,
                City = request.City,
                State = request.State,
                ZipCode = request.ZipCode,
                Area = request.Area,
                PreferredDeliveryMethod = request.PreferredDeliveryMethod,

                // Housing Information
                HousingType = request.HousingType,
                FencedYard = request.FencedYard,
                ChildrenInfo = request.ChildrenInfo,
                HasChildren = request.HasChildren,
                WillCratePet = request.WillCratePet,
                HoursAlone = request.HoursAlone,
                PetCareWhenAway = request.PetCareWhenAway,
                BehavioralIssuesPlan = request.BehavioralIssuesPlan,

                // Pet Experience
                OtherPetsInfo = request.OtherPetsInfo,
                OtherPetsCount = request.OtherPetsCount,
                OtherPetsType = request.OtherPetsType,
                CurrentPetBreed = request.CurrentPetBreed,
                CurrentPetDisposition = request.CurrentPetDisposition,
                CurrentPetGender = request.CurrentPetGender,
                CurrentPetSpayedNeutered = request.CurrentPetSpayedNeutered,
                References = request.References,
                CurrentPetUsedToOtherPets = request.CurrentPetUsedToOtherPets,
                OtherPetExperience = request.OtherPetExperience,

                // Veterinary & Legal
                HasRegularVet = request.HasRegularVet,
                AnimalCrimeConviction = request.AnimalCrimeConviction,

                // Agreement
                AgreedToTerms = request.AgreedToTerms,

                // Legacy fields for backward compatibility
                Experience = request.Experience
            };

            _context.AdoptionRequests.Add(adoptionRequest);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Adoption request sent successfully!",
                data = new { adoptionRequest.RequestId }
            });
        }

        // GET: api/AdoptionRequests/pet/5
        [HttpGet("pet/{petId}")]
        public async Task<ActionResult> GetRequestsForPet(int petId)
        {
            var requests = await _context.AdoptionRequests
                .Include(ar => ar.Adopter)
                .Where(ar => ar.PetId == petId)
                .OrderByDescending(ar => ar.RequestDate)
                .Select(ar => new
                {
                    ar.RequestId,
                    ar.Message,
                    ar.Status,
                    ar.RequestDate,
                    Adopter = new
                    {
                        ar.Adopter.UserId,
                        ar.Adopter.FirstName,
                        ar.Adopter.LastName,
                        ar.Adopter.Email,
                        ar.Adopter.Phone,
                        ar.Adopter.Area,
                        ar.Adopter.Avatar
                    }
                })
                .ToListAsync();

            return Ok(new { success = true, count = requests.Count, data = requests });
        }

        // GET: api/AdoptionRequests/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetUserRequests(int userId)
        {
            var requests = await _context.AdoptionRequests
                .Include(ar => ar.Pet)
                .ThenInclude(p => p.PetImages)
                .Where(ar => ar.AdopterId == userId)
                .OrderByDescending(ar => ar.RequestDate)
                .Select(ar => new
                {
                    ar.RequestId,
                    ar.Message,
                    ar.Status,
                    ar.RequestDate,
                    Pet = new
                    {
                        ar.Pet.PetId,
                        ar.Pet.Name,
                        ar.Pet.Type,
                        ar.Pet.Breed,
                        PrimaryImage = ar.Pet.PetImages.Where(i => i.IsPrimary).Select(i => i.ImageUrl).FirstOrDefault()
                    }
                })
                .ToListAsync();

            return Ok(new { success = true, count = requests.Count, data = requests });
        }

        // PUT: api/AdoptionRequests/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateRequestStatus(int id, [FromBody] RequestStatusUpdate request)
        {
            var adoptionRequest = await _context.AdoptionRequests.FindAsync(id);

            if (adoptionRequest == null)
            {
                return NotFound(new { success = false, message = "Request not found" });
            }

            adoptionRequest.Status = request.Status;
            await _context.SaveChangesAsync();

            // If accepted, update pet status
            if (request.Status == "Accepted")
            {
                var pet = await _context.Pets.FindAsync(adoptionRequest.PetId);
                if (pet != null)
                {
                    pet.Status = "Adopted";
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new { success = true, message = "Request updated successfully!" });
        }
    }

    // Request Models
    public class AdoptionRequestCreate
    {
        public int PetId { get; set; }
        public int AdopterId { get; set; }
        public string Message { get; set; } = string.Empty;

        // Personal Information
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string StreetAddressLine2 { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Area { get; set; } = string.Empty;
        public string PreferredDeliveryMethod { get; set; } = string.Empty;

        // Housing Information
        public string HousingType { get; set; } = string.Empty;
        public bool FencedYard { get; set; } = false;
        public string ChildrenInfo { get; set; } = string.Empty;
        public bool HasChildren { get; set; } = false;
        public bool WillCratePet { get; set; } = false;
        public string HoursAlone { get; set; } = string.Empty;
        public string PetCareWhenAway { get; set; } = string.Empty;
        public string BehavioralIssuesPlan { get; set; } = string.Empty;

        // Pet Experience
        public string OtherPetsInfo { get; set; } = string.Empty;
        public string OtherPetsCount { get; set; } = string.Empty;
        public string OtherPetsType { get; set; } = string.Empty;
        public string CurrentPetBreed { get; set; } = string.Empty;
        public string CurrentPetDisposition { get; set; } = string.Empty;
        public string CurrentPetGender { get; set; } = string.Empty;
        public bool CurrentPetSpayedNeutered { get; set; } = false;
        public string References { get; set; } = string.Empty;
        public bool CurrentPetUsedToOtherPets { get; set; } = false;
        public string OtherPetExperience { get; set; } = string.Empty;

        // Veterinary & Legal
        public bool HasRegularVet { get; set; } = false;
        public string AnimalCrimeConviction { get; set; } = string.Empty;

        // Agreement
        public bool AgreedToTerms { get; set; } = false;

        // Legacy fields for backward compatibility
        public string Experience { get; set; } = string.Empty;
    }

    public class RequestStatusUpdate
    {
        public string Status { get; set; } = string.Empty;
    }
}