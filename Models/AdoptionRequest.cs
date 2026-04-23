using System.ComponentModel.DataAnnotations;

namespace PawfectMatch.Models
{
    public class AdoptionRequest
    {
        [Key]
        public int RequestId { get; set; }

        public string Message { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public DateTime RequestDate { get; set; } = DateTime.Now;

        // Foreign Keys
        public int PetId { get; set; }
        public int AdopterId { get; set; }

        // Navigation Properties
        public Pet Pet { get; set; } = null!;
        public User Adopter { get; set; } = null!;

        // Personal Information
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string StreetAddressLine2 { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Area { get; set; } = string.Empty;
        public string PreferredDeliveryMethod { get; set; } = string.Empty;

        // Housing Information
        public string HousingType { get; set; } = string.Empty;
        public bool FencedYard { get; set; } = false;
        public string ChildrenInfo { get; set; } = string.Empty;
        public bool HasChildren { get; set; } = false;
        public bool WillCratePet { get; set; } = false;
        public string HoursAlone { get; set; } = string.Empty;
        public string PetCareWhenAway { get; set; } = string.Empty;
        public string BehavioralIssuesPlan { get; set; } = string.Empty;

        // Pet Experience
        public string OtherPetsInfo { get; set; } = string.Empty;
        public string OtherPetsCount { get; set; } = string.Empty;
        public string OtherPetsType { get; set; } = string.Empty;
        public string CurrentPetBreed { get; set; } = string.Empty;
        public string CurrentPetDisposition { get; set; } = string.Empty;
        public string CurrentPetGender { get; set; } = string.Empty;
        public bool CurrentPetSpayedNeutered { get; set; } = false;
        public string References { get; set; } = string.Empty;
        public bool CurrentPetUsedToOtherPets { get; set; } = false;
        public string OtherPetExperience { get; set; } = string.Empty;

        // Veterinary & Legal
        public bool HasRegularVet { get; set; } = false;
        public string AnimalCrimeConviction { get; set; } = string.Empty;

        // Agreement
        public bool AgreedToTerms { get; set; } = false;

        // Legacy fields for backward compatibility
        public string Experience { get; set; } = string.Empty;
    }
}