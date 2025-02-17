# StudyNotionApp Database Documentation

## Introduction
This documentation provides details about the `StudyNotionApp` database schema and how to execute the SQL queries in MySQL. The database is designed for a learning platform with features such as user management, courses, ratings, and progress tracking.

---

## Prerequisites
To execute the SQL queries, ensure the following:
- MySQL is installed and running on your system.
- You have access to a MySQL client or interface (e.g., MySQL Workbench, phpMyAdmin, or CLI).

---

## Steps to Execute Queries in MySQL

1. **Start MySQL Service**
   - Open your terminal or MySQL client.
   - Log in to MySQL using your credentials:
     ```bash
     mysql -u <username> -p
     ```
     Enter your password when prompted.

2. **Create and Use the Database**
   ```sql
   CREATE DATABASE IF NOT EXISTS StudyNotionApp;
   USE StudyNotionApp;
   ```

3. **Create Tables**
   Copy and paste the SQL script provided in this documentation to create all the required tables. Execute each block of `CREATE TABLE` commands sequentially in your MySQL client.

4. **Verify Tables**
   After executing the `CREATE TABLE` statements, list all tables to ensure they have been created successfully:
   ```sql
   SHOW TABLES;
   ```

5. **Insert and Query Data**
   Insert sample data or perform queries to test the database schema.
   ```sql
   SELECT * FROM Users;
   ```

---

## Database Schema

### 1. `Users` Table
- Stores user information.
- Fields:
  - `id` (Primary Key)
  - `Name`, `Email`, `PhoneNumber`, `Password`
  - `AccountType` (Admin, Instructor, Student)
  - `Active` (Default: TRUE)
  - `Approve` (Default: FALSE)
  - Timestamps: `Created_at`, `Updated_at`

### 2. `Profile` Table
- Additional user profile details.
- Fields:
  - `id` (Primary Key)
  - `UserId` (Foreign Key referencing `Users.id`)
  - `Gender`, `DOB`, `About`, `ContactNumber`
  - `Updated_at`

### 3. `Courses` Table
- Course details.
- Fields:
  - `id` (Primary Key)
  - `CourseName`, `CourseDescription`, `WhatYouWillLearn`
  - `InstructorId` (Foreign Key referencing `Users.id`)
  - `Price`, `Thumbnail`, `TagId`
  - Timestamps: `Created_at`, `Updated_at`

### 4. `Section` Table
- Course sections.
- Fields:
  - `id` (Primary Key)
  - `SectionName`
  - `courseId` (Foreign Key referencing `Courses.id`)

### 5. `SubSection` Table
- Subsections under a section.
- Fields:
  - `id` (Primary Key)
  - `SectionId` (Foreign Key referencing `Section.id`)
  - `Title`, `TimeDuration`, `Description`, `VideoURL`, `AdditionalURL`

### 6. `RatingAndReviews` Table
- Ratings and reviews for courses.
- Fields:
  - `id` (Primary Key)
  - `UserId` (Foreign Key referencing `Users.id`)
  - `CourseId` (Foreign Key referencing `Courses.id`)
  - `Rating`, `Review`
  - `Created_at`

### 7. `Tags` Table
- Tags for categorizing courses.
- Fields:
  - `id` (Primary Key)
  - `Name`, `Description`
  - `CourseId` (Foreign Key referencing `Courses.id`)
  - `Created_at`

### 8. `CourseProgress` Table
- Tracks user progress on courses.
- Fields:
  - `id` (Primary Key)
  - `UserId` (Foreign Key referencing `Users.id`)
  - `CourseId` (Foreign Key referencing `Courses.id`)
  - `CompletedVideos` (Default: 0)

### 9. `CourseEnroll` Table
- Tracks course enrollment.
- Fields:
  - `id` (Primary Key)
  - `UserId` (Foreign Key referencing `Users.id`)
  - `CourseId` (Foreign Key referencing `Courses.id`)
  - `enroll_at`

### 10. `Invoices` Table
- Invoice details for course purchases.
- Fields:
  - `id` (Primary Key)
  - `UserId` (Foreign Key referencing `Users.id`)
  - `CourseId` (Foreign Key referencing `Courses.id`)
  - `Price`, `Address`, `Pincode`
  - `Created_at`

### 11. `Otp` Table
- Stores OTP for verification.
- Fields:
  - `Email`, `Otp`, `Created_at`

---

## Additional Notes
- Ensure the `FOREIGN KEY` constraints are respected when inserting or deleting data.
- Use transactions for complex operations to maintain data integrity.

---

## Contact
For any issues or queries regarding the database setup, contact the developer team.
