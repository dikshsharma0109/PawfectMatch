using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawfectMatch.Data;
using PawfectMatch.Models;

namespace PawfectMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AreasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AreasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Areas
        [HttpGet]
        public async Task<ActionResult> GetAreas()
        {
            var areas = await _context.Areas
                .Where(a => a.IsActive)
                .OrderBy(a => a.AreaName)
                .ToListAsync();

            return Ok(new { success = true, data = areas });
        }

        // GET: api/Areas/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetArea(int id)
        {
            var area = await _context.Areas.FindAsync(id);

            if (area == null)
            {
                return NotFound(new { success = false, message = "Area not found" });
            }

            return Ok(new { success = true, data = area });
        }
    }
}