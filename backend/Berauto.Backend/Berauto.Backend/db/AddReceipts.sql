-- ============================================================================
-- Berauto: Receipts table for rental closing. Idempotent.
-- ============================================================================

USE CarRentalDb;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = N'Receipts')
BEGIN
    CREATE TABLE Receipts
    (
        Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Receipts PRIMARY KEY,
        RentalId    INT               NOT NULL,
        UserId      INT               NOT NULL,
        IssuedAt    DATETIME          NOT NULL,
        Amount      INT               NOT NULL,
        DaysRented  INT               NOT NULL,
        CarRegNum   NVARCHAR(10)      NOT NULL,
        CarBrand    NVARCHAR(15)      NOT NULL,
        CarModel    NVARCHAR(20)      NOT NULL,
        UserName    NVARCHAR(100)     NOT NULL,
        UserEmail   NVARCHAR(100)     NOT NULL,
        UserAddress NVARCHAR(255)     NULL
    );

    CREATE INDEX IX_Receipts_UserId ON Receipts(UserId);
    CREATE UNIQUE INDEX UQ_Receipts_RentalId ON Receipts(RentalId);
END;
GO

SELECT TOP 5 * FROM Receipts ORDER BY Id DESC;
