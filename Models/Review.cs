using System.ComponentModel.DataAnnotations;

namespace PawfectMatch.Models
{
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }
        public int Rating { get; set; }
        public string ReviewText { get; set; } = string.Empty;
        public DateTime ReviewDate { get; set; } = DateTime.Now;
        public int HelpfulCount { get; set; } = 0;

        // Foreign Keys
        public int ProductId { get; set; }
        public int UserId { get; set; }

        // Navigation Properties
        public Product Product { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}