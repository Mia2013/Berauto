
using Berauto.Models;
using Scalar.AspNetCore;
using System;

namespace Berauto.Backend
{

    internal class Program
    {
        static void Main(string[] args)
        {
            DbManager manager = new DbManager();

            List<Car> availableCars = manager.GetAvailableCars();
            foreach (var acars in availableCars)
            {
                Console.WriteLine(acars);
            }


            Console.WriteLine();
            List<User> clients = manager.GetClients();
            foreach (var client in clients)
            {
                Console.WriteLine(client);
            }

            //Web api creation
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ReactPolicy", policy =>
                {
                    policy.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            var app = builder.Build();


            // Configure the HTTP request pipeline.
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
