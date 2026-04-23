using Microsoft.AspNetCore.Mvc;
using PawfectMatch.Data;
using PawfectMatch.Models;
using System.Linq;

namespace PawfectMatch.Controllers
{
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔐 ADMIN CHECK
        private bool IsAdmin()
        {
            var role = Request.Headers["role"].ToString();
            return role == "admin";
        }

        public IActionResult Dashboard()
        {
            if (!IsAdmin()) return Unauthorized("Admin access required");

            var data = new
            {
                Users = _context.Users.Count(),
                Pets = _context.Pets.Count(),
                Products = _context.Products.Count(),
                Orders = _context.Orders.Count(),
                Requests = _context.AdoptionRequests.Count()
            };

            return View(data);
        }

        public IActionResult Users()
        {
            if (!IsAdmin()) return Unauthorized("Admin access required");

            return View(_context.Users.ToList());
        }

        public IActionResult Pets()
        {
            if (!IsAdmin()) return Unauthorized("Admin access required");

            return View(_context.Pets.ToList());
        }

        public IActionResult Products()
        {
            if (!IsAdmin()) return Unauthorized("Admin access required");

            return View(_context.Products.ToList());
        }

        public IActionResult Requests()
        {
            if (!IsAdmin()) return Unauthorized("Admin access required");

            return View(_context.AdoptionRequests.ToList());
        }
    }
}