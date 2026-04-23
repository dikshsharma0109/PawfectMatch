using System.ComponentModel.DataAnnotations;

namespace PawfectMatch.Models
{
    public class PetImage
    {
        [Key]
        public int ImageId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; } = false;

        // Foreign Key
        public int PetId { get; set; }

        // Navigation Property
        public Pet Pet { get; set; } = null!;
    }
}