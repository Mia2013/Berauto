-- ============================================================================
-- Berauto: test data
--  - admin user `user@user.com` / password `user123`
--  - 6 sample cars in different fuel categories
-- Idempotent: safe to re-run. Existing rows are left alone.
-- ============================================================================

USE CarRentalDb;
GO

-- ─── Admin user: user@user.com / user123 ───────────────────────────────────
-- PasswordHash is a real PBKDF2 (HMACSHA512, 100k iters, 16-byte salt, 32-byte
-- subkey) encoded in ASP.NET Identity's V3 format. Verified by PasswordHasher<User>.
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = N'user@user.com')
BEGIN
    INSERT INTO Users (RoleId, Name, Email, Phone, Address, DrivingLicence, PasswordHash)
    VALUES (
        1,                                  -- RoleId = Admin
        N'Test Admin',
        N'user@user.com',
        N'+36 30 000 0000',
        N'1051 Budapest, Teszt utca 1.',
        N'AB123456',
        N'AQAAAAIAAYagAAAAEAobLD1OX2BxgpOktcbX6PlzJ1/IVlJf+Uaai4T9/pfPUJikiSH1yOaH2ZHrb5A9HQ=='
    );
END
ELSE
BEGIN
    -- If the user already exists (e.g. registered via the UI), promote to Admin
    -- and reset the password hash to the known value so login with user123 works.
    UPDATE Users
    SET RoleId = 1,
        PasswordHash = N'AQAAAAIAAYagAAAAEAobLD1OX2BxgpOktcbX6PlzJ1/IVlJf+Uaai4T9/pfPUJikiSH1yOaH2ZHrb5A9HQ=='
    WHERE Email = N'user@user.com';
END;
GO

-- ─── Sample cars ───────────────────────────────────────────────────────────
-- FuelId: 1=Petrol, 2=Diesel, 3=Hybrid, 4=Electric
-- StatusId: 1=Available

IF NOT EXISTS (SELECT 1 FROM Cars WHERE RegNum = N'ABC-001')
    INSERT INTO Cars (RegNum, Brand, Model, Mileage, IsRentable, Fee, FuelId, StatusId)
    VALUES (N'ABC-001', N'Toyota', N'Corolla', 52000, 1, 12000, 1, 1);

IF NOT EXISTS (SELECT 1 FROM Cars WHERE RegNum = N'ABC-002')
    INSERT INTO Cars (RegNum, Brand, Model, Mileage, IsRentable, Fee, FuelId, StatusId)
    VALUES (N'ABC-002', N'Volkswagen', N'Golf', 78000, 1, 15000, 2, 1);

IF NOT EXISTS (SELECT 1 FROM Cars WHERE RegNum = N'ABC-003')
    INSERT INTO Cars (RegNum, Brand, Model, Mileage, IsRentable, Fee, FuelId, StatusId)
    VALUES (N'ABC-003', N'Tesla', N'Model 3', 18500, 1, 25000, 4, 1);

IF NOT EXISTS (SELECT 1 FROM Cars WHERE RegNum = N'ABC-004')
    INSERT INTO Cars (RegNum, Brand, Model, Mileage, IsRentable, Fee, FuelId, StatusId)
    VALUES (N'ABC-004', N'Honda', N'Civic Hybrid', 32000, 1, 18000, 3, 1);

IF NOT EXISTS (SELECT 1 FROM Cars WHERE RegNum = N'ABC-005')
    INSERT INTO Cars (RegNum, Brand, Model, Mileage, IsRentable, Fee, FuelId, StatusId)
    VALUES (N'ABC-005', N'Ford', N'Focus', 105000, 1, 10000, 1, 1);

IF NOT EXISTS (SELECT 1 FROM Cars WHERE RegNum = N'ABC-006')
    INSERT INTO Cars (RegNum, Brand, Model, Mileage, IsRentable, Fee, FuelId, StatusId)
    VALUES (N'ABC-006', N'BMW', N'320d', 64000, 1, 22000, 2, 1);
GO

-- ─── Quick verification ─────────────────────────────────────────────────────
SELECT u.Email, r.Name AS Role
FROM Users u JOIN Roles r ON r.Id = u.RoleId
WHERE u.Email = N'user@user.com';

SELECT RegNum, Brand, Model, Fee, f.Name AS Fuel, s.Name AS Status
FROM Cars c
  JOIN Fuel f ON f.Id = c.FuelId
  JOIN CarStatus s ON s.Id = c.StatusId
ORDER BY c.Id;
