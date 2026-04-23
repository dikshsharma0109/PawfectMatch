using System.ComponentModel.DataAnnotations;

namespace PawfectMatch.Models
{
    public class Pet
    {
        [Key]
        public int PetId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Breed { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public bool IsNeutered { get; set; } = false;
        public bool IsHouseTrained { get; set; } = false;
        public string? GoodWith { get; set; }
        public string Status { get; set; } = "Available";
        public int Views { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public decimal Price { get; set; } = 0; // 0 = Free, > 0 = Paid

        // Foreign Key
        public int OwnerId { get; set; }

        // Navigation Properties
        public User Owner { get; set; } = null!;
        public ICollection<PetImage> PetImages { get; set; } = new List<PetImage>();
        public ICollection<Vaccination> Vaccinations { get; set; } = new List<Vaccination>();
        public ICollection<AdoptionRequest> AdoptionRequests { get; set; } = new List<AdoptionRequest>();
    }
}