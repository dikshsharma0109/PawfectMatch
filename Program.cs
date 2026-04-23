using Microsoft.EntityFrameworkCore;
using PawfectMatch.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // IMPORTANT: Keep PascalCase (matches your frontend)
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS (allow frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

// Middleware
app.UseHttpsRedirection();

// Serve frontend files
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("AllowAll");

app.UseAuthorization();

// Map APIs
app.MapControllers();

app.Run();