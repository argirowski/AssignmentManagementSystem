-- Create the database (change the name if needed)
CREATE DATABASE [AssignmentManagement];
GO

USE [AssignmentManagement];
GO

-- Categories table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categories' AND xtype='U')
BEGIN
    CREATE TABLE Categories (
        Id UNIQUEIDENTIFIER PRIMARY KEY,
        Name NVARCHAR(255) NOT NULL
    );
END
GO

-- Statuses table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Statuses' AND xtype='U')
BEGIN
    CREATE TABLE Statuses (
        Id UNIQUEIDENTIFIER PRIMARY KEY,
        Description NVARCHAR(255) NOT NULL
    );
END
GO

-- Employees table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Employees' AND xtype='U')
BEGIN
    CREATE TABLE Employees (
        Id UNIQUEIDENTIFIER PRIMARY KEY,
        FullName NVARCHAR(255) NOT NULL,
        Email NVARCHAR(255) NOT NULL,
        DateJoined DATETIME NOT NULL
    );
END
GO

-- Assignments table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Assignments' AND xtype='U')
BEGIN
    CREATE TABLE Assignments (
        Id UNIQUEIDENTIFIER PRIMARY KEY,
        Title NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        IsCompleted BIT NOT NULL,
        CreatedAt DATETIME NOT NULL,
        EmployeeId UNIQUEIDENTIFIER NOT NULL,
        StatusId UNIQUEIDENTIFIER NOT NULL,
        FOREIGN KEY (EmployeeId) REFERENCES Employees(Id),
        FOREIGN KEY (StatusId) REFERENCES Statuses(Id)
    );
END
GO

-- AssignmentCategories table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AssignmentCategories' AND xtype='U')
BEGIN
    CREATE TABLE AssignmentCategories (
        AssignmentId UNIQUEIDENTIFIER NOT NULL,
        CategoryId UNIQUEIDENTIFIER NOT NULL,
        PRIMARY KEY (AssignmentId, CategoryId),
        FOREIGN KEY (AssignmentId) REFERENCES Assignments(Id),
        FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
    );
END
GO