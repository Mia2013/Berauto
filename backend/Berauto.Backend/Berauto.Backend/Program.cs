using Berauto.Models;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

namespace Berauto.Backend
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Register DbContext with DI (reads connection string from appsettings.json)
            builder.Services.AddDbContext<CarRentalDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Register DbManager with DI
            builder.Services.AddScoped<DbManager>();

            // CORS for React frontend
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ReactPolicy", policy =>
                {
                    policy.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler =
                    System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
            });

            builder.Services.AddOpenApi();



            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            app.UseHttpsRedirection();
            app.UseCors("ReactPolicy");
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}