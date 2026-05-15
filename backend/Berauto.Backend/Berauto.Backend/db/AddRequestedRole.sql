-- ============================================================================
-- Add Users.RequestedRoleId — the role a user picked at sign-up, pending admin
-- approval. Idempotent: safe to re-run.
-- ============================================================================

USE CarRentalDb;
GO

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'RequestedRoleId' AND Object_ID = Object_ID(N'Users'))
BEGIN
    ALTER TABLE Users ADD RequestedRoleId INT NULL;
END;
GO

-- Optional: foreign key so an invalid role id can't slip in. Skip if it already exists.
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_Users_RequestedRoles'
)
BEGIN
    ALTER TABLE Users
        ADD CONSTRAINT FK_Users_RequestedRoles
            FOREIGN KEY (RequestedRoleId) REFERENCES Roles(Id);
END;
GO

SELECT TOP 5 Id, Email, RoleId, RequestedRoleId FROM Users ORDER BY Id DESC;
