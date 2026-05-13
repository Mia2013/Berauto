using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Berauto.Backend.Migrations
{
    /// <summary>
    /// Baseline marker migration. The schema already exists in the DB (originally
    /// scaffolded from CarRentalDb, then brought up to match the model via
    /// db/InitBerautoState.sql). Up() and Down() are intentionally empty so that
    /// running `dotnet ef database update` simply records this migration as
    /// applied in __EFMigrationsHistory. Future migrations diff against the
    /// snapshot captured alongside this file.
    /// </summary>
    public partial class InitialBaseline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // intentionally empty — schema is already in place
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // intentionally empty
        }
    }
}
