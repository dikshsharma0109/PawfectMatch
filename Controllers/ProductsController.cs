using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawfectMatch.Data;
using PawfectMatch.Models;

namespace PawfectMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔐 ADMIN CHECK
        private bool IsAdmin()
        {
            var role = Request.Headers["role"].ToString();
            return role == "admin";
        }

        // ===============================
        // GET ALL (PUBLIC)
        // ===============================
        [HttpGet]
        public async Task<ActionResult> GetProducts(
            [FromQuery] string? category,
            [FromQuery] string? petType,
            [FromQuery] string? search)
        {
            var query = _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Seller)
                .Where(p => p.Stock > 0)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category) && category.ToLower() != "all")
            {
                query = query.Where(p => p.Category.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrEmpty(petType))
            {
                query = query.Where(p =>
                    p.PetType.ToLower() == petType.ToLower() ||
                    p.PetType.ToLower() == "all");
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p =>
                    p.Name.Contains(search) ||
                    p.Description.Contains(search));
            }

            var products = await query
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.ProductId,
                    p.Name,
                    p.Category,
                    p.Description,
                    p.Price,
                    p.Stock,
                    p.PetType,
                    p.Rating,
                    p.ReviewCount,
                    p.CreatedAt,
                    Images = p.ProductImages.Select(i => new
                    {
                        i.ImageUrl,
                        i.IsPrimary
                    })
                })
                .ToListAsync();

            return Ok(new { success = true, count = products.Count, data = products });
        }

        // ===============================
        // GET ONE (PUBLIC)
        // ===============================
        [HttpGet("{id}")]
        public async Task<ActionResult> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Seller)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null)
            {
                return NotFound(new { success = false, message = "Product not found" });
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    product.ProductId,
                    product.Name,
                    product.Category,
                    product.Description,
                    product.Price,
                    product.Stock,
                    product.PetType,
                    product.Rating,
                    product.ReviewCount,
                    product.CreatedAt,
                    Images = product.ProductImages.Select(i => new
                    {
                        i.ImageUrl,
                        i.IsPrimary
                    })
                }
            });
        }

        // ===============================
        // ADD PRODUCT (ADMIN ONLY)
        // ===============================
        [HttpPost]
        public async Task<ActionResult> AddProduct([FromBody] ProductCreateRequest request)
        {
            if (!IsAdmin())
                return Unauthorized(new { success = false, message = "Admin only" });

            var product = new Product
            {
                Name = request.Name,
                Category = request.Category,
                Description = request.Description,
                Price = request.Price,
                Stock = request.Stock,
                PetType = request.PetType,
                SellerId = request.SellerId,
                Rating = 0,
                ReviewCount = 0,
                CreatedAt = DateTime.Now
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Images
            if (request.Images != null)
            {
                bool isFirst = true;
                foreach (var imageUrl in request.Images)
                {
                    _context.ProductImages.Add(new ProductImage
                    {
                        ProductId = product.ProductId,
                        ImageUrl = imageUrl,
                        IsPrimary = isFirst
                    });
                    isFirst = false;
                }

                await _context.SaveChangesAsync();
            }

            return Ok(new { success = true, message = "Product added successfully!" });
        }

        // ===============================
        // UPDATE PRODUCT (ADMIN ONLY)
        // ===============================
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduct(int id, [FromBody] ProductCreateRequest request)
        {
            if (!IsAdmin())
                return Unauthorized(new { success = false, message = "Admin only" });

            var product = await _context.Products
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null)
            {
                return NotFound(new { success = false, message = "Product not found" });
            }

            product.Name = request.Name;
            product.Category = request.Category;
            product.Description = request.Description;
            product.Price = request.Price;
            product.Stock = request.Stock;
            product.PetType = request.PetType;

            // Remove old images
            _context.ProductImages.RemoveRange(product.ProductImages);

            // Add new images
            if (request.Images != null)
            {
                bool isFirst = true;
                foreach (var imageUrl in request.Images)
                {
                    _context.ProductImages.Add(new ProductImage
                    {
                        ProductId = product.ProductId,
                        ImageUrl = imageUrl,
                        IsPrimary = isFirst
                    });
                    isFirst = false;
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Updated" });
        }

        // ===============================
        // DELETE PRODUCT (ADMIN ONLY)
        // ===============================
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            if (!IsAdmin())
                return Unauthorized(new { success = false, message = "Admin only" });

            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(new { success = false, message = "Product not found" });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Deleted" });
        }

        // ===============================
        // CATEGORIES (PUBLIC)
        // ===============================
        [HttpGet("categories")]
        public ActionResult GetCategories()
        {
            var categories = new[]
            {
                new { id = "food", name = "Food" },
                new { id = "toys", name = "Toys" }
            };

            return Ok(new { success = true, data = categories });
        }
    }

    // ===============================
    // REQUEST MODEL (FIXED)
    // ===============================
    public class ProductCreateRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string PetType { get; set; } = string.Empty;
        public int SellerId { get; set; }
        public List<string>? Images { get; set; }
    }
}