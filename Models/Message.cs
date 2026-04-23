using System.ComponentModel.DataAnnotations;

namespace PawfectMatch.Models
{
    public class Message
    {
        [Key]
        public int MessageId { get; set; }
        public string MessageText { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.Now;
        public bool IsRead { get; set; } = false;

        // Foreign Keys
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public int? RelatedPetId { get; set; }
    }
}