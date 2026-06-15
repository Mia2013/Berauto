-- ============================================================================
-- Berauto: backfill Receipts for every existing Completed rental that doesn't
-- already have one. Idempotent — the UNIQUE index on RentalId guarantees no
-- duplicates, and the NOT EXISTS guard makes the SELECT skip them cleanly.
-- ============================================================================

USE CarRentalDb;
GO

INSERT INTO Receipts
    (RentalId, UserId, IssuedAt, Amount, DaysRented,
     CarRegNum, CarBrand, CarModel, UserName, UserEmail, UserAddress)
SELECT
    r.Id              AS RentalId,
    r.UserId          AS UserId,
    -- IssuedAt: prefer the actual ReturnDate; if missing, fall back to now.
    ISNULL(r.ReturnDate, GETDATE()) AS IssuedAt,
    ISNULL(r.TotalCost, 0)          AS Amount,
    -- Mirror the C# rule: Math.Max(1, ceiling of planned-end minus planned-start in days).
    -- Dates from the frontend are at midnight UTC, so a plain DATEDIFF(DAY) is exact.
    CASE
        WHEN DATEDIFF(DAY, r.PlannedStart, r.PlannedEnd) < 1 THEN 1
        ELSE DATEDIFF(DAY, r.PlannedStart, r.PlannedEnd)
    END                AS DaysRented,
    c.RegNum,
    c.Brand,
    c.Model,
    u.Name             AS UserName,
    u.Email            AS UserEmail,
    u.Address          AS UserAddress
FROM Rentals r
    JOIN Cars  c ON c.Id = r.CarId
    JOIN Users u ON u.Id = r.UserId
WHERE r.StatusId = 4         -- 4 = RentalStatusId.Completed
  AND NOT EXISTS (SELECT 1 FROM Receipts e WHERE e.RentalId = r.Id);
GO

-- Summary so you can see what landed.
DECLARE @inserted INT = @@ROWCOUNT;  -- not reliable across GO; use a SELECT instead

SELECT
    (SELECT COUNT(*) FROM Receipts) AS TotalReceipts,
    (SELECT COUNT(*) FROM Rentals WHERE StatusId = 4) AS CompletedRentals,
    (SELECT COUNT(*) FROM Rentals r WHERE r.StatusId = 4
        AND NOT EXISTS (SELECT 1 FROM Receipts e WHERE e.RentalId = r.Id)) AS StillMissing;

SELECT TOP 10
    Id, RentalId, IssuedAt, Amount, DaysRented,
    CarBrand + ' ' + CarModel AS Car, UserEmail
FROM Receipts
ORDER BY Id DESC;
