using System.ComponentModel.DataAnnotations;

namespace PawfectMatch.Models
{
    public class Vaccination
    {
        [Key]
        public int VaccinationId { get; set; }
        public string VaccineName { get; set; } = string.Empty;
        public DateTime VaccinationDate { get; set; }
        public string Status { get; set; } = "Pending";

        // Foreign Key
        public int PetId { get; set; }

        // Navigation Property
        public Pet Pet { get; set; } = null!;
    }
}