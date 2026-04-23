using Microsoft.EntityFrameworkCore;
using PawfectMatch.Models;

namespace PawfectMatch.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets (Tables)
        public DbSet<User> Users { get; set; }
        public DbSet<Pet> Pets { get; set; }
        public DbSet<PetImage> PetImages { get; set; }
        public DbSet<Vaccination> Vaccinations { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<AdoptionRequest> AdoptionRequests { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Area> Areas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure decimal precision for money fields
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Product>()
                .Property(p => p.OriginalPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Product>()
                .Property(p => p.Rating)
                .HasPrecision(3, 2);

            modelBuilder.Entity<Pet>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Price)
                .HasPrecision(18, 2);

            // Configure relationships
            modelBuilder.Entity<Pet>()
                .HasOne(p => p.Owner)
                .WithMany(u => u.Pets)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Seller)
                .WithMany(u => u.Products)
                .HasForeignKey(p => p.SellerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AdoptionRequest>()
                .HasOne(ar => ar.Pet)
                .WithMany(p => p.AdoptionRequests)
                .HasForeignKey(ar => ar.PetId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<AdoptionRequest>()
                .HasOne(ar => ar.Adopter)
                .WithMany(u => u.AdoptionRequests)
                .HasForeignKey(ar => ar.AdopterId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed Ahmedabad Areas Data
            modelBuilder.Entity<Area>().HasData(
                new Area { AreaId = 1, AreaName = "Satellite", Pincode = "380015", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 2, AreaName = "Vastrapur", Pincode = "380054", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 3, AreaName = "Bodakdev", Pincode = "380054", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 4, AreaName = "Prahlad Nagar", Pincode = "380015", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 5, AreaName = "SG Highway", Pincode = "380054", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 6, AreaName = "Navrangpura", Pincode = "380009", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 7, AreaName = "Paldi", Pincode = "380007", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 8, AreaName = "Maninagar", Pincode = "380008", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 9, AreaName = "Chandkheda", Pincode = "382424", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 10, AreaName = "Gota", Pincode = "382481", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 11, AreaName = "Bopal", Pincode = "380058", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 12, AreaName = "Thaltej", Pincode = "380054", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 13, AreaName = "South Bopal", Pincode = "380058", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 14, AreaName = "Shilaj", Pincode = "382427", City = "Ahmedabad", IsActive = true },
                new Area { AreaId = 15, AreaName = "Ambawadi", Pincode = "380015", City = "Ahmedabad", IsActive = true }
            );
        }
    }
}