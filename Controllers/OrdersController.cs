using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawfectMatch.Data;
using PawfectMatch.Models;

namespace PawfectMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders (Admin - get all orders)
        [HttpGet]
        [Route("")]
        public async Task<ActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.ProductImages)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.OrderId,
                    o.FullName,
                    o.Phone,
                    o.Email,
                    o.Address,
                    o.City,
                    o.Pincode,
                    o.PaymentMethod,
                    o.PaymentStatus,
                    o.TotalAmount,
                    o.OrderDate,
                    o.Status,
                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.OrderItemId,
                        oi.ProductId,
                        oi.Quantity,
                        oi.Price,
                        Product = new
                        {
                            oi.Product.Name,
                            oi.Product.Category,
                            PrimaryImage = oi.Product.ProductImages.Where(i => i.IsPrimary).Select(i => i.ImageUrl).FirstOrDefault()
                        }
                    })
                })
                .ToListAsync();

            return Ok(new { success = true, count = orders.Count, data = orders });
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult> CreateOrder([FromBody] OrderCreateRequest request)
        {
            // Get user ID from request or create a default
            int userId = request.UserId ?? 1; // Default to 1 if not provided

            var order = new Order
            {
                UserId = userId,
                FullName = request.FullName,
                Phone = request.Phone,
                Email = request.Email,
                Address = request.Address,
                City = request.City,
                Pincode = request.Pincode,
                PaymentMethod = request.PaymentMethod,
                PaymentStatus = request.PaymentStatus ?? "pending",
                TotalAmount = request.Total,
                OrderDate = DateTime.Now,
                Status = "Processing"
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Add order items
            if (request.Items != null)
            {
                foreach (var item in request.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        _context.OrderItems.Add(new OrderItem
                        {
                            OrderId = order.OrderId,
                            ProductId = item.ProductId,
                            Quantity = item.Qty,
                            Price = product.Price
                        });

                        // Update product stock
                        product.Stock -= item.Qty;
                    }
                }
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                success = true,
                message = "Order placed successfully!",
                data = new { orderId = order.OrderId }
            });
        }

        // GET: api/Orders/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetUserOrders(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.ProductImages)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.OrderId,
                    o.FullName,
                    o.Phone,
                    o.Email,
                    o.Address,
                    o.City,
                    o.Pincode,
                    o.PaymentMethod,
                    o.PaymentStatus,
                    o.TotalAmount,
                    o.OrderDate,
                    o.Status,
                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.OrderItemId,
                        oi.ProductId,
                        oi.Quantity,
                        oi.Price,
                        Product = new
                        {
                            oi.Product.Name,
                            oi.Product.Category,
                            PrimaryImage = oi.Product.ProductImages.Where(i => i.IsPrimary).Select(i => i.ImageUrl).FirstOrDefault()
                        }
                    })
                })
                .ToListAsync();

            return Ok(new { success = true, count = orders.Count, data = orders });
        }

        // GET: api/Orders/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.ProductImages)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
            {
                return NotFound(new { success = false, message = "Order not found" });
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    order.OrderId,
                    order.FullName,
                    order.Phone,
                    order.Email,
                    order.Address,
                    order.City,
                    order.Pincode,
                    order.PaymentMethod,
                    order.PaymentStatus,
                    order.TotalAmount,
                    order.OrderDate,
                    order.Status,
                    Items = order.OrderItems.Select(oi => new
                    {
                        oi.OrderItemId,
                        oi.ProductId,
                        oi.Quantity,
                        oi.Price,
                        Product = new
                        {
                            oi.Product.Name,
                            oi.Product.Category,
                            PrimaryImage = oi.Product.ProductImages.Where(i => i.IsPrimary).Select(i => i.ImageUrl).FirstOrDefault()
                        }
                    })
                }
            });
        }

        // PUT: api/Orders/{id}/status
        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdate request)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound(new { success = false, message = "Order not found" });
            }

            order.Status = request.Status;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Order status updated successfully!" });
        }
    }

    // Request Models
    public class OrderCreateRequest
    {
        public int? UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string? PaymentStatus { get; set; }
        public List<OrderItemRequest>? Items { get; set; }
        public decimal Subtotal { get; set; }
        public decimal DeliveryFee { get; set; }
        public decimal Total { get; set; }
    }

    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public int Qty { get; set; }
    }

    public class OrderStatusUpdate
    {
        public string Status { get; set; } = string.Empty;
    }
}
