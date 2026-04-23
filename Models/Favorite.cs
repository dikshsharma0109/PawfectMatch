using System.ComponentModel.DataAnnotations;

namespace PawfectMatch.Models
{
    public class Favorite
    {
        [Key]
        public int FavoriteId { get; set; }
        public string ItemType { get; set; } = string.Empty;
        public int ItemId { get; set; }
        public DateTime AddedDate { get; set; } = DateTime.Now;

        // Foreign Key
        public int UserId { get; set; }

        // Navigation Property
        public User User { get; set; } = null!;
    }
}