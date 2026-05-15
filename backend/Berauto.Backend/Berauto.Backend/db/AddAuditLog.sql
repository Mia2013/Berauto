-- ============================================================================
-- Berauto: AuditLog table for tracking all entity changes.
-- Idempotent: safe to re-run.
-- ============================================================================

USE CarRentalDb;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = N'AuditLogs')
BEGIN
    CREATE TABLE AuditLogs
    (
        Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_AuditLogs PRIMARY KEY,
        [Timestamp] DATETIME          NOT NULL,
        UserId      INT               NULL,
        UserEmail   NVARCHAR(100)     NULL,
        EntityType  NVARCHAR(50)      NOT NULL,
        EntityId    NVARCHAR(100)     NULL,
        Action      NVARCHAR(10)      NOT NULL,
        Changes     NVARCHAR(MAX)     NOT NULL
    );

    CREATE INDEX IX_AuditLogs_Timestamp ON AuditLogs ([Timestamp]);
    CREATE INDEX IX_AuditLogs_EntityType_EntityId ON AuditLogs (EntityType, EntityId);
END;
GO

SELECT TOP 5 * FROM AuditLogs ORDER BY Id DESC;
