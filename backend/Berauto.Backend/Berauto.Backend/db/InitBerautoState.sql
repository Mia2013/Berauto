-- ============================================================================
-- Berauto: bring existing CarRentalDb up to the new rental-workflow schema.
-- Idempotent: safe to re-run. Run as fallback if `dotnet ef database update`
-- gives you trouble on the scaffolded DB.
-- ============================================================================

USE CarRentalDb;
GO

-- ─── Columns ────────────────────────────────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'PasswordHash' AND Object_ID = Object_ID(N'Users'))
    ALTER TABLE Users ADD PasswordHash NVARCHAR(255) NOT NULL CONSTRAINT DF_Users_PasswordHash DEFAULT '';
GO

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'PlannedStart' AND Object_ID = Object_ID(N'Rentals'))
    ALTER TABLE Rentals ADD PlannedStart DATETIME NOT NULL CONSTRAINT DF_Rentals_PlannedStart DEFAULT '1900-01-01';
GO

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'PlannedEnd' AND Object_ID = Object_ID(N'Rentals'))
    ALTER TABLE Rentals ADD PlannedEnd DATETIME NOT NULL CONSTRAINT DF_Rentals_PlannedEnd DEFAULT '1900-01-01';
GO

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'Condition' AND Object_ID = Object_ID(N'Rentals'))
    ALTER TABLE Rentals ADD [Condition] NVARCHAR(500) NULL;
GO

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'ReturnMileage' AND Object_ID = Object_ID(N'Rentals'))
    ALTER TABLE Rentals ADD ReturnMileage INT NULL;
GO

-- ─── Lookup-table seeds (idempotent) ────────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM Roles WHERE Id = 1) INSERT INTO Roles (Id, Name) VALUES (1, 'Admin');
IF NOT EXISTS (SELECT 1 FROM Roles WHERE Id = 2) INSERT INTO Roles (Id, Name) VALUES (2, 'Officer');
IF NOT EXISTS (SELECT 1 FROM Roles WHERE Id = 3) INSERT INTO Roles (Id, Name) VALUES (3, 'Client');
GO

IF NOT EXISTS (SELECT 1 FROM Fuel WHERE Id = 1) INSERT INTO Fuel (Id, Name) VALUES (1, 'Petrol');
IF NOT EXISTS (SELECT 1 FROM Fuel WHERE Id = 2) INSERT INTO Fuel (Id, Name) VALUES (2, 'Diesel');
IF NOT EXISTS (SELECT 1 FROM Fuel WHERE Id = 3) INSERT INTO Fuel (Id, Name) VALUES (3, 'Hybrid');
IF NOT EXISTS (SELECT 1 FROM Fuel WHERE Id = 4) INSERT INTO Fuel (Id, Name) VALUES (4, 'Electric');
GO

IF NOT EXISTS (SELECT 1 FROM CarStatus WHERE Id = 1) INSERT INTO CarStatus (Id, Name) VALUES (1, 'Available');
IF NOT EXISTS (SELECT 1 FROM CarStatus WHERE Id = 2) INSERT INTO CarStatus (Id, Name) VALUES (2, 'Reserved');
IF NOT EXISTS (SELECT 1 FROM CarStatus WHERE Id = 3) INSERT INTO CarStatus (Id, Name) VALUES (3, 'Rented');
IF NOT EXISTS (SELECT 1 FROM CarStatus WHERE Id = 4) INSERT INTO CarStatus (Id, Name) VALUES (4, 'AwaitingInspection');
IF NOT EXISTS (SELECT 1 FROM CarStatus WHERE Id = 5) INSERT INTO CarStatus (Id, Name) VALUES (5, 'Maintenance');
GO

IF NOT EXISTS (SELECT 1 FROM RentalStatus WHERE Id = 1) INSERT INTO RentalStatus (Id, StatusName) VALUES (1, 'Confirmed');
IF NOT EXISTS (SELECT 1 FROM RentalStatus WHERE Id = 2) INSERT INTO RentalStatus (Id, StatusName) VALUES (2, 'Active');
IF NOT EXISTS (SELECT 1 FROM RentalStatus WHERE Id = 3) INSERT INTO RentalStatus (Id, StatusName) VALUES (3, 'Returned');
IF NOT EXISTS (SELECT 1 FROM RentalStatus WHERE Id = 4) INSERT INTO RentalStatus (Id, StatusName) VALUES (4, 'Completed');
IF NOT EXISTS (SELECT 1 FROM RentalStatus WHERE Id = 5) INSERT INTO RentalStatus (Id, StatusName) VALUES (5, 'Cancelled');
GO

-- If you ran this script INSTEAD of `dotnet ef database update`, also mark the
-- migration as applied so EF doesn't try to re-run it:
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = N'__EFMigrationsHistory')
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] NVARCHAR(150) NOT NULL,
        [ProductVersion] NVARCHAR(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE MigrationId = N'20260513120000_InitBerautoState')
    INSERT INTO [__EFMigrationsHistory] (MigrationId, ProductVersion)
    VALUES (N'20260513120000_InitBerautoState', N'9.0.14');
GO
