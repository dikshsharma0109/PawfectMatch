using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawfectMatch.Data;

namespace PawfectMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/AdminApi/metrics
        [HttpGet("metrics")]
        public async Task<IActionResult> GetMetrics()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalPets = await _context.Pets.CountAsync();
            var totalProducts = await _context.Products.CountAsync();
            var totalOrders = await _context.Orders.CountAsync();

            var totalRevenue = await _context.Orders.SumAsync(o => (decimal?)o.TotalAmount) ?? 0m;

            var today = DateTime.Today;
            var revenueToday = await _context.Orders
                .Where(o => o.OrderDate.Date == today)
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0m;

            var ordersLast30 = await _context.Orders
                .Where(o => o.OrderDate >= DateTime.Now.AddDays(-30))
                .ToListAsync();

            var revenueLast30 = ordersLast30.Sum(o => o.TotalAmount);

            var avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0m;

            return Ok(new
            {
                success = true,
                data = new
                {
                    users = totalUsers,
                    pets = totalPets,
                    products = totalProducts,
                    orders = totalOrders,
                    totalRevenue,
                    revenueToday,
                    revenueLast30,
                    avgOrderValue
                }
            });
        }
    }
}
