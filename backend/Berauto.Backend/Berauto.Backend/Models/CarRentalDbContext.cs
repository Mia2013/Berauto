using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Berauto.Models;

public partial class CarRentalDbContext : DbContext
{
    public CarRentalDbContext()
    {
    }

    public CarRentalDbContext(DbContextOptions<CarRentalDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Car> Cars { get; set; }

    public virtual DbSet<CarStatus> CarStatuses { get; set; }

    public virtual DbSet<Fuel> Fuels { get; set; }

    public virtual DbSet<Rental> Rentals { get; set; }

    public virtual DbSet<RentalStatus> RentalStatuses { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    //local db path:
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=CarRentalDb;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Car>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Cars__3214EC0747D9C496");

            entity.HasIndex(e => e.RegNum, "UQ__Cars__34C6A0A69870A7BF").IsUnique();

            entity.Property(e => e.Brand).HasMaxLength(15);
            entity.Property(e => e.IsRentable).HasDefaultValue(true);
            entity.Property(e => e.Model).HasMaxLength(20);
            entity.Property(e => e.RegNum).HasMaxLength(10);

            entity.HasOne(d => d.Fuel).WithMany(p => p.Cars)
                .HasForeignKey(d => d.FuelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Cars_Fuel");

            entity.HasOne(d => d.Status).WithMany(p => p.Cars)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Cars_CarStatus");
        });

        modelBuilder.Entity<CarStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CarStatu__3214EC079E7141F3");

            entity.ToTable("CarStatus");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(20);
        });

        modelBuilder.Entity<Fuel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Fuel__3214EC071FF1B4E1");

            entity.ToTable("Fuel");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(20);
        });

        modelBuilder.Entity<Rental>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Rentals__3214EC0749B7546D");

            entity.Property(e => e.HandoverDate).HasColumnType("datetime");
            entity.Property(e => e.RequestDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ReturnDate).HasColumnType("datetime");

            entity.HasOne(d => d.Car).WithMany(p => p.Rentals)
                .HasForeignKey(d => d.CarId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Rentals_Cars");

            entity.HasOne(d => d.Status).WithMany(p => p.Rentals)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Rentals_Status");

            entity.HasOne(d => d.User).WithMany(p => p.Rentals)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Rentals_Users");
        });

        modelBuilder.Entity<RentalStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__RentalSt__3214EC071B70ECB1");

            entity.ToTable("RentalStatus");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.StatusName).HasMaxLength(30);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Roles__3214EC079F686474");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(20);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07F3940CC2");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D1053463D6C556").IsUnique();

            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.DrivingLicence).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(20);

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_Roles");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
