using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Berauto.Backend.Migrations
{
    /// <summary>
    /// First migration. Adds password + rental-workflow columns and seeds lookup tables idempotently.
    /// Assumes the base tables (Cars, Users, Rentals, Roles, Fuel, CarStatus, RentalStatus) already
    /// exist (originally scaffolded from the existing CarRentalDb). If you're starting from an
    /// empty database, run db/migrations/InitBerautoState.sql instead.
    /// </summary>
    public partial class InitBerautoState : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ─── New columns ─────────────────────────────────────────
            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "PlannedStart",
                table: "Rentals",
                type: "datetime",
                nullable: false,
                defaultValue: new DateTime(1900, 1, 1));

            migrationBuilder.AddColumn<DateTime>(
                name: "PlannedEnd",
                table: "Rentals",
                type: "datetime",
                nullable: false,
                defaultValue: new DateTime(1900, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "Condition",
                table: "Rentals",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReturnMileage",
                table: "Rentals",
                type: "int",
                nullable: true);

            // ─── Idempotent lookup-table seeds ───────────────────────
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM Roles WHERE Id = 1) INSERT INTO Roles (Id, Name) VALUES (1, 'Admin');
                IF NOT EXISTS (SELECT 1 FROM Roles WHERE Id = 2) INSERT INTO Roles (Id, Name) VALUES (2, 'Officer');
                IF NOT EXISTS (SELECT 1 FROM Roles WHERE Id = 3) INSERT INTO Roles (Id, Name) VALUES (3, 'Client');
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM Fuel WHERE Id = 1) INSERT INTO Fuel (Id, Name) VALUES (1, 'Petrol');
                IF NOT EXISTS (SELECT 1 FROM Fuel WHERE Id = 2) INSERT INTO Fuel (Id, Name) VALUES (2, 'Diesel');
                IF NOT EXISTS (SELECT 1 FROM Fuel WHERE Id = 3) INSERT INTO Fuel (Id, Name) VALUES (3, 'Hybrid');
                IF NOT EXISTS (SELECT 1 FROM Fuel WHERE Id = 4) INSERT INTO Fuel (Id, Name) VALUES (4, 'Electric');
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM CarStatus WHERE Id = 1) INSERT INTO CarStatus (Id, Name) VALUES (1, 'Available');
                IF NOT EXISTS (SELECT 1 FROM CarStatus WHERE Id = 2) INSERT INTO CarStatus (Id, Name) VALUES (2, 'Reserved');
                IF NOT EXISTS (SELECT 1 FROM CarStatus WHERE Id = 3) INSERT INTO CarStatus (Id, Name) VALUES (3, 'Rented');
                IF NOT EXISTS (SELECT 1 FROM CarStatus WHERE Id = 4) INSERT INTO CarStatus (Id, Name) VALUES (4, 'AwaitingInspection');
                IF NOT EXISTS (SELECT 1 FROM CarStatus WHERE Id = 5) INSERT INTO CarStatus (Id, Name) VALUES (5, 'Maintenance');
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM RentalStatus WHERE Id = 1) INSERT INTO RentalStatus (Id, StatusName) VALUES (1, 'Confirmed');
                IF NOT EXISTS (SELECT 1 FROM RentalStatus WHERE Id = 2) INSERT INTO RentalStatus (Id, StatusName) VALUES (2, 'Active');
                IF NOT EXISTS (SELECT 1 FROM RentalStatus WHERE Id = 3) INSERT INTO RentalStatus (Id, StatusName) VALUES (3, 'Returned');
                IF NOT EXISTS (SELECT 1 FROM RentalStatus WHERE Id = 4) INSERT INTO RentalStatus (Id, StatusName) VALUES (4, 'Completed');
                IF NOT EXISTS (SELECT 1 FROM RentalStatus WHERE Id = 5) INSERT INTO RentalStatus (Id, StatusName) VALUES (5, 'Cancelled');
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "PasswordHash", table: "Users");
            migrationBuilder.DropColumn(name: "PlannedStart", table: "Rentals");
            migrationBuilder.DropColumn(name: "PlannedEnd", table: "Rentals");
            migrationBuilder.DropColumn(name: "Condition", table: "Rentals");
            migrationBuilder.DropColumn(name: "ReturnMileage", table: "Rentals");
            // Seed data is intentionally left in place — rows in Cars/Rentals/Users may reference it.
        }
    }
}
