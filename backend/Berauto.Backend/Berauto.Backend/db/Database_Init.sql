-- ============================================================================
-- 1. LÉPÉS: TELJES TÖRLÉS
-- ============================================================================

USE master;
GO

-- Ha létezik az adatbázis, lekapcsolunk mindenkit és eldobjuk
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'CarRentalDb')
BEGIN
    ALTER DATABASE CarRentalDb SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CarRentalDb;
END
GO

-- Újra létrehozzuk teljesen tisztán
CREATE DATABASE CarRentalDb;
GO

USE CarRentalDb;
GO

-- ============================================================================
-- 2. LÉPÉS: TÁBLÁK LÉTREHOZÁSA (A legfrissebb C# Snapshot alapján)
-- ============================================================================

-- Alaptáblák létrehozása

CREATE TABLE Roles (
    Id INT NOT NULL CONSTRAINT PK_Roles PRIMARY KEY,
    Name NVARCHAR(20) NOT NULL
);

CREATE TABLE Fuel (
    Id INT NOT NULL CONSTRAINT PK_Fuel PRIMARY KEY,
    Name NVARCHAR(20) NOT NULL
);

CREATE TABLE CarStatus (
    Id INT NOT NULL CONSTRAINT PK_CarStatus PRIMARY KEY,
    Name NVARCHAR(20) NOT NULL
);

CREATE TABLE RentalStatus (
    Id INT NOT NULL CONSTRAINT PK_RentalStatus PRIMARY KEY,
    StatusName NVARCHAR(30) NOT NULL
);

CREATE TABLE Users (
    Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Users PRIMARY KEY,
    RoleId INT NOT NULL CONSTRAINT FK_Users_Roles FOREIGN KEY REFERENCES Roles(Id),
    RequestedRoleId INT NULL CONSTRAINT FK_Users_RequestedRoles FOREIGN KEY REFERENCES Roles(Id),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL CONSTRAINT UQ_Users_Email UNIQUE,
    Phone NVARCHAR(20) NULL,
    Address NVARCHAR(255) NULL,
    DrivingLicence NVARCHAR(20) NULL,
    PasswordHash NVARCHAR(255) NOT NULL CONSTRAINT DF_Users_PasswordHash DEFAULT ''
);

CREATE TABLE Cars (
    Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Cars PRIMARY KEY,
    RegNum NVARCHAR(10) NOT NULL CONSTRAINT UQ_Cars_RegNum UNIQUE,
    Brand NVARCHAR(15) NOT NULL,
    Model NVARCHAR(20) NOT NULL,
    Mileage INT NOT NULL,
    IsRentable BIT NOT NULL CONSTRAINT DF_Cars_IsRentable DEFAULT 1,
    Fee INT NOT NULL,
    FuelId INT NOT NULL CONSTRAINT FK_Cars_Fuel FOREIGN KEY REFERENCES Fuel(Id),
    StatusId INT NOT NULL CONSTRAINT FK_Cars_CarStatus FOREIGN KEY REFERENCES CarStatus(Id),
    ImgUrl NVARCHAR(MAX) NOT NULL CONSTRAINT DF_Cars_ImgUrl DEFAULT ''
);

CREATE TABLE Rentals (
    Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Rentals PRIMARY KEY,
    CarId INT NOT NULL CONSTRAINT FK_Rentals_Cars FOREIGN KEY REFERENCES Cars(Id),
    UserId INT NOT NULL CONSTRAINT FK_Rentals_Users FOREIGN KEY REFERENCES Users(Id),
    StatusId INT NOT NULL CONSTRAINT FK_Rentals_Status FOREIGN KEY REFERENCES RentalStatus(Id),
    PlannedStart DATETIME NOT NULL,
    PlannedEnd DATETIME NOT NULL,
    RequestDate DATETIME NULL CONSTRAINT DF_Rentals_RequestDate DEFAULT GETDATE(),
    HandoverDate DATETIME NULL,
    ReturnDate DATETIME NULL,
    ReturnMileage INT NULL,
    Condition NVARCHAR(500) NULL,
    TotalCost INT NULL
);

CREATE TABLE Receipts (
    Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Receipts PRIMARY KEY,
    RentalId INT NOT NULL CONSTRAINT UQ_Receipts_RentalId UNIQUE,
    UserId INT NOT NULL,
    IssuedAt DATETIME NOT NULL,
    Amount INT NOT NULL,
    DaysRented INT NOT NULL,
    CarRegNum NVARCHAR(10) NOT NULL,
    CarBrand NVARCHAR(15) NOT NULL,
    CarModel NVARCHAR(20) NOT NULL,
    UserName NVARCHAR(100) NOT NULL,
    UserEmail NVARCHAR(100) NOT NULL,
    UserAddress NVARCHAR(255) NULL
);

CREATE TABLE AuditLogs (
    Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_AuditLogs PRIMARY KEY,
    [Timestamp] DATETIME NOT NULL,
    UserId INT NULL,
    UserEmail NVARCHAR(100) NULL,
    EntityType NVARCHAR(50) NOT NULL,
    EntityId NVARCHAR(100) NULL,
    Action NVARCHAR(10) NOT NULL,
    Changes NVARCHAR(MAX) NOT NULL
);
GO

CREATE INDEX IX_AuditLogs_Timestamp ON AuditLogs ([Timestamp]);
CREATE INDEX IX_AuditLogs_EntityType_EntityId ON AuditLogs (EntityType, EntityId);
CREATE INDEX IX_Receipts_UserId ON Receipts(UserId);
GO

-- ============================================================================
-- 3. LÉPÉS: TÖRZSDATOK FELTÖLTÉSE (Seed)
-- ============================================================================

INSERT INTO Roles (Id, Name) VALUES (1, 'Admin'), (2, 'Officer'), (3, 'Client');
INSERT INTO Fuel (Id, Name) VALUES (1, 'Petrol'), (2, 'Diesel'), (3, 'Hybrid'), (4, 'Electric');

INSERT INTO CarStatus (Id, Name) VALUES 
(1, 'Available'), (2, 'Reserved'), (3, 'Rented'), (4, 'AwaitingInspection'), (5, 'Maintenance');

INSERT INTO RentalStatus (Id, StatusName) VALUES 
(1, 'Confirmed'), (2, 'Active'), (3, 'Returned'), (4, 'Completed'), (5, 'Cancelled');
GO

-- ============================================================================
-- 4. LÉPÉS: PÉLDA TESZTADATOK (Felhasználók és Autók)
-- ============================================================================

-- Admin felhasználó (user@user.com / user123)
INSERT INTO Users (RoleId, Name, Email, Phone, Address, DrivingLicence, PasswordHash)
VALUES (1, N'Test Admin', N'user@user.com', N'+36 30 000 0000', N'1051 Budapest, Teszt utca 1.', N'AB123456', N'AQAAAAIAAYagAAAAEAobLD1OX2BxgpOktcbX6PlzJ1/IVlJf+Uaai4T9/pfPUJikiSH1yOaH2ZHrb5A9HQ==');

-- Regisztrált ügyfél
INSERT INTO Users (RoleId, Name, Email, Phone, Address, DrivingLicence, PasswordHash)
VALUES (3, N'Minta János', N'minta.janos@gmail.com', N'+36 20 555 6666', N'9022 Győr, Fő út 12.', N'CD778899', N'AQAAAAIAAYagAAAAEAobLD1OX2BxgpOktcbX6PlzJ1/IVlJf+Uaai4T9/pfPUJikiSH1yOaH2ZHrb5A9HQ==');

-- Autók beszúrása
INSERT INTO Cars (RegNum, Brand, Model, Mileage, IsRentable, Fee, FuelId, StatusId, ImgUrl) VALUES 
(N'ABC-001', N'Toyota', N'Corolla', 52000, 1, 12000, 1, 1, N'https://toyotahering.hu/wp-content/uploads/2022/01/Toyota_Corolla_modellev_2022_3-1024x721.jpg'),
(N'ABC-002', N'Volkswagen', N'Golf', 78000, 1, 15000, 2, 1, N'https://images.hgmsites.net/med/2024-volkswagen-golf-2-0t-autobahn-dsg-angular-front-exterior-view_100908508_m.webp'),
(N'ABC-003', N'Tesla', N'Model 3', 18500, 1, 25000, 4, 1, N'https://preview.thenewsmarket.com/Previews/NCAP/StillAssets/1920x1080/684698_v3.jpg'),
(N'ABC-004', N'Honda', N'Civic Hybrid', 32000, 1, 18000, 3, 1, N'https://www.usnews.com/object/image/00000198-a5be-d2c5-a99b-a7bfe16d0000/2026-honda-civic-hybrid-front-three-quarter-ak.jpg?update-time=1755128000776&size=responsive640&format=webp'),
(N'ABC-005', N'Ford', N'Focus', 105000, 1, 10000, 1, 1, N'https://images.hgmsites.net/med/2018-ford-focus-se-sedan-angular-front-exterior-view_100630255_m.jpg'),
(N'ABC-006', N'BMW', N'320d', 64000, 1, 22000, 2, 1, N'https://upload.wikimedia.org/wikipedia/commons/0/03/2019_BMW_320d_xDrive_M_Sport_2.0_Front.jpg');
GO

-- ============================================================================
-- 5. LÉPÉS: AKTÍV BÉRLÉS SZIMULÁCIÓ
-- ============================================================================
DECLARE @TestUserId INT = (SELECT TOP 1 Id FROM Users WHERE Email = N'minta.janos@gmail.com');
DECLARE @TestCarId INT = (SELECT TOP 1 Id FROM Cars WHERE RegNum = N'ABC-003');

IF @TestUserId IS NOT NULL AND @TestCarId IS NOT NULL
BEGIN
    INSERT INTO Rentals (CarId, UserId, StatusId, PlannedStart, PlannedEnd, RequestDate, TotalCost)
    VALUES (@TestCarId, @TestUserId, 2, GETDATE(), DATEADD(day, 3, GETDATE()), GETDATE(), 75000);
    
    DECLARE @NewRentalId INT = SCOPE_IDENTITY();
    
    INSERT INTO Receipts (RentalId, UserId, IssuedAt, Amount, DaysRented, CarRegNum, CarBrand, CarModel, UserName, UserEmail, UserAddress)
    VALUES (@NewRentalId, @TestUserId, GETDATE(), 75000, 3, N'ABC-003', N'Tesla', N'Model 3', N'Minta János', N'minta.janos@gmail.com', N'9022 Győr, Fő út 12.');
    
    INSERT INTO AuditLogs ([Timestamp], UserId, UserEmail, EntityType, EntityId, Action, Changes)
    VALUES (GETDATE(), @TestUserId, N'minta.janos@gmail.com', N'Rental', CAST(@NewRentalId AS NVARCHAR(10)), N'INSERT', N'Created system init test rental for Tesla Model 3.');
END;
GO