using Berauto.Backend.Services;
using Berauto.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;

namespace Berauto.Backend
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Audit interceptor needs the current HTTP context to know who made the change.
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddScoped<AuditSaveChangesInterceptor>();

            // Register DbContext with DI; resolve and attach the audit interceptor per scope.
            builder.Services.AddDbContext<CarRentalDbContext>((serviceProvider, options) =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
                options.AddInterceptors(serviceProvider.GetRequiredService<AuditSaveChangesInterceptor>());
            });

            // Register DbManager with DI
            builder.Services.AddScoped<DbManager>();

            // Password hashing (PBKDF2 via ASP.NET Identity's PasswordHasher<T>)
            builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();

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

            // JWT Authentication
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
                    };
                });

            builder.Services.AddOpenApi();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("ReactPolicy");
            app.UseAuthentication(); 
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}