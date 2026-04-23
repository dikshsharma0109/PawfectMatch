using System.ComponentModel.DataAnnotations;

namespace PawfectMatch.Models
{
    public class ProductImage
    {
        [Key]
        public int ImageId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; } = false;

        // Foreign Key
        public int ProductId { get; set; }

        // Navigation Property
        public Product Product { get; set; } = null!;
    }
}