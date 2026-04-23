using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawfectMatch.Data;
using PawfectMatch.Models;

namespace PawfectMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===============================
        // REGISTER
        // ===============================
        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] User user)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser != null)
            {
                return BadRequest(new { success = false, message = "Email already registered" });
            }

            user.CreatedAt = DateTime.Now;
            user.IsVerified = false;
            user.City = "Ahmedabad";
            user.Role = "user";

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Registration successful!",
                data = new
                {
                    token = Guid.NewGuid().ToString(),
                    user = new
                    {
                        user.UserId,
                        user.FirstName,
                        user.LastName,
                        user.Email,
                        user.Role
                    }
                }
            });
        }

        // ===============================
        // LOGIN (ADMIN + USER)
        // ===============================
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            // 🔥 ADMIN LOGIN
            if (request.Email == "dikshsharma0109@gmail.com" && request.Password == "diksha@1234")
            {
                var adminUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (adminUser == null)
                {
                    adminUser = new User
                    {
                        FirstName = "Admin",
                        LastName = "User",
                        Email = request.Email,
                        Password = request.Password,
                        Role = "admin",
                        City = "Ahmedabad",
                        IsVerified = true,
                        CreatedAt = DateTime.Now
                    };

                    _context.Users.Add(adminUser);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    adminUser.Role = "admin";
                    await _context.SaveChangesAsync();
                }

                return Ok(new
                {
                    success = true,
                    message = "Admin login successful",
                    data = new
                    {
                        token = Guid.NewGuid().ToString(),
                        user = new
                        {
                            adminUser.UserId,
                            adminUser.FirstName,
                            adminUser.LastName,
                            adminUser.Email,
                            adminUser.Role
                        }
                    }
                });
            }

            // 🔹 NORMAL USER LOGIN
            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Email == request.Email &&
                    u.Password == request.Password);

            if (user == null)
            {
                return BadRequest(new { success = false, message = "Invalid email or password" });
            }

            return Ok(new
            {
                success = true,
                message = "Login successful",
                data = new
                {
                    token = Guid.NewGuid().ToString(),
                    user = new
                    {
                        user.UserId,
                        user.FirstName,
                        user.LastName,
                        user.Email,
                        user.Role
                    }
                }
            });
        }

        // ===============================
        // GET USERS (ADMIN HIDDEN)
        // ===============================
        [HttpGet]
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Where(u => u.Role != "admin") // hide admin
                .Select(u => new
                {
                    u.UserId,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.Phone,
                    u.City,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        // ===============================
        // PROFILE
        // ===============================
        [HttpGet("profile/{id}")]
        public async Task<ActionResult> GetProfile(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            return Ok(new
            {
                user.UserId,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Phone,
                user.City,
                user.Role
            });
        }

        [HttpPut("profile/{id}")]
        public async Task<ActionResult> UpdateProfile(int id, [FromBody] User updatedUser)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Phone = updatedUser.Phone;
            user.Area = updatedUser.Area;

            await _context.SaveChangesAsync();

            return Ok();
        }

        // ===============================
        // DELETE USER
        // ===============================
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // ===============================
        // UPDATE USER
        // ===============================
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Email = updatedUser.Email;
            user.Phone = updatedUser.Phone;
            user.Role = updatedUser.Role;

            await _context.SaveChangesAsync();

            return Ok();
        }
    }

    // ===============================
    // LOGIN MODEL
    // ===============================
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}