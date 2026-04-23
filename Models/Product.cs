using System.ComponentModel.DataAnnotations;

namespace PawfectMatch.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int? Discount { get; set; }
        public int Stock { get; set; }
        public string PetType { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public decimal Rating { get; set; } = 0;
        public int ReviewCount { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Foreign Key
        public int SellerId { get; set; }

        // Navigation Properties
        public User Seller { get; set; } = null!;
        public ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}