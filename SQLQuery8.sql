USE [master]
GO
/****** Object:  Database [CarRentalDb]    Script Date: 2026. 06. 19. 0:57:09 ******/
CREATE DATABASE [CarRentalDb]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'masodik_Data', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\masodik.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'masodik_Log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\masodik.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [CarRentalDb] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [CarRentalDb].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [CarRentalDb] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [CarRentalDb] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [CarRentalDb] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [CarRentalDb] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [CarRentalDb] SET ARITHABORT OFF 
GO
ALTER DATABASE [CarRentalDb] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [CarRentalDb] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [CarRentalDb] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [CarRentalDb] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [CarRentalDb] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [CarRentalDb] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [CarRentalDb] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [CarRentalDb] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [CarRentalDb] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [CarRentalDb] SET  ENABLE_BROKER 
GO
ALTER DATABASE [CarRentalDb] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [CarRentalDb] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [CarRentalDb] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [CarRentalDb] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [CarRentalDb] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [CarRentalDb] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [CarRentalDb] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [CarRentalDb] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [CarRentalDb] SET  MULTI_USER 
GO
ALTER DATABASE [CarRentalDb] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [CarRentalDb] SET DB_CHAINING OFF 
GO
ALTER DATABASE [CarRentalDb] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [CarRentalDb] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [CarRentalDb] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [CarRentalDb] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'CarRentalDb', N'ON'
GO
ALTER DATABASE [CarRentalDb] SET QUERY_STORE = ON
GO
ALTER DATABASE [CarRentalDb] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [CarRentalDb]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 2026. 06. 19. 0:57:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AuditLogs]    Script Date: 2026. 06. 19. 0:57:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AuditLogs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Timestamp] [datetime] NOT NULL,
	[UserId] [int] NULL,
	[UserEmail] [nvarchar](100) NULL,
	[EntityType] [nvarchar](50) NOT NULL,
	[EntityId] [nvarchar](100) NULL,
	[Action] [nvarchar](10) NOT NULL,
	[Changes] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_AuditLogs] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Cars]    Script Date: 2026. 06. 19. 0:57:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Cars](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RegNum] [nvarchar](10) NOT NULL,
	[Brand] [nvarchar](15) NOT NULL,
	[Model] [nvarchar](20) NOT NULL,
	[Mileage] [int] NOT NULL,
	[IsRentable] [bit] NOT NULL,
	[Fee] [int] NOT NULL,
	[FuelId] [int] NOT NULL,
	[StatusId] [int] NOT NULL,
	[ImgUrl] [varchar](255) NULL,
	[IsDeleted] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CarStatus]    Script Date: 2026. 06. 19. 0:57:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CarStatus](
	[Id] [int] NOT NULL,
	[Name] [nvarchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Fuel]    Script Date: 2026. 06. 19. 0:57:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Fuel](
	[Id] [int] NOT NULL,
	[Name] [nvarchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Receipts]    Script Date: 2026. 06. 19. 0:57:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Receipts](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RentalId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	[IssuedAt] [datetime] NOT NULL,
	[Amount] [int] NOT NULL,
	[DaysRented] [int] NOT NULL,
	[CarRegNum] [nvarchar](10) NOT NULL,
	[CarBrand] [nvarchar](15) NOT NULL,
	[CarModel] [nvarchar](20) NOT NULL,
	[UserName] [nvarchar](100) NOT NULL,
	[UserEmail] [nvarchar](100) NOT NULL,
	[UserAddress] [nvarchar](255) NULL,
 CONSTRAINT [PK_Receipts] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rentals]    Script Date: 2026. 06. 19. 0:57:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rentals](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CarId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	[StatusId] [int] NOT NULL,
	[RequestDate] [datetime] NULL,
	[HandoverDate] [datetime] NULL,
	[ReturnDate] [datetime] NULL,
	[TotalCost] [int] NULL,
	[PlannedStart] [datetime] NOT NULL,
	[PlannedEnd] [datetime] NOT NULL,
	[Condition] [nvarchar](500) NULL,
	[ReturnMileage] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RentalStatus]    Script Date: 2026. 06. 19. 0:57:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RentalStatus](
	[Id] [int] NOT NULL,
	[StatusName] [nvarchar](30) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 2026. 06. 19. 0:57:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[Id] [int] NOT NULL,
	[Name] [nvarchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 2026. 06. 19. 0:57:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoleId] [int] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[Phone] [nvarchar](20) NULL,
	[Address] [nvarchar](255) NULL,
	[DrivingLicence] [nvarchar](20) NULL,
	[PasswordHash] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260513120000_InitBerautoState', N'9.0.14')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260513124302_InitialBaseline', N'9.0.14')
GO
SET IDENTITY_INSERT [dbo].[AuditLogs] ON 
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1, CAST(N'2026-05-14T06:53:52.893' AS DateTime), 14, N'user@user.com', N'Car', N'4', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (2, CAST(N'2026-05-14T06:54:16.457' AS DateTime), 14, N'user@user.com', N'Car', N'4', N'Update', N'{"StatusId":{"old":5,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1002, CAST(N'2026-05-15T14:44:15.043' AS DateTime), 12, N'asd@asd.com', N'Rental', N'5', N'Insert', N'{"Id":-2147482647,"CarId":1,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-05-16T00:00:00Z","PlannedStart":"2026-05-15T00:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":15000,"UserId":12}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1003, CAST(N'2026-05-15T14:44:15.043' AS DateTime), 12, N'asd@asd.com', N'Car', N'1', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1004, CAST(N'2026-05-15T14:44:41.493' AS DateTime), 13, N'laci@laci.hu', N'Rental', N'5', N'Update', N'{"HandoverDate":{"old":null,"new":"2026-05-15T14:44:41.4886831Z"},"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1005, CAST(N'2026-05-15T14:44:41.493' AS DateTime), 13, N'laci@laci.hu', N'Car', N'1', N'Update', N'{"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1006, CAST(N'2026-05-15T14:45:14.030' AS DateTime), 12, N'asd@asd.com', N'Rental', N'5', N'Update', N'{"ReturnDate":{"old":null,"new":"2026-05-15T14:45:14.0177853Z"},"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1007, CAST(N'2026-05-15T14:45:14.030' AS DateTime), 12, N'asd@asd.com', N'Car', N'1', N'Update', N'{"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1008, CAST(N'2026-05-15T14:45:35.127' AS DateTime), 13, N'laci@laci.hu', N'Rental', N'5', N'Update', N'{"Condition":{"old":null,"new":"asdfghjkl\u00E9"},"ReturnMileage":{"old":null,"new":88888888},"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1009, CAST(N'2026-05-15T14:45:35.127' AS DateTime), 13, N'laci@laci.hu', N'Car', N'1', N'Update', N'{"Mileage":{"old":250000,"new":88888888},"StatusId":{"old":4,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1010, CAST(N'2026-05-15T14:46:10.637' AS DateTime), 14, N'user@user.com', N'Rental', N'5', N'Update', N'{"PlannedEnd":{"old":"2026-05-16T00:00:00","new":"2026-05-15T00:00:00Z"},"PlannedStart":{"old":"2026-05-15T00:00:00","new":"2026-05-14T00:00:00Z"},"TotalCost":{"old":15000,"new":150000}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1011, CAST(N'2026-05-15T14:46:16.883' AS DateTime), 14, N'user@user.com', N'Rental', N'5', N'Update', N'{"PlannedEnd":{"old":"2026-05-15T00:00:00","new":"2026-05-14T00:00:00Z"},"PlannedStart":{"old":"2026-05-14T00:00:00","new":"2026-05-13T00:00:00Z"},"TotalCost":{"old":150000,"new":15000}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1012, CAST(N'2026-05-15T14:46:23.020' AS DateTime), 14, N'user@user.com', N'Car', N'4', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1013, CAST(N'2026-05-15T14:46:36.787' AS DateTime), 14, N'user@user.com', N'Car', N'4', N'Update', N'{"StatusId":{"old":5,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1014, CAST(N'2026-05-15T14:49:23.120' AS DateTime), 14, N'user@user.com', N'Car', N'11', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1015, CAST(N'2026-05-15T14:49:31.030' AS DateTime), 14, N'user@user.com', N'Car', N'11', N'Update', N'{"StatusId":{"old":5,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1016, CAST(N'2026-05-15T17:09:36.070' AS DateTime), 14, N'user@user.com', N'Rental', N'2', N'Update', N'{"PlannedEnd":{"old":"2026-05-13T00:00:00","new":"2026-05-12T00:00:00Z"},"PlannedStart":{"old":"2026-05-12T00:00:00","new":"2026-05-11T00:00:00Z"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1017, CAST(N'2026-05-15T17:09:38.493' AS DateTime), 14, N'user@user.com', N'Rental', N'4', N'Update', N'{"PlannedEnd":{"old":"2026-05-14T00:00:00","new":"2026-05-13T00:00:00Z"},"PlannedStart":{"old":"2026-05-12T00:00:00","new":"2026-05-11T00:00:00Z"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1018, CAST(N'2026-05-15T17:09:40.077' AS DateTime), 14, N'user@user.com', N'Rental', N'5', N'Update', N'{"PlannedEnd":{"old":"2026-05-14T00:00:00","new":"2026-05-13T00:00:00Z"},"PlannedStart":{"old":"2026-05-13T00:00:00","new":"2026-05-12T00:00:00Z"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1019, CAST(N'2026-05-15T17:09:47.190' AS DateTime), 14, N'user@user.com', N'Rental', N'6', N'Insert', N'{"Id":-2147482647,"CarId":5,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-05-16T00:00:00Z","PlannedStart":"2026-05-15T00:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":15000,"UserId":14}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1020, CAST(N'2026-05-15T17:09:47.190' AS DateTime), 14, N'user@user.com', N'Car', N'5', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1021, CAST(N'2026-05-15T17:09:50.763' AS DateTime), 14, N'user@user.com', N'Rental', N'6', N'Update', N'{"HandoverDate":{"old":null,"new":"2026-05-15T17:09:50.7580363Z"},"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1022, CAST(N'2026-05-15T17:09:50.763' AS DateTime), 14, N'user@user.com', N'Car', N'5', N'Update', N'{"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1023, CAST(N'2026-05-15T17:09:56.757' AS DateTime), 14, N'user@user.com', N'Rental', N'6', N'Update', N'{"ReturnDate":{"old":null,"new":"2026-05-15T17:09:56.751795Z"},"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1024, CAST(N'2026-05-15T17:09:56.757' AS DateTime), 14, N'user@user.com', N'Car', N'5', N'Update', N'{"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1025, CAST(N'2026-05-15T17:10:08.027' AS DateTime), 14, N'user@user.com', N'Receipt', N'1', N'Insert', N'{"Id":-2147482647,"Amount":15000,"CarBrand":"Volkswagen","CarModel":"Golf","CarRegNum":"ABC-002","DaysRented":1,"IssuedAt":"2026-05-15T17:10:08.0061175Z","RentalId":6,"UserAddress":"1051 Budapest, Teszt utca 1.","UserEmail":"user@user.com","UserId":14,"UserName":"Test Admin"}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1026, CAST(N'2026-05-15T17:10:08.027' AS DateTime), 14, N'user@user.com', N'Rental', N'6', N'Update', N'{"ReturnMileage":{"old":null,"new":666666},"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1027, CAST(N'2026-05-15T17:10:08.027' AS DateTime), 14, N'user@user.com', N'Car', N'5', N'Update', N'{"Mileage":{"old":78000,"new":666666},"StatusId":{"old":4,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1028, CAST(N'2026-06-07T11:44:12.700' AS DateTime), 12, N'asd@asd.com', N'Rental', N'7', N'Insert', N'{"Id":-2147482647,"CarId":1,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-08T00:00:00Z","PlannedStart":"2026-06-07T00:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":15000,"UserId":12}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1029, CAST(N'2026-06-07T11:44:12.700' AS DateTime), 12, N'asd@asd.com', N'Car', N'1', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1030, CAST(N'2026-06-07T11:45:19.003' AS DateTime), 14, N'user@user.com', N'Rental', N'7', N'Update', N'{"Condition":{"old":null,"new":"Valami adat."},"PlannedEnd":{"old":"2026-06-08T00:00:00","new":"2026-06-07T00:00:00Z"},"PlannedStart":{"old":"2026-06-07T00:00:00","new":"2026-06-06T00:00:00Z"},"TotalCost":{"old":15000,"new":1500}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1031, CAST(N'2026-06-07T11:45:32.127' AS DateTime), 14, N'user@user.com', N'Rental', N'7', N'Update', N'{"HandoverDate":{"old":null,"new":"2026-06-07T11:45:32.1207675Z"},"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1032, CAST(N'2026-06-07T11:45:32.127' AS DateTime), 14, N'user@user.com', N'Car', N'1', N'Update', N'{"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1033, CAST(N'2026-06-07T11:45:59.907' AS DateTime), 12, N'asd@asd.com', N'Rental', N'7', N'Update', N'{"ReturnDate":{"old":null,"new":"2026-06-07T11:45:59.8984748Z"},"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1034, CAST(N'2026-06-07T11:45:59.907' AS DateTime), 12, N'asd@asd.com', N'Car', N'1', N'Update', N'{"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1035, CAST(N'2026-06-07T11:47:12.017' AS DateTime), 14, N'user@user.com', N'Receipt', N'5', N'Insert', N'{"Id":-2147482647,"Amount":1500,"CarBrand":"Toyota","CarModel":"Corolla","CarRegNum":"ABC-123","DaysRented":1,"IssuedAt":"2026-06-07T11:47:12.0053866Z","RentalId":7,"UserAddress":"asdad","UserEmail":"asd@asd.com","UserId":12,"UserName":"asd"}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1036, CAST(N'2026-06-07T11:47:12.017' AS DateTime), 14, N'user@user.com', N'Rental', N'7', N'Update', N'{"Condition":{"old":"Valami adat.","new":"Szuper"},"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1037, CAST(N'2026-06-07T11:47:12.017' AS DateTime), 14, N'user@user.com', N'Car', N'1', N'Update', N'{"StatusId":{"old":4,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1038, CAST(N'2026-06-07T11:47:35.707' AS DateTime), 14, N'user@user.com', N'Car', N'1', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1039, CAST(N'2026-06-07T11:47:52.887' AS DateTime), 14, N'user@user.com', N'Car', N'1', N'Update', N'{"StatusId":{"old":5,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1040, CAST(N'2026-06-07T11:48:29.013' AS DateTime), 14, N'user@user.com', N'Car', N'12', N'Insert', N'{"Id":-2147482647,"Brand":"BMW","Fee":40000,"FuelId":1,"IsRentable":true,"Mileage":1500,"Model":"M3","RegNum":"NORB-101","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1041, CAST(N'2026-06-07T11:53:30.270' AS DateTime), NULL, NULL, N'User', N'15', N'Insert', N'{"Id":-2147482647,"Address":"asdasd","DrivingLicence":"456789BA","Email":"norbi@norbi.com","Name":"Norbi","Phone":"\u002B3690111111","RoleId":3}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1042, CAST(N'2026-06-07T12:12:19.590' AS DateTime), 15, N'norbi@norbi.com', N'User', N'15', N'Update', N'{"Address":{"old":"asdasd","new":"V\u00E1rus utca h\u00E1zsz\u00E1m."},"Phone":{"old":"\u002B3690111111","new":"\u002B3690111112"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1043, CAST(N'2026-06-07T12:14:03.597' AS DateTime), 15, N'norbi@norbi.com', N'Rental', N'8', N'Insert', N'{"Id":-2147482647,"CarId":9,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-08T00:00:00Z","PlannedStart":"2026-06-07T00:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":22000,"UserId":15}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1044, CAST(N'2026-06-07T12:14:03.597' AS DateTime), 15, N'norbi@norbi.com', N'Car', N'9', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1045, CAST(N'2026-06-07T12:15:34.180' AS DateTime), 14, N'user@user.com', N'Car', N'4', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1046, CAST(N'2026-06-07T12:15:38.963' AS DateTime), 14, N'user@user.com', N'Car', N'4', N'Update', N'{"StatusId":{"old":5,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1047, CAST(N'2026-06-07T12:16:06.557' AS DateTime), 13, N'laci@laci.hu', N'Car', N'6', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1048, CAST(N'2026-06-07T12:16:11.113' AS DateTime), 13, N'laci@laci.hu', N'Car', N'6', N'Update', N'{"StatusId":{"old":5,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1049, CAST(N'2026-06-07T12:17:14.540' AS DateTime), 13, N'laci@laci.hu', N'Rental', N'8', N'Update', N'{"HandoverDate":{"old":null,"new":"2026-06-07T12:17:14.5344334Z"},"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1050, CAST(N'2026-06-07T12:17:14.540' AS DateTime), 13, N'laci@laci.hu', N'Car', N'9', N'Update', N'{"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1051, CAST(N'2026-06-07T12:17:23.773' AS DateTime), 15, N'norbi@norbi.com', N'Rental', N'8', N'Update', N'{"ReturnDate":{"old":null,"new":"2026-06-07T12:17:23.7639099Z"},"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1052, CAST(N'2026-06-07T12:17:23.773' AS DateTime), 15, N'norbi@norbi.com', N'Car', N'9', N'Update', N'{"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1053, CAST(N'2026-06-07T12:17:51.683' AS DateTime), 14, N'user@user.com', N'Receipt', N'6', N'Insert', N'{"Id":-2147482647,"Amount":22000,"CarBrand":"BMW","CarModel":"320d","CarRegNum":"ABC-006","DaysRented":1,"IssuedAt":"2026-06-07T12:17:51.6589132Z","RentalId":8,"UserAddress":"V\u00E1rus utca h\u00E1zsz\u00E1m.","UserEmail":"norbi@norbi.com","UserId":15,"UserName":"Norbi"}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1054, CAST(N'2026-06-07T12:17:51.683' AS DateTime), 14, N'user@user.com', N'Rental', N'8', N'Update', N'{"ReturnMileage":{"old":null,"new":80000},"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1055, CAST(N'2026-06-07T12:17:51.683' AS DateTime), 14, N'user@user.com', N'Car', N'9', N'Update', N'{"Mileage":{"old":64000,"new":80000},"StatusId":{"old":4,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1056, CAST(N'2026-06-07T12:43:05.970' AS DateTime), 13, N'laci@laci.hu', N'Car', N'10', N'Update', N'{"Model":{"old":"Astra G","new":"Astra G menci"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1057, CAST(N'2026-06-07T12:48:03.507' AS DateTime), 13, N'laci@laci.hu', N'Car', N'4', N'Update', N'{"Brand":{"old":"Toyota","new":"Toyotaa"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1058, CAST(N'2026-06-07T12:48:08.993' AS DateTime), 13, N'laci@laci.hu', N'Car', N'4', N'Update', N'{"Brand":{"old":"Toyotaa","new":"Toyota"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1059, CAST(N'2026-06-07T12:48:13.557' AS DateTime), 13, N'laci@laci.hu', N'Car', N'4', N'Update', N'{"Mileage":{"old":52000,"new":52001}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1060, CAST(N'2026-06-07T12:51:08.617' AS DateTime), 13, N'laci@laci.hu', N'Car', N'12', N'Update', N'{"Model":{"old":"M3","new":"M33"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1061, CAST(N'2026-06-07T12:52:21.473' AS DateTime), 12, N'asd@asd.com', N'User', N'12', N'Update', N'{"Phone":{"old":"741852","new":"7418522"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1062, CAST(N'2026-06-07T13:17:53.550' AS DateTime), NULL, NULL, N'User', N'17', N'Insert', N'{"Id":-2147482647,"Address":"3903, Bekecs, T\u00FAzolt\u00F3 \u00FAt, 28","DrivingLicence":"123456789","Email":"asdasd@asdasd.com","Name":"Valami Ak\u00E1rmi","Phone":"\u002B36303332699","RoleId":3}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1063, CAST(N'2026-06-07T13:17:53.637' AS DateTime), NULL, NULL, N'Rental', N'9', N'Insert', N'{"Id":-2147482647,"CarId":7,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-08T00:00:00Z","PlannedStart":"2026-06-07T00:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":18000,"UserId":17}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1064, CAST(N'2026-06-07T13:17:53.637' AS DateTime), NULL, NULL, N'Car', N'7', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1065, CAST(N'2026-06-07T13:18:22.740' AS DateTime), 13, N'laci@laci.hu', N'Rental', N'9', N'Update', N'{"HandoverDate":{"old":null,"new":"2026-06-07T13:18:22.7313887Z"},"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1066, CAST(N'2026-06-07T13:18:22.740' AS DateTime), 13, N'laci@laci.hu', N'Car', N'7', N'Update', N'{"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1067, CAST(N'2026-06-07T13:18:45.577' AS DateTime), 13, N'laci@laci.hu', N'Rental', N'9', N'Update', N'{"ReturnDate":{"old":null,"new":"2026-06-07T13:18:45.566162Z"},"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1068, CAST(N'2026-06-07T13:18:45.577' AS DateTime), 13, N'laci@laci.hu', N'Car', N'7', N'Update', N'{"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1069, CAST(N'2026-06-07T13:18:56.247' AS DateTime), 13, N'laci@laci.hu', N'Receipt', N'7', N'Insert', N'{"Id":-2147482647,"Amount":18000,"CarBrand":"Honda","CarModel":"Civic Hybrid","CarRegNum":"ABC-004","DaysRented":1,"IssuedAt":"2026-06-07T13:18:56.2217408Z","RentalId":9,"UserAddress":"3903, Bekecs, T\u00FAzolt\u00F3 \u00FAt, 28","UserEmail":"asdasd@asdasd.com","UserId":17,"UserName":"Valami Ak\u00E1rmi"}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1070, CAST(N'2026-06-07T13:18:56.247' AS DateTime), 13, N'laci@laci.hu', N'Rental', N'9', N'Update', N'{"Condition":{"old":null,"new":"minden j\u00F3"},"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1071, CAST(N'2026-06-07T13:18:56.247' AS DateTime), 13, N'laci@laci.hu', N'Car', N'7', N'Update', N'{"StatusId":{"old":4,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1072, CAST(N'2026-06-07T13:20:59.403' AS DateTime), NULL, NULL, N'User', N'18', N'Insert', N'{"Id":-2147482646,"Address":"3333, Balaton, Vend\u00E9g 12","DrivingLicence":"123123","Email":"vendeg@vendeg.com","Name":"Vend\u00E9g Vend\u00E9g","Phone":"\u002B363333333","RoleId":3}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1073, CAST(N'2026-06-07T13:20:59.413' AS DateTime), NULL, NULL, N'Rental', N'10', N'Insert', N'{"Id":-2147482646,"CarId":6,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-08T00:00:00Z","PlannedStart":"2026-06-07T00:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":25000,"UserId":18}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1074, CAST(N'2026-06-07T13:20:59.413' AS DateTime), NULL, NULL, N'Car', N'6', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1075, CAST(N'2026-06-07T13:21:03.843' AS DateTime), 13, N'laci@laci.hu', N'Rental', N'10', N'Update', N'{"HandoverDate":{"old":null,"new":"2026-06-07T13:21:03.8378554Z"},"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1076, CAST(N'2026-06-07T13:21:03.843' AS DateTime), 13, N'laci@laci.hu', N'Car', N'6', N'Update', N'{"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1077, CAST(N'2026-06-07T13:21:09.647' AS DateTime), 14, N'user@user.com', N'Rental', N'10', N'Update', N'{"ReturnDate":{"old":null,"new":"2026-06-07T13:21:09.6387046Z"},"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1078, CAST(N'2026-06-07T13:21:09.647' AS DateTime), 14, N'user@user.com', N'Car', N'6', N'Update', N'{"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1079, CAST(N'2026-06-07T13:21:20.303' AS DateTime), 14, N'user@user.com', N'Receipt', N'8', N'Insert', N'{"Id":-2147482646,"Amount":25000,"CarBrand":"Tesla","CarModel":"Model 3","CarRegNum":"ABC-003","DaysRented":1,"IssuedAt":"2026-06-07T13:21:20.2988594Z","RentalId":10,"UserAddress":"3333, Balaton, Vend\u00E9g 12","UserEmail":"vendeg@vendeg.com","UserId":18,"UserName":"Vend\u00E9g Vend\u00E9g"}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1080, CAST(N'2026-06-07T13:21:20.303' AS DateTime), 14, N'user@user.com', N'Rental', N'10', N'Update', N'{"Condition":{"old":null,"new":"fasza"},"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1081, CAST(N'2026-06-07T13:21:20.303' AS DateTime), 14, N'user@user.com', N'Car', N'6', N'Update', N'{"StatusId":{"old":4,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1082, CAST(N'2026-06-08T19:53:26.903' AS DateTime), NULL, NULL, N'User', N'19', N'Insert', N'{"Id":-2147482647,"Address":"etruztuij","DrivingLicence":"674557687","Email":"komlosnikolett@gmail.com","Name":"bn","Phone":"123456789","RoleId":3}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1083, CAST(N'2026-06-08T19:53:40.433' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'11', N'Insert', N'{"Id":-2147482647,"CarId":1,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-09T00:00:00Z","PlannedStart":"2026-06-08T00:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":15000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1084, CAST(N'2026-06-08T19:53:40.433' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'1', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1085, CAST(N'2026-06-08T20:03:37.693' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"Fee":{"old":15000,"new":150000}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1086, CAST(N'2026-06-08T20:03:42.227' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"Fee":{"old":150000,"new":15000}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1087, CAST(N'2026-06-08T20:03:44.987' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1088, CAST(N'2026-06-08T20:05:45.320' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'6', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1089, CAST(N'2026-06-08T20:05:55.110' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'6', N'Update', N'{"StatusId":{"old":5,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1090, CAST(N'2026-06-08T20:05:55.970' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"StatusId":{"old":5,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1091, CAST(N'2026-06-12T20:48:42.777' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'13', N'Insert', N'{"Id":-2147482647,"Brand":"toyota","Fee":39999,"FuelId":3,"IsRentable":true,"Mileage":10,"Model":"rav4","RegNum":"AAAAAAA","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1092, CAST(N'2026-06-12T20:54:52.480' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'15', N'Insert', N'{"Id":-2147482645,"Brand":"vvvvvvvvvvv","Fee":2,"FuelId":1,"IsRentable":true,"Mileage":3,"Model":"vvvvvvvvvvvv","RegNum":"VVVV1234","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1093, CAST(N'2026-06-12T20:56:01.280' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'17', N'Insert', N'{"Id":-2147482643,"Brand":"vvvvvvvvvvv","Fee":2,"FuelId":1,"IsRentable":true,"Mileage":3,"Model":"vvvvvvvvvvvv","RegNum":"VVV1234","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1094, CAST(N'2026-06-12T20:59:51.400' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'18', N'Insert', N'{"Id":-2147482642,"Brand":"cccccccc","Fee":12,"FuelId":1,"IsRentable":true,"Mileage":3,"Model":"cccccccc","RegNum":"12345ASD","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1095, CAST(N'2026-06-13T13:23:30.357' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'19', N'Insert', N'{"Id":-2147482647,"Brand":"toyota","Fee":0,"FuelId":1,"ImgUrl":"","IsRentable":true,"Mileage":0,"Model":"rav4","RegNum":"AIJR391","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1096, CAST(N'2026-06-13T13:33:52.343' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'20', N'Insert', N'{"Id":-2147482646,"Brand":"tt","Fee":0,"FuelId":1,"ImgUrl":"https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781357631/RAV4TT.jpg","IsRentable":true,"Mileage":0,"Model":"tt","RegNum":"RAV4TT","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1097, CAST(N'2026-06-13T13:50:40.170' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'11', N'Delete', N'{"Id":11,"Brand":"Devil","Fee":666000,"FuelId":4,"ImgUrl":"","IsRentable":false,"Mileage":666000,"Model":"DIablo","RegNum":"OPS-666","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1098, CAST(N'2026-06-13T13:50:44.607' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'13', N'Delete', N'{"Id":13,"Brand":"toyota","Fee":39999,"FuelId":3,"ImgUrl":"","IsRentable":true,"Mileage":10,"Model":"rav4","RegNum":"AAAAAAA","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1099, CAST(N'2026-06-13T13:50:57.043' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'19', N'Delete', N'{"Id":19,"Brand":"toyota","Fee":0,"FuelId":1,"ImgUrl":"","IsRentable":true,"Mileage":0,"Model":"rav4","RegNum":"AIJR391","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1100, CAST(N'2026-06-13T13:51:09.513' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'18', N'Delete', N'{"Id":18,"Brand":"cccccccc","Fee":12,"FuelId":1,"ImgUrl":"","IsRentable":true,"Mileage":3,"Model":"cccccccc","RegNum":"12345ASD","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1101, CAST(N'2026-06-13T13:51:13.180' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'17', N'Delete', N'{"Id":17,"Brand":"vvvvvvvvvvv","Fee":2,"FuelId":1,"ImgUrl":"","IsRentable":true,"Mileage":3,"Model":"vvvvvvvvvvvv","RegNum":"VVV1234","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1102, CAST(N'2026-06-13T13:52:05.293' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'15', N'Delete', N'{"Id":15,"Brand":"vvvvvvvvvvv","Fee":2,"FuelId":1,"ImgUrl":"","IsRentable":true,"Mileage":3,"Model":"vvvvvvvvvvvv","RegNum":"VVVV1234","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1103, CAST(N'2026-06-13T13:52:11.260' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'20', N'Delete', N'{"Id":20,"Brand":"tt","Fee":0,"FuelId":1,"ImgUrl":"https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781357631/RAV4TT.jpg","IsRentable":true,"Mileage":0,"Model":"tt","RegNum":"RAV4TT","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1104, CAST(N'2026-06-13T13:52:22.457' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'4', N'Delete', N'{"Id":4,"Brand":"Toyota","Fee":12000,"FuelId":1,"ImgUrl":"https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781357723/ABC-001_gtvniy.jpg","IsRentable":true,"Mileage":52001,"Model":"Corolla","RegNum":"ABC-001","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1105, CAST(N'2026-06-13T13:52:27.800' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'11', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1106, CAST(N'2026-06-13T13:52:27.800' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'1', N'Update', N'{"StatusId":{"old":2,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1107, CAST(N'2026-06-13T22:20:26.707' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'21', N'Insert', N'{"Id":-2147482647,"Brand":"mercedes","Fee":50000,"FuelId":1,"ImgUrl":"https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781389226/ASDF123.jpg","IsRentable":true,"Mileage":0,"Model":"e-class","RegNum":"ASDF123","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1108, CAST(N'2026-06-13T22:50:39.067' AS DateTime), NULL, NULL, N'User', N'20', N'Insert', N'{"Id":-2147482647,"Address":"gdddddddd","DrivingLicence":"ffff","Email":"ggggggg@gmail.com","Name":"fg","Phone":"23455","RoleId":3}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1109, CAST(N'2026-06-13T22:50:39.137' AS DateTime), NULL, NULL, N'Rental', N'12', N'Insert', N'{"Id":-2147482647,"CarId":1,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-15T22:00:00Z","PlannedStart":"2026-06-14T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":15000,"UserId":20}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1110, CAST(N'2026-06-13T22:50:39.137' AS DateTime), NULL, NULL, N'Car', N'1', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1111, CAST(N'2026-06-13T23:06:52.810' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'6', N'Update', N'{"IsRentable":{"old":true,"new":false}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1112, CAST(N'2026-06-13T23:07:11.797' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'6', N'Update', N'{"IsRentable":{"old":false,"new":true}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1113, CAST(N'2026-06-13T23:10:14.247' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'7', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1114, CAST(N'2026-06-13T23:14:11.893' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'13', N'Insert', N'{"Id":-2147482646,"CarId":5,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-14T23:14:09.449Z","PlannedStart":"2026-06-13T23:14:09.449Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":15000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1115, CAST(N'2026-06-13T23:14:11.893' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1116, CAST(N'2026-06-13T23:31:24.380' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'14', N'Insert', N'{"Id":-2147482647,"CarId":8,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-14T22:00:00Z","PlannedStart":"2026-06-14T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":10000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1117, CAST(N'2026-06-13T23:31:24.380' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'8', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1118, CAST(N'2026-06-13T23:32:19.840' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'13', N'Update', N'{"HandoverDate":{"old":null,"new":"2026-06-13T23:32:19.8329622Z"},"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1119, CAST(N'2026-06-13T23:32:19.840' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1120, CAST(N'2026-06-13T23:32:30.593' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'13', N'Update', N'{"ReturnDate":{"old":null,"new":"2026-06-13T23:32:30.5603724Z"},"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1121, CAST(N'2026-06-13T23:32:30.593' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1122, CAST(N'2026-06-13T23:32:44.587' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"StatusId":{"old":4,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1123, CAST(N'2026-06-13T23:35:14.627' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Receipt', N'9', N'Insert', N'{"Id":-2147482647,"Amount":15000,"CarBrand":"Volkswagen","CarModel":"Golf","CarRegNum":"ABC-002","DaysRented":1,"IssuedAt":"2026-06-13T23:35:14.5658653Z","RentalId":13,"UserAddress":"etruztuij","UserEmail":"komlosnikolett@gmail.com","UserId":19,"UserName":"bn"}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1124, CAST(N'2026-06-13T23:35:14.627' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'13', N'Update', N'{"ReturnMileage":{"old":null,"new":1230000},"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1125, CAST(N'2026-06-13T23:35:14.627' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"Mileage":{"old":666666,"new":1230000}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1126, CAST(N'2026-06-13T23:42:17.123' AS DateTime), 19, N'komlosnikolett@gmail.com', N'User', N'19', N'Update', N'{"Address":{"old":"etruztuij","new":"2097 Pilisborosjen\u0151 Szent Don\u00E1t utca 62"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1127, CAST(N'2026-06-14T00:10:23.460' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'9', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1128, CAST(N'2026-06-14T00:15:12.560' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'15', N'Insert', N'{"Id":-2147482646,"CarId":5,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-15T22:00:00Z","PlannedStart":"2026-06-14T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":15000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1129, CAST(N'2026-06-14T00:15:12.560' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1130, CAST(N'2026-06-14T00:41:15.170' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'16', N'Insert', N'{"Id":-2147482647,"CarId":6,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-15T22:00:00Z","PlannedStart":"2026-06-14T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":25000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1131, CAST(N'2026-06-14T00:41:15.170' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'6', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1132, CAST(N'2026-06-14T00:41:17.123' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'17', N'Insert', N'{"Id":-2147482646,"CarId":12,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-15T22:00:00Z","PlannedStart":"2026-06-14T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":40000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1133, CAST(N'2026-06-14T00:41:17.123' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'12', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1134, CAST(N'2026-06-14T00:41:35.173' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'12', N'Update', N'{"HandoverDate":{"old":null,"new":"2026-06-14T00:41:35.1617392Z"},"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1135, CAST(N'2026-06-14T00:41:35.173' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'1', N'Update', N'{"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1136, CAST(N'2026-06-14T00:46:59.190' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'15', N'Update', N'{"HandoverDate":{"old":null,"new":"2026-06-14T00:46:59.1739803Z"},"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1137, CAST(N'2026-06-14T00:46:59.190' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1138, CAST(N'2026-06-14T00:47:04.450' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'15', N'Update', N'{"ReturnDate":{"old":null,"new":"2026-06-14T00:47:04.4280738Z"},"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1139, CAST(N'2026-06-14T00:47:04.450' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1140, CAST(N'2026-06-14T01:10:29.373' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Receipt', N'10', N'Insert', N'{"Id":-2147482647,"Amount":15000,"CarBrand":"Volkswagen","CarModel":"Golf","CarRegNum":"ABC-002","DaysRented":1,"IssuedAt":"2026-06-14T01:10:29.098738Z","RentalId":15,"UserAddress":"2097 Pilisborosjen\u0151 Szent Don\u00E1t utca 62","UserEmail":"komlosnikolett@gmail.com","UserId":19,"UserName":"Budav\u00E1ri Nikolett"}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1141, CAST(N'2026-06-14T01:10:29.373' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'15', N'Update', N'{"ReturnMileage":{"old":null,"new":1230004},"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1142, CAST(N'2026-06-14T01:10:29.373' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"Mileage":{"old":1230000,"new":1230004},"StatusId":{"old":4,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1143, CAST(N'2026-06-16T21:49:39.353' AS DateTime), NULL, NULL, N'User', N'21', N'Insert', N'{"Id":-2147482647,"Address":"1034 Budapest B\u00E9csi \u00FAt 121","DrivingLicence":"012345678","Email":"admin@admin.com","Name":"Admin","Phone":"01234578","RoleId":3}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1144, CAST(N'2026-06-17T21:16:57.850' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'3', N'Update', N'{"IsRentable":{"old":false,"new":true}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1145, CAST(N'2026-06-18T20:52:06.670' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'17', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1146, CAST(N'2026-06-18T20:52:06.670' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'12', N'Update', N'{"StatusId":{"old":2,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1147, CAST(N'2026-06-18T20:56:02.913' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'18', N'Insert', N'{"Id":-2147482647,"CarId":5,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-19T22:00:00Z","PlannedStart":"2026-06-17T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":30000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1148, CAST(N'2026-06-18T20:56:02.913' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'5', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1149, CAST(N'2026-06-18T20:56:24.677' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'19', N'Insert', N'{"Id":-2147482646,"CarId":10,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-19T22:00:00Z","PlannedStart":"2026-06-18T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":8000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1150, CAST(N'2026-06-18T20:56:24.677' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'10', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1151, CAST(N'2026-06-18T21:03:10.533' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'20', N'Insert', N'{"Id":-2147482645,"CarId":12,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-19T22:00:00Z","PlannedStart":"2026-06-18T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":40000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1152, CAST(N'2026-06-18T21:03:10.533' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'12', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1153, CAST(N'2026-06-18T21:09:48.447' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'21', N'Insert', N'{"Id":-2147482647,"CarId":21,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-19T22:00:00Z","PlannedStart":"2026-06-18T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":50000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1154, CAST(N'2026-06-18T21:09:48.447' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'21', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1155, CAST(N'2026-06-18T21:12:29.837' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'22', N'Insert', N'{"Id":-2147482647,"CarId":6,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-07-29T22:00:00Z","PlannedStart":"2026-06-27T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":800000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1156, CAST(N'2026-06-18T21:12:48.533' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'22', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1157, CAST(N'2026-06-18T21:12:48.533' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'6', N'Update', N'{"StatusId":{"old":2,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1158, CAST(N'2026-06-18T21:12:58.303' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'23', N'Insert', N'{"Id":-2147482646,"CarId":6,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-29T22:00:00Z","PlannedStart":"2026-06-18T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":275000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1159, CAST(N'2026-06-18T21:12:58.303' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'6', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1160, CAST(N'2026-06-18T21:18:47.007' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'22', N'Insert', N'{"Id":-2147482647,"Brand":"bmw","Fee":40000,"FuelId":1,"ImgUrl":"https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781817526/ASD-123.webp","IsRentable":true,"Mileage":12000,"Model":"i5","RegNum":"ASD-123","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1161, CAST(N'2026-06-18T21:27:25.733' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'22', N'Delete', N'{"Id":22,"Brand":"bmw","Fee":40000,"FuelId":1,"ImgUrl":"https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781817526/ASD-123.webp","IsRentable":true,"Mileage":12000,"Model":"i5","RegNum":"ASD-123","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1162, CAST(N'2026-06-18T21:27:54.357' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'23', N'Insert', N'{"Id":-2147482647,"Brand":"bmw","Fee":40000,"FuelId":1,"ImgUrl":"https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781817526/ASD-123.webp","IsRentable":true,"Mileage":12345,"Model":"i5","RegNum":"ASD-123","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1163, CAST(N'2026-06-18T21:30:19.637' AS DateTime), 19, N'komlosnikolett@gmail.com', N'User', N'11', N'Update', N'{"Address":{"old":"abdul","new":"abdul1"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1164, CAST(N'2026-06-18T21:30:41.657' AS DateTime), 19, N'komlosnikolett@gmail.com', N'User', N'19', N'Update', N'{"Phone":{"old":"123456789","new":"1234567890"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1165, CAST(N'2026-06-18T21:30:55.710' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'3', N'Update', N'{"Fee":{"old":45000,"new":50000}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1166, CAST(N'2026-06-18T21:31:21.930' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'23', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1167, CAST(N'2026-06-18T21:31:21.930' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'6', N'Update', N'{"StatusId":{"old":2,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1168, CAST(N'2026-06-18T21:31:26.320' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'23', N'Update', N'{"PlannedEnd":{"old":"2026-06-29T22:00:00","new":"2026-06-29T20:00:00Z"},"PlannedStart":{"old":"2026-06-18T22:00:00","new":"2026-06-18T20:00:00Z"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1169, CAST(N'2026-06-18T21:31:50.707' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'24', N'Insert', N'{"Id":-2147482647,"CarId":23,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-19T22:00:00Z","PlannedStart":"2026-06-18T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":40000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1170, CAST(N'2026-06-18T21:31:50.707' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'23', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1171, CAST(N'2026-06-18T21:31:56.760' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'24', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1172, CAST(N'2026-06-18T21:31:56.760' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'23', N'Update', N'{"StatusId":{"old":2,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1173, CAST(N'2026-06-18T21:32:00.613' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'25', N'Insert', N'{"Id":-2147482646,"CarId":23,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-19T22:00:00Z","PlannedStart":"2026-06-18T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":40000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1174, CAST(N'2026-06-18T21:32:00.613' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'23', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1175, CAST(N'2026-06-18T21:33:01.070' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'25', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1176, CAST(N'2026-06-18T21:33:01.070' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'23', N'Update', N'{"StatusId":{"old":2,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1177, CAST(N'2026-06-18T21:45:26.630' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'19', N'Update', N'{"HandoverDate":{"old":null,"new":"2026-06-18T21:45:26.4851866Z"},"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1178, CAST(N'2026-06-18T21:45:26.630' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'10', N'Update', N'{"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1179, CAST(N'2026-06-18T21:45:30.273' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'19', N'Update', N'{"ReturnDate":{"old":null,"new":"2026-06-18T21:45:30.2477658Z"},"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1180, CAST(N'2026-06-18T21:45:30.273' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'10', N'Update', N'{"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1181, CAST(N'2026-06-18T21:45:43.587' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Receipt', N'11', N'Insert', N'{"Id":-2147482647,"Amount":8000,"CarBrand":"Opel","CarModel":"Astra G menci","CarRegNum":"KVL-015","DaysRented":1,"IssuedAt":"2026-06-18T21:45:43.5474584Z","RentalId":19,"UserAddress":"1111 Budapest, P\u00E9lda utca 12.","UserEmail":"komlosnikolett@gmail.com","UserId":19,"UserName":"Budav\u00E1ri Nikolett"}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1182, CAST(N'2026-06-18T21:45:43.587' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'19', N'Update', N'{"ReturnMileage":{"old":null,"new":500002},"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1183, CAST(N'2026-06-18T21:45:43.587' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'10', N'Update', N'{"Mileage":{"old":500000,"new":500002},"StatusId":{"old":4,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1184, CAST(N'2026-06-18T21:45:57.547' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'23', N'Update', N'{"IsDeleted":{"old":false,"new":true}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1185, CAST(N'2026-06-18T21:47:08.883' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'24', N'Insert', N'{"Id":-2147482647,"Brand":"bmw","Fee":40000,"FuelId":2,"ImgUrl":"https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781819228/ASD-234.webp","IsDeleted":false,"IsRentable":true,"Mileage":123,"Model":"i5","RegNum":"ASD-234","StatusId":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1186, CAST(N'2026-06-18T21:47:31.137' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'20', N'Update', N'{"HandoverDate":{"old":null,"new":"2026-06-18T21:47:31.1248587Z"},"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1187, CAST(N'2026-06-18T21:47:31.137' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'12', N'Update', N'{"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1188, CAST(N'2026-06-18T21:47:32.787' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'20', N'Update', N'{"ReturnDate":{"old":null,"new":"2026-06-18T21:47:32.7716257Z"},"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1189, CAST(N'2026-06-18T21:47:32.787' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'12', N'Update', N'{"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1190, CAST(N'2026-06-18T21:48:00.350' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'26', N'Insert', N'{"Id":-2147482647,"CarId":6,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-19T22:00:00Z","PlannedStart":"2026-06-18T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":25000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1191, CAST(N'2026-06-18T21:48:00.350' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'6', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1192, CAST(N'2026-06-18T21:49:47.553' AS DateTime), 19, N'komlosnikolett@gmail.com', N'User', N'22', N'Insert', N'{"Id":-2147482647,"Address":"Budapest Lehel utca 3","DrivingLicence":"12345678","Email":"ugyintezo@ugyintezo.com","Name":"\u00DCgyint\u00E9z\u0151","Phone":"012345678","RoleId":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1193, CAST(N'2026-06-18T21:50:09.367' AS DateTime), 22, N'ugyintezo@ugyintezo.com', N'Rental', N'27', N'Insert', N'{"Id":-2147482646,"CarId":24,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-19T22:00:00Z","PlannedStart":"2026-06-18T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":40000,"UserId":22}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1194, CAST(N'2026-06-18T21:50:09.367' AS DateTime), 22, N'ugyintezo@ugyintezo.com', N'Car', N'24', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1195, CAST(N'2026-06-18T21:50:42.217' AS DateTime), 22, N'ugyintezo@ugyintezo.com', N'Car', N'10', N'Update', N'{"Model":{"old":"Astra G menci","new":"Astra G"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1196, CAST(N'2026-06-18T21:52:37.583' AS DateTime), 22, N'ugyintezo@ugyintezo.com', N'Car', N'10', N'Update', N'{"Model":{"old":"Astra G","new":"Astra GG"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1197, CAST(N'2026-06-18T22:05:58.480' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'24', N'Update', N'{"Brand":{"old":"bmw","new":"BMW"}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1198, CAST(N'2026-06-18T22:06:06.397' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'10', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1199, CAST(N'2026-06-18T22:06:12.773' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'10', N'Update', N'{"StatusId":{"old":5,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1200, CAST(N'2026-06-18T22:06:34.240' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'24', N'Update', N'{"IsDeleted":{"old":false,"new":true}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1201, CAST(N'2026-06-18T22:39:01.193' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'28', N'Insert', N'{"Id":-2147482647,"CarId":21,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-20T22:00:00Z","PlannedStart":"2026-06-19T22:00:00Z","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":50000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1202, CAST(N'2026-06-18T22:42:33.913' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'29', N'Insert', N'{"Id":-2147482646,"CarId":3,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-21T00:00:00","PlannedStart":"2026-06-20T00:00:00","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":50000,"UserId":19}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1203, CAST(N'2026-06-18T22:43:49.430' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'29', N'Update', N'{"StatusId":{"old":1,"new":5}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1204, CAST(N'2026-06-18T22:43:49.430' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'3', N'Update', N'{"StatusId":{"old":3,"new":1}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1205, CAST(N'2026-06-18T22:45:10.267' AS DateTime), NULL, NULL, N'User', N'23', N'Insert', N'{"Id":-2147482647,"Address":"34e56zughjn hjtrjk","DrivingLicence":"wertzu","Email":"vendeg@vendeg.de","Name":"Vendeg","Phone":"123456","RoleId":3}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1206, CAST(N'2026-06-18T22:45:10.310' AS DateTime), NULL, NULL, N'Rental', N'30', N'Insert', N'{"Id":-2147482645,"CarId":10,"Condition":null,"HandoverDate":null,"PlannedEnd":"2026-06-19T00:00:00","PlannedStart":"2026-06-19T00:00:00","RequestDate":null,"ReturnDate":null,"ReturnMileage":null,"StatusId":1,"TotalCost":8000,"UserId":23}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1207, CAST(N'2026-06-18T22:45:10.310' AS DateTime), NULL, NULL, N'Car', N'10', N'Update', N'{"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1208, CAST(N'2026-06-18T22:45:39.780' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'30', N'Update', N'{"HandoverDate":{"old":null,"new":"2026-06-18T22:45:39.7618757Z"},"StatusId":{"old":1,"new":2}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1209, CAST(N'2026-06-18T22:45:39.780' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'10', N'Update', N'{"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1210, CAST(N'2026-06-18T22:45:51.297' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Rental', N'30', N'Update', N'{"ReturnDate":{"old":null,"new":"2026-06-18T22:45:51.2802775Z"},"StatusId":{"old":2,"new":3}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1211, CAST(N'2026-06-18T22:45:51.297' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'10', N'Update', N'{"StatusId":{"old":3,"new":4}}')
GO
INSERT [dbo].[AuditLogs] ([Id], [Timestamp], [UserId], [UserEmail], [EntityType], [EntityId], [Action], [Changes]) VALUES (1212, CAST(N'2026-06-18T22:53:51.643' AS DateTime), 19, N'komlosnikolett@gmail.com', N'Car', N'25', N'Insert', N'{"Id":-2147482647,"Brand":"bmw","Fee":60000,"FuelId":1,"ImgUrl":"https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781823231/ASDF-123.webp","IsDeleted":false,"IsRentable":true,"Mileage":23400,"Model":"i5","RegNum":"ASDF-123","StatusId":1}')
GO
SET IDENTITY_INSERT [dbo].[AuditLogs] OFF
GO
SET IDENTITY_INSERT [dbo].[Cars] ON 
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (1, N'ABC-123', N'Toyota', N'Corolla', 88888888, 1, 15000, 1, 3, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781357722/ABC-123_ewtjkd.webp', 0)
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (2, N'XYZ-987', N'Skoda', N'Octavia', 120500, 1, 18500, 2, 2, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781731230/xyz987_amerlm.jpg', 0)
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (3, N'PRO-001', N'Mercedes', N'E-Class', 15000, 1, 50000, 1, 1, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781731852/edf_clfjmd.webp', 0)
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (5, N'ABC-002', N'Volkswagen', N'Golf', 1230004, 1, 15000, 2, 2, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781357723/ABC-002_reslgc.jpg', 0)
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (6, N'ABC-003', N'Tesla', N'Model 3', 18500, 1, 25000, 4, 2, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781357723/ABC-003_ibvl8h.jpg', 0)
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (7, N'ABC-004', N'Honda', N'Civic Hybrid', 32000, 1, 18000, 3, 5, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781357722/ABC-004_dt1lg5.avif', 0)
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (8, N'ABC-005', N'Ford', N'Focus', 105000, 1, 10000, 1, 2, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781357722/ABC-005_umdr0l.jpg', 0)
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (9, N'ABC-006', N'BMW', N'320d', 80000, 1, 22000, 2, 5, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781357724/ABC-006_ba5gmc.jpg', 0)
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (10, N'KVL-015', N'Opel', N'Astra GG', 500002, 1, 8000, 1, 4, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781357723/KVL-015_sqxezc.jpg', 0)
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (12, N'NORB-101', N'BMW', N'M33', 1500, 1, 40000, 1, 4, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781357723/NORB-101_omo2oa.jpg', 0)
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (21, N'ASDF123', N'mercedes', N'e-class', 0, 1, 50000, 1, 2, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781389226/ASDF123.jpg', 0)
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (23, N'ASD-123', N'bmw', N'i5', 12345, 1, 40000, 1, 1, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781817526/ASD-123.webp', 1)
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (24, N'ASD-234', N'BMW', N'i5', 123, 1, 40000, 2, 2, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781819228/ASD-234.webp', 1)
GO
INSERT [dbo].[Cars] ([Id], [RegNum], [Brand], [Model], [Mileage], [IsRentable], [Fee], [FuelId], [StatusId], [ImgUrl], [IsDeleted]) VALUES (25, N'ASDF-123', N'bmw', N'i5', 23400, 1, 60000, 1, 1, N'https://res.cloudinary.com/dtk9xrtrq/image/upload/v1781823231/ASDF-123.webp', 0)
GO
SET IDENTITY_INSERT [dbo].[Cars] OFF
GO
INSERT [dbo].[CarStatus] ([Id], [Name]) VALUES (1, N'Available')
GO
INSERT [dbo].[CarStatus] ([Id], [Name]) VALUES (2, N'Rent')
GO
INSERT [dbo].[CarStatus] ([Id], [Name]) VALUES (3, N'Out of order')
GO
INSERT [dbo].[CarStatus] ([Id], [Name]) VALUES (4, N'AwaitingInspection')
GO
INSERT [dbo].[CarStatus] ([Id], [Name]) VALUES (5, N'Maintenance')
GO
INSERT [dbo].[Fuel] ([Id], [Name]) VALUES (1, N'Petrol')
GO
INSERT [dbo].[Fuel] ([Id], [Name]) VALUES (2, N'Diesel')
GO
INSERT [dbo].[Fuel] ([Id], [Name]) VALUES (3, N'Hybrid')
GO
INSERT [dbo].[Fuel] ([Id], [Name]) VALUES (4, N'Electric')
GO
SET IDENTITY_INSERT [dbo].[Receipts] ON 
GO
INSERT [dbo].[Receipts] ([Id], [RentalId], [UserId], [IssuedAt], [Amount], [DaysRented], [CarRegNum], [CarBrand], [CarModel], [UserName], [UserEmail], [UserAddress]) VALUES (1, 6, 14, CAST(N'2026-05-15T17:10:08.007' AS DateTime), 15000, 1, N'ABC-002', N'Volkswagen', N'Golf', N'Test Admin', N'user@user.com', N'1051 Budapest, Teszt utca 1.')
GO
INSERT [dbo].[Receipts] ([Id], [RentalId], [UserId], [IssuedAt], [Amount], [DaysRented], [CarRegNum], [CarBrand], [CarModel], [UserName], [UserEmail], [UserAddress]) VALUES (2, 2, 12, CAST(N'2026-05-13T16:51:07.210' AS DateTime), 15000, 1, N'ABC-123', N'Toyota', N'Corolla', N'asd', N'asd@asd.com', N'asdad')
GO
INSERT [dbo].[Receipts] ([Id], [RentalId], [UserId], [IssuedAt], [Amount], [DaysRented], [CarRegNum], [CarBrand], [CarModel], [UserName], [UserEmail], [UserAddress]) VALUES (3, 4, 12, CAST(N'2026-05-13T20:53:23.723' AS DateTime), 1600000, 2, N'KVL-015', N'Opel', N'Astra G', N'asd', N'asd@asd.com', N'asdad')
GO
INSERT [dbo].[Receipts] ([Id], [RentalId], [UserId], [IssuedAt], [Amount], [DaysRented], [CarRegNum], [CarBrand], [CarModel], [UserName], [UserEmail], [UserAddress]) VALUES (4, 5, 12, CAST(N'2026-05-15T14:45:14.017' AS DateTime), 15000, 1, N'ABC-123', N'Toyota', N'Corolla', N'asd', N'asd@asd.com', N'asdad')
GO
INSERT [dbo].[Receipts] ([Id], [RentalId], [UserId], [IssuedAt], [Amount], [DaysRented], [CarRegNum], [CarBrand], [CarModel], [UserName], [UserEmail], [UserAddress]) VALUES (5, 7, 12, CAST(N'2026-06-07T11:47:12.007' AS DateTime), 1500, 1, N'ABC-123', N'Toyota', N'Corolla', N'asd', N'asd@asd.com', N'asdad')
GO
INSERT [dbo].[Receipts] ([Id], [RentalId], [UserId], [IssuedAt], [Amount], [DaysRented], [CarRegNum], [CarBrand], [CarModel], [UserName], [UserEmail], [UserAddress]) VALUES (6, 8, 15, CAST(N'2026-06-07T12:17:51.660' AS DateTime), 22000, 1, N'ABC-006', N'BMW', N'320d', N'Norbi', N'norbi@norbi.com', N'Várus utca házszám.')
GO
INSERT [dbo].[Receipts] ([Id], [RentalId], [UserId], [IssuedAt], [Amount], [DaysRented], [CarRegNum], [CarBrand], [CarModel], [UserName], [UserEmail], [UserAddress]) VALUES (7, 9, 17, CAST(N'2026-06-07T13:18:56.223' AS DateTime), 18000, 1, N'ABC-004', N'Honda', N'Civic Hybrid', N'Valami Akármi', N'asdasd@asdasd.com', N'3903, Bekecs, Túzoltó út, 28')
GO
INSERT [dbo].[Receipts] ([Id], [RentalId], [UserId], [IssuedAt], [Amount], [DaysRented], [CarRegNum], [CarBrand], [CarModel], [UserName], [UserEmail], [UserAddress]) VALUES (8, 10, 18, CAST(N'2026-06-07T13:21:20.300' AS DateTime), 25000, 1, N'ABC-003', N'Tesla', N'Model 3', N'Vendég Vendég', N'vendeg@vendeg.com', N'3333, Balaton, Vendég 12')
GO
INSERT [dbo].[Receipts] ([Id], [RentalId], [UserId], [IssuedAt], [Amount], [DaysRented], [CarRegNum], [CarBrand], [CarModel], [UserName], [UserEmail], [UserAddress]) VALUES (9, 13, 19, CAST(N'2026-06-13T23:35:14.567' AS DateTime), 15000, 1, N'ABC-002', N'Volkswagen', N'Golf', N'Budavári Nikolett', N'komlosnikolett@gmail.com', N'etruztuij')
GO
INSERT [dbo].[Receipts] ([Id], [RentalId], [UserId], [IssuedAt], [Amount], [DaysRented], [CarRegNum], [CarBrand], [CarModel], [UserName], [UserEmail], [UserAddress]) VALUES (10, 15, 19, CAST(N'2026-06-14T01:10:29.100' AS DateTime), 15000, 1, N'ABC-002', N'Volkswagen', N'Golf', N'Budavári Nikolett', N'komlosnikolett@gmail.com', N'2097 Pilisborosjenõ Szent Donát utca 62')
GO
INSERT [dbo].[Receipts] ([Id], [RentalId], [UserId], [IssuedAt], [Amount], [DaysRented], [CarRegNum], [CarBrand], [CarModel], [UserName], [UserEmail], [UserAddress]) VALUES (11, 19, 19, CAST(N'2026-06-18T21:45:43.547' AS DateTime), 8000, 1, N'KVL-015', N'Opel', N'Astra G menci', N'Budavári Nikolett', N'komlosnikolett@gmail.com', N'1111 Budapest, Példa utca 12.')
GO
SET IDENTITY_INSERT [dbo].[Receipts] OFF
GO
SET IDENTITY_INSERT [dbo].[Rentals] ON 
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (1, 1, 12, 5, CAST(N'2026-05-13T18:42:17.770' AS DateTime), NULL, NULL, 15000, CAST(N'2026-05-12T00:00:00.000' AS DateTime), CAST(N'2026-05-13T00:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (2, 1, 12, 4, CAST(N'2026-05-13T18:42:32.183' AS DateTime), CAST(N'2026-05-13T16:48:33.757' AS DateTime), CAST(N'2026-05-13T16:51:07.210' AS DateTime), 15000, CAST(N'2026-05-11T00:00:00.000' AS DateTime), CAST(N'2026-05-12T00:00:00.000' AS DateTime), N'Rendben', 250000)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (3, 1, 12, 5, CAST(N'2026-05-13T18:53:10.893' AS DateTime), NULL, NULL, 75000, CAST(N'2026-05-15T00:00:00.000' AS DateTime), CAST(N'2026-05-20T00:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (4, 10, 12, 4, CAST(N'2026-05-13T22:52:04.463' AS DateTime), CAST(N'2026-05-13T20:53:06.363' AS DateTime), CAST(N'2026-05-13T20:53:23.723' AS DateTime), 1600000, CAST(N'2026-05-11T00:00:00.000' AS DateTime), CAST(N'2026-05-13T00:00:00.000' AS DateTime), N'Frankó', 500000)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (5, 1, 12, 4, CAST(N'2026-05-15T16:44:15.020' AS DateTime), CAST(N'2026-05-15T14:44:41.490' AS DateTime), CAST(N'2026-05-15T14:45:14.017' AS DateTime), 15000, CAST(N'2026-05-12T00:00:00.000' AS DateTime), CAST(N'2026-05-13T00:00:00.000' AS DateTime), N'asdfghjklé', 88888888)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (6, 5, 14, 4, CAST(N'2026-05-15T19:09:47.180' AS DateTime), CAST(N'2026-05-15T17:09:50.757' AS DateTime), CAST(N'2026-05-15T17:09:56.753' AS DateTime), 15000, CAST(N'2026-05-15T00:00:00.000' AS DateTime), CAST(N'2026-05-16T00:00:00.000' AS DateTime), NULL, 666666)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (7, 1, 12, 4, CAST(N'2026-06-07T13:44:12.677' AS DateTime), CAST(N'2026-06-07T11:45:32.120' AS DateTime), CAST(N'2026-06-07T11:45:59.900' AS DateTime), 1500, CAST(N'2026-06-06T00:00:00.000' AS DateTime), CAST(N'2026-06-07T00:00:00.000' AS DateTime), N'Szuper', NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (8, 9, 15, 4, CAST(N'2026-06-07T14:14:03.573' AS DateTime), CAST(N'2026-06-07T12:17:14.533' AS DateTime), CAST(N'2026-06-07T12:17:23.763' AS DateTime), 22000, CAST(N'2026-06-07T00:00:00.000' AS DateTime), CAST(N'2026-06-08T00:00:00.000' AS DateTime), NULL, 80000)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (9, 7, 17, 4, CAST(N'2026-06-07T15:17:53.623' AS DateTime), CAST(N'2026-06-07T13:18:22.730' AS DateTime), CAST(N'2026-06-07T13:18:45.567' AS DateTime), 18000, CAST(N'2026-06-07T00:00:00.000' AS DateTime), CAST(N'2026-06-08T00:00:00.000' AS DateTime), N'minden jó', NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (10, 6, 18, 4, CAST(N'2026-06-07T15:20:59.410' AS DateTime), CAST(N'2026-06-07T13:21:03.837' AS DateTime), CAST(N'2026-06-07T13:21:09.640' AS DateTime), 25000, CAST(N'2026-06-07T00:00:00.000' AS DateTime), CAST(N'2026-06-08T00:00:00.000' AS DateTime), N'fasza', NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (11, 1, 19, 5, CAST(N'2026-06-08T21:53:40.403' AS DateTime), NULL, NULL, 15000, CAST(N'2026-06-08T00:00:00.000' AS DateTime), CAST(N'2026-06-09T00:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (12, 1, 20, 2, CAST(N'2026-06-14T00:50:39.123' AS DateTime), CAST(N'2026-06-14T00:41:35.163' AS DateTime), NULL, 15000, CAST(N'2026-06-14T22:00:00.000' AS DateTime), CAST(N'2026-06-15T22:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (13, 5, 19, 4, CAST(N'2026-06-14T01:14:11.883' AS DateTime), CAST(N'2026-06-13T23:32:19.833' AS DateTime), CAST(N'2026-06-13T23:32:30.560' AS DateTime), 15000, CAST(N'2026-06-13T23:14:09.450' AS DateTime), CAST(N'2026-06-14T23:14:09.450' AS DateTime), NULL, 1230000)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (14, 8, 19, 1, CAST(N'2026-06-14T01:31:24.320' AS DateTime), NULL, NULL, 10000, CAST(N'2026-06-14T22:00:00.000' AS DateTime), CAST(N'2026-06-14T22:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (15, 5, 19, 4, CAST(N'2026-06-14T02:15:12.550' AS DateTime), CAST(N'2026-06-14T00:46:59.173' AS DateTime), CAST(N'2026-06-14T00:47:04.427' AS DateTime), 15000, CAST(N'2026-06-14T22:00:00.000' AS DateTime), CAST(N'2026-06-15T22:00:00.000' AS DateTime), NULL, 1230004)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (16, 6, 19, 1, CAST(N'2026-06-14T02:41:15.127' AS DateTime), NULL, NULL, 25000, CAST(N'2026-06-14T22:00:00.000' AS DateTime), CAST(N'2026-06-15T22:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (17, 12, 19, 5, CAST(N'2026-06-14T02:41:17.117' AS DateTime), NULL, NULL, 40000, CAST(N'2026-06-14T22:00:00.000' AS DateTime), CAST(N'2026-06-15T22:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (18, 5, 19, 1, CAST(N'2026-06-18T22:56:02.900' AS DateTime), NULL, NULL, 30000, CAST(N'2026-06-17T22:00:00.000' AS DateTime), CAST(N'2026-06-19T22:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (19, 10, 19, 4, CAST(N'2026-06-18T22:56:24.670' AS DateTime), CAST(N'2026-06-18T21:45:26.487' AS DateTime), CAST(N'2026-06-18T21:45:30.247' AS DateTime), 8000, CAST(N'2026-06-18T22:00:00.000' AS DateTime), CAST(N'2026-06-19T22:00:00.000' AS DateTime), NULL, 500002)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (20, 12, 19, 3, CAST(N'2026-06-18T23:03:10.523' AS DateTime), CAST(N'2026-06-18T21:47:31.123' AS DateTime), CAST(N'2026-06-18T21:47:32.770' AS DateTime), 40000, CAST(N'2026-06-18T22:00:00.000' AS DateTime), CAST(N'2026-06-19T22:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (21, 21, 19, 1, CAST(N'2026-06-18T23:09:48.410' AS DateTime), NULL, NULL, 50000, CAST(N'2026-06-18T22:00:00.000' AS DateTime), CAST(N'2026-06-19T22:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (22, 6, 19, 5, CAST(N'2026-06-18T23:12:29.810' AS DateTime), NULL, NULL, 800000, CAST(N'2026-06-27T22:00:00.000' AS DateTime), CAST(N'2026-07-29T22:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (23, 6, 19, 5, CAST(N'2026-06-18T23:12:58.297' AS DateTime), NULL, NULL, 275000, CAST(N'2026-06-18T20:00:00.000' AS DateTime), CAST(N'2026-06-29T20:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (24, 23, 19, 5, CAST(N'2026-06-18T23:31:50.697' AS DateTime), NULL, NULL, 40000, CAST(N'2026-06-18T22:00:00.000' AS DateTime), CAST(N'2026-06-19T22:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (25, 23, 19, 5, CAST(N'2026-06-18T23:32:00.607' AS DateTime), NULL, NULL, 40000, CAST(N'2026-06-18T22:00:00.000' AS DateTime), CAST(N'2026-06-19T22:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (26, 6, 19, 1, CAST(N'2026-06-18T23:48:00.340' AS DateTime), NULL, NULL, 25000, CAST(N'2026-06-18T22:00:00.000' AS DateTime), CAST(N'2026-06-19T22:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (27, 24, 22, 1, CAST(N'2026-06-18T23:50:09.360' AS DateTime), NULL, NULL, 40000, CAST(N'2026-06-18T22:00:00.000' AS DateTime), CAST(N'2026-06-19T22:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (28, 21, 19, 1, CAST(N'2026-06-19T00:39:01.153' AS DateTime), NULL, NULL, 50000, CAST(N'2026-06-19T22:00:00.000' AS DateTime), CAST(N'2026-06-20T22:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (29, 3, 19, 5, CAST(N'2026-06-19T00:42:33.907' AS DateTime), NULL, NULL, 50000, CAST(N'2026-06-20T00:00:00.000' AS DateTime), CAST(N'2026-06-21T00:00:00.000' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[Rentals] ([Id], [CarId], [UserId], [StatusId], [RequestDate], [HandoverDate], [ReturnDate], [TotalCost], [PlannedStart], [PlannedEnd], [Condition], [ReturnMileage]) VALUES (30, 10, 23, 3, CAST(N'2026-06-19T00:45:10.307' AS DateTime), CAST(N'2026-06-18T22:45:39.763' AS DateTime), CAST(N'2026-06-18T22:45:51.280' AS DateTime), 8000, CAST(N'2026-06-19T00:00:00.000' AS DateTime), CAST(N'2026-06-19T00:00:00.000' AS DateTime), NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[Rentals] OFF
GO
INSERT [dbo].[RentalStatus] ([Id], [StatusName]) VALUES (1, N'Requested')
GO
INSERT [dbo].[RentalStatus] ([Id], [StatusName]) VALUES (2, N'Approved')
GO
INSERT [dbo].[RentalStatus] ([Id], [StatusName]) VALUES (3, N'HandedOver')
GO
INSERT [dbo].[RentalStatus] ([Id], [StatusName]) VALUES (4, N'Returned')
GO
INSERT [dbo].[RentalStatus] ([Id], [StatusName]) VALUES (5, N'Cancelled')
GO
INSERT [dbo].[Roles] ([Id], [Name]) VALUES (1, N'Admin')
GO
INSERT [dbo].[Roles] ([Id], [Name]) VALUES (2, N'Officer')
GO
INSERT [dbo].[Roles] ([Id], [Name]) VALUES (3, N'Client')
GO
SET IDENTITY_INSERT [dbo].[Users] ON 
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (1, 1, N'Nagy Ádám', N'admin@berauto.hu', N'+3610111222', N'1011 Budapest, Fõ utca 1.', N'AA112233', N'')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (2, 1, N'Szabó Viktor', N'viktor.admin@berauto.hu', N'+36105556677', N'1054 Budapest, Alkotmány u. 2.', N'AA998877', N'')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (3, 2, N'Kiss Éva', N'eva.officer@berauto.hu', N'+36202223344', N'2000 Szentendre, Duna korzó 5.', N'BB445566', N'')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (4, 2, N'Molnár Beatrix', N'bea.officer@berauto.hu', N'+36208889900', N'8000 Székesfehérvár, Várkörút 10.', N'BB112233', N'')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (5, 2, N'Hajdú Gábor', N'gabor.officer@berauto.hu', N'+36203334455', N'9022 Gyõr, Dunakapu tér 1.', N'BB334455', N'')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (6, 3, N'Tóth János', N'janos85@gmail.com', N'+36309998877', N'6720 Szeged, Tisza Lajos krt. 12.', N'CC778899', N'')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (7, 3, N'Kovács Petra', N'petra.k@freemail.hu', N'+36705554433', N'4024 Debrecen, Piac utca 3.', N'DD001122', N'')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (8, 3, N'Varga Balázs', N'balazs.varga@gmail.com', N'+36301112233', N'7621 Pécs, Király utca 4.', N'CC112233', N'')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (9, 3, N'Németh Eszter', N'eszti.nemeth@freemail.hu', N'+36304445566', N'6000 Kecskemét, Szabadság tér 2.', N'CC445566', N'')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (10, 3, N'Fekete Marcell', N'marcell.f@outlook.com', N'+36701110011', N'3525 Miskolc, Széchenyi u. 15.', N'CC990011', N'')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (11, 3, N'Abdul', N'abdul@abdul.com', N'123456', N'abdul1', N'abdul123', N'AQAAAAIAAYagAAAAEOogmZ7tTKF9ZF2fKsjX7rmrtq/s4xbgi9WWgUp48xwJtEJ48J5A8Dk6lWDq1sevpQ==')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (12, 3, N'asd', N'asd@asd.com', N'7418522', N'asdad', N'asd741', N'AQAAAAIAAYagAAAAEGY+HkmMCSw3J22b8cDZqq4HR+8IUMuSfi28diC3iPD48aLe/oDk0AqvqysVAnYCEA==')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (13, 2, N'Laci', N'laci@laci.hu', N'123456', N'LAci', N'LA123456', N'AQAAAAIAAYagAAAAEFiiaZYM64e6ucy/LckuXfaRnqHnN5vyPQQrWlcGzlVZDZyPd0VH8uDv8QGsH08Rkg==')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (14, 1, N'Test Admin', N'user@user.com', N'+36 30 000 0000', N'1051 Budapest, Teszt utca 1.', N'AB123456', N'AQAAAAIAAYagAAAAEAobLD1OX2BxgpOktcbX6PlzJ1/IVlJf+Uaai4T9/pfPUJikiSH1yOaH2ZHrb5A9HQ==')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (15, 3, N'Norbi', N'norbi@norbi.com', N'+3690111112', N'Várus utca házszám.', N'456789BA', N'AQAAAAIAAYagAAAAEJbkW2vDjC+eS/s200EDPrAULp98YguBp7NZhkrjsDquxk5zLMsFXY+5JoJ5cDuNJw==')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (17, 3, N'Valami Akármi', N'asdasd@asdasd.com', N'+36303332699', N'3903, Bekecs, Túzoltó út, 28', N'123456789', NULL)
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (18, 3, N'Vendég Vendég', N'vendeg@vendeg.com', N'+363333333', N'3333, Balaton, Vendég 12', N'123123', NULL)
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (19, 1, N'Budavári Nikolett', N'komlosnikolett@gmail.com', N'1234567890', N'1111 Budapest, Példa utca 12.', N'674557687', N'AQAAAAIAAYagAAAAECRghthzsh95zFAZ+T3SUKGUneFUrs4cPEINM4J2uIKxns15OpunnZ7uYOhfjq/60w==')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (20, 3, N'fg', N'ggggggg@gmail.com', N'23455', N'gdddddddd', N'ffff', NULL)
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (21, 1, N'Admin', N'admin@admin.com', N'01234578', N'1034 Budapest Bécsi út 121', N'012345678', N'AQAAAAIAAYagAAAAEFlRznXMi30DyjA4c9guvjJULV3roMg5Q3Ddh/PpaIfk2692R75ftxlcOW3AJYQyOQ==')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (22, 2, N'Ügyintézõ', N'ugyintezo@ugyintezo.com', N'012345678', N'Budapest Lehel utca 3', N'12345678', N'AQAAAAIAAYagAAAAEJ3DEgMMQCHFqXEOmF6uHrf0+/Yw5ZECpYxD0Bs+ge7UGn9lIVA3v/LFGD02y9ORmg==')
GO
INSERT [dbo].[Users] ([Id], [RoleId], [Name], [Email], [Phone], [Address], [DrivingLicence], [PasswordHash]) VALUES (23, 3, N'Vendeg', N'vendeg@vendeg.de', N'123456', N'34e56zughjn hjtrjk', N'wertzu', NULL)
GO
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AuditLogs_EntityType_EntityId]    Script Date: 2026. 06. 19. 0:57:10 ******/
CREATE NONCLUSTERED INDEX [IX_AuditLogs_EntityType_EntityId] ON [dbo].[AuditLogs]
(
	[EntityType] ASC,
	[EntityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_AuditLogs_Timestamp]    Script Date: 2026. 06. 19. 0:57:10 ******/
CREATE NONCLUSTERED INDEX [IX_AuditLogs_Timestamp] ON [dbo].[AuditLogs]
(
	[Timestamp] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Cars__34C6A0A61F5D9FFD]    Script Date: 2026. 06. 19. 0:57:10 ******/
ALTER TABLE [dbo].[Cars] ADD UNIQUE NONCLUSTERED 
(
	[RegNum] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Receipts_UserId]    Script Date: 2026. 06. 19. 0:57:10 ******/
CREATE NONCLUSTERED INDEX [IX_Receipts_UserId] ON [dbo].[Receipts]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_Receipts_RentalId]    Script Date: 2026. 06. 19. 0:57:10 ******/
CREATE UNIQUE NONCLUSTERED INDEX [UQ_Receipts_RentalId] ON [dbo].[Receipts]
(
	[RentalId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__A9D105345D4730BD]    Script Date: 2026. 06. 19. 0:57:10 ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Cars] ADD  DEFAULT ((0)) FOR [Mileage]
GO
ALTER TABLE [dbo].[Cars] ADD  DEFAULT ((1)) FOR [IsRentable]
GO
ALTER TABLE [dbo].[Cars] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Rentals] ADD  DEFAULT (getdate()) FOR [RequestDate]
GO
ALTER TABLE [dbo].[Rentals] ADD  CONSTRAINT [DF_Rentals_PlannedStart]  DEFAULT ('1900-01-01') FOR [PlannedStart]
GO
ALTER TABLE [dbo].[Rentals] ADD  CONSTRAINT [DF_Rentals_PlannedEnd]  DEFAULT ('1900-01-01') FOR [PlannedEnd]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_PasswordHash]  DEFAULT ('') FOR [PasswordHash]
GO
ALTER TABLE [dbo].[Cars]  WITH CHECK ADD  CONSTRAINT [FK_Cars_CarStatus] FOREIGN KEY([StatusId])
REFERENCES [dbo].[CarStatus] ([Id])
GO
ALTER TABLE [dbo].[Cars] CHECK CONSTRAINT [FK_Cars_CarStatus]
GO
ALTER TABLE [dbo].[Cars]  WITH CHECK ADD  CONSTRAINT [FK_Cars_Fuel] FOREIGN KEY([FuelId])
REFERENCES [dbo].[Fuel] ([Id])
GO
ALTER TABLE [dbo].[Cars] CHECK CONSTRAINT [FK_Cars_Fuel]
GO
ALTER TABLE [dbo].[Rentals]  WITH CHECK ADD  CONSTRAINT [FK_Rentals_Cars] FOREIGN KEY([CarId])
REFERENCES [dbo].[Cars] ([Id])
GO
ALTER TABLE [dbo].[Rentals] CHECK CONSTRAINT [FK_Rentals_Cars]
GO
ALTER TABLE [dbo].[Rentals]  WITH CHECK ADD  CONSTRAINT [FK_Rentals_Status] FOREIGN KEY([StatusId])
REFERENCES [dbo].[RentalStatus] ([Id])
GO
ALTER TABLE [dbo].[Rentals] CHECK CONSTRAINT [FK_Rentals_Status]
GO
ALTER TABLE [dbo].[Rentals]  WITH CHECK ADD  CONSTRAINT [FK_Rentals_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Rentals] CHECK CONSTRAINT [FK_Rentals_Users]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Roles] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([Id])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Roles]
GO
USE [master]
GO
ALTER DATABASE [CarRentalDb] SET  READ_WRITE 
GO
