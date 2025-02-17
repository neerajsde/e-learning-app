CREATE DATABASE IF NOT EXISTS StudyNotionApp;
USE StudyNotionApp;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_img VARCHAR(255),
    accountType ENUM('Admin', 'Instructor', 'Student'),
    active BOOLEAN DEFAULT TRUE,
    approve BOOLEAN DEFAULT FALSE,
    isLoggedIn BOOLEAN DEFAULT FALSE,
    token VARCHAR(255),
    tokenExpirationTime BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    dateOfBirth VARCHAR(50),
    about TEXT,
    profession VARCHAR(100),
    contryCode VARCHAR(10),
    contactNumber VARCHAR(10),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE Courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    courseName VARCHAR(255) NOT NULL,
    courseDescription TEXT,
    instructorId INT NOT NULL,
    whatYouWillLearn TEXT,
    price INT,
    thumbnail VARCHAR(255),
    category VARCHAR(100),
    slugUrl VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructorId) REFERENCES Users(id)
);

CREATE TABLE Category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    slugUrl VARCHAR(255) UNIQUE NOT NULL,
    date DATE DEFAULT (CURRENT_DATE),
    time TIME DEFAULT (CURRENT_TIME)
);

CREATE TABLE Section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sectionName VARCHAR(255) NOT NULL,
    courseId INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (courseId) REFERENCES Courses(id)
);

CREATE TABLE SubSection (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sectionId INT NOT NULL,
    title VARCHAR(255),
    timeDuration VARCHAR(50),
    description TEXT,
    videoURL VARCHAR(255),
    additionalURL VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SectionId) REFERENCES Section(id)
);

CREATE TABLE RatingAndReviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    courseId INT NOT NULL,
    rating DECIMAL(3, 1) NOT NULL,
    review TEXT,
    date DATE DEFAULT (CURRENT_DATE),
    time TIME DEFAULT (CURRENT_TIME),
    FOREIGN KEY (UserId) REFERENCES Users(id),
    FOREIGN KEY (CourseId) REFERENCES Courses(id)
);

CREATE TABLE Tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TaggedCourse (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tagId INT NOT NULL,
    courseId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tagId) REFERENCES Tags(id),
    FOREIGN KEY (courseId) REFERENCES Courses(id)
);

CREATE TABLE CourseProgress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    courseId INT NOT NULL,
    completedVideos INT DEFAULT 0,
    FOREIGN KEY (UserId) REFERENCES Users(id),
    FOREIGN KEY (CourseId) REFERENCES Courses(id)
);

CREATE TABLE CourseEnroll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    courseId INT NOT NULL,
    enroll_date DATE DEFAULT (CURRENT_DATE),
    enroll_time TIME DEFAULT (CURRENT_TIME),
    FOREIGN KEY (UserId) REFERENCES Users(id),
    FOREIGN KEY (CourseId) REFERENCES Courses(id)
);

CREATE TABLE Invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    courseId INT NOT NULL,
    price DECIMAL(10, 2),
    address VARCHAR(255),
    pincode VARCHAR(10),
    date DATE DEFAULT (CURRENT_DATE),
    time TIME DEFAULT (CURRENT_TIME),
    FOREIGN KEY (UserId) REFERENCES Users(id),
    FOREIGN KEY (CourseId) REFERENCES Courses(id)
);

CREATE TABLE Otp (
    email VARCHAR(255) NOT NULL,
    otp INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ContactUs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    message TEXT,
    date DATE DEFAULT (CURRENT_DATE),
    time TIME DEFAULT (CURRENT_TIME),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE blacklistedTokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

SHOW TABLES;