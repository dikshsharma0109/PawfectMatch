using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PawfectMatch.Migrations
{
    /// <inheritdoc />
    public partial class AddComprehensiveAdoptionFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AgreedToTerms",
                table: "AdoptionRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "AnimalCrimeConviction",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Area",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BehavioralIssuesPlan",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ChildrenInfo",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CurrentPetBreed",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CurrentPetDisposition",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CurrentPetGender",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "CurrentPetSpayedNeutered",
                table: "AdoptionRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentPetUsedToOtherPets",
                table: "AdoptionRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Experience",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "FencedYard",
                table: "AdoptionRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "HasChildren",
                table: "AdoptionRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasRegularVet",
                table: "AdoptionRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "HoursAlone",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HousingType",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OtherPetExperience",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OtherPetsCount",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OtherPetsInfo",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OtherPetsType",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PetCareWhenAway",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PreferredDeliveryMethod",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "References",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StreetAddress",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StreetAddressLine2",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "WillCratePet",
                table: "AdoptionRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ZipCode",
                table: "AdoptionRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AgreedToTerms",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "AnimalCrimeConviction",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "Area",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "BehavioralIssuesPlan",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "ChildrenInfo",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "City",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "CurrentPetBreed",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "CurrentPetDisposition",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "CurrentPetGender",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "CurrentPetSpayedNeutered",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "CurrentPetUsedToOtherPets",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "Experience",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "FencedYard",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "HasChildren",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "HasRegularVet",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "HoursAlone",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "HousingType",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "OtherPetExperience",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "OtherPetsCount",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "OtherPetsInfo",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "OtherPetsType",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "PetCareWhenAway",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "PreferredDeliveryMethod",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "References",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "State",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "StreetAddress",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "StreetAddressLine2",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "WillCratePet",
                table: "AdoptionRequests");

            migrationBuilder.DropColumn(
                name: "ZipCode",
                table: "AdoptionRequests");
        }
    }
}
