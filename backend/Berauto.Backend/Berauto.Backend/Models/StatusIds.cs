namespace Berauto.Backend.Models;

public static class CarStatusId
{
    public const int Available = 1;
    public const int Reserved = 2;
    public const int Rented = 3;
    public const int AwaitingInspection = 4;
    public const int Maintenance = 5;
}

public static class RentalStatusId
{
    public const int Confirmed = 1;
    public const int Active = 2;
    public const int Returned = 3;
    public const int Completed = 4;
    public const int Cancelled = 5;
}

public static class RoleId
{
    public const int Admin = 1;
    public const int Officer = 2;
    public const int Client = 3;
}

public static class RoleName
{
    public const string Admin = "Admin";
    public const string Officer = "Officer";
    public const string Client = "Client";
}
