using System.ComponentModel.DataAnnotations;

namespace PawfectMatch.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public decimal TotalAmount { get; set; }
        public string DeliveryAddress { get; set; } = string.Empty;
        public string Area { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = "Pending";
        public string DeliveryStatus { get; set; } = "Processing";

        // Additional properties for checkout
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string Status { get; set; } = "Processing";

        // Foreign Key
        public int UserId { get; set; }

        // Navigation Properties
        public User User { get; set; } = null!;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}