using System.ComponentModel.DataAnnotations;

namespace PawfectMatch.Models
{
    public class Area
    {
        [Key]
        public int AreaId { get; set; }
        public string AreaName { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;
        public string City { get; set; } = "Ahmedabad";
        public bool IsActive { get; set; } = true;
    }
}