# Study Notion App API Documentation

## Base URL

**`http://localhost:4000/api/v1/`**

---

## Authentication APIs

### 1. **Send OTP**

**Endpoint:** `POST /user/send-otp`  
**Description:** Sends an OTP to the user's email.  
**Request Body:**

```json
{
    "email": "user@example.com"
}
```

---

### 2. **Sign Up**

**Endpoint:** `POST /user/signup`  
**Description:** Registers a new user. Requires OTP verification.  
**Request Body:**

```json
{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securepassword",
    "phone": "1234567890",
    "role": "Admin",
    "otp": 123456
}
```

---

### 3. **Login**

**Endpoint:** `POST /user/login`  
**Description:** Logs in a user.  
**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "securepassword"
}
```

---

### 4. **Reset Password (Send Link)**

**Endpoint:** `POST /user/password/reset`  
**Description:** Sends a password reset link to the user's email.  
**Request Body:**

```json
{
    "email": "user@example.com"
}
```

---

### 5. **Update Password**

**Endpoint:** `POST /user/password/update`  
**Description:** Updates the user's password using a token.  
**Request Body:**

```json
{
    "token": "reset-token",
    "newPassword": "newpassword"
}
```

---

### 6. **Change Password**

**Endpoint:** `POST /user/password/change`  
**Description:** Changes the user's password.  
**Request Body:**

```json
{
    "oldPassword": "oldpassword",
    "newPassword": "newpassword",
    "confPassword": "newpassword"
}
```

---

## Course Management APIs

### 1. **Create Category**

**Endpoint:** `POST /course/category`  
**Description:** Creates a new course category.  
**Request Body:**

```json
{
    "name": "JavaScript",
    "description": "JavaScript Basics and Advanced Topics"
}
```

---

### 2. **Get All Categories**

**Endpoint:** `GET /course/categories`  
**Description:** Retrieves all course categories.

---

### 3. **Create Course**

**Endpoint:** `POST /course/create`  
**Description:** Creates a new course.  
**Request Body:** (Multipart Form Data)

- `courseName`: Course name (text)  
- `courseDescription`: Course description (text)  
- `whatYoutWillLearn`: Topics covered (text)  
- `price`: Course price (text)  
- `tags`: Tags (text)  
- `img`: Course image (file)  
- `category`: Category name (text)  

---

### 4. **Get All Courses**

**Endpoint:** `GET /courses`  
**Description:** Retrieves all courses.

---

### 5. **Get Course Details**

**Endpoint:** `GET /course/id/{courseId}`  
**Description:** Retrieves details of a specific course.  

---

### 6. **Create New Section**

**Endpoint:** `POST /course/section`  
**Description:** Adds a new section to a course.  
**Request Body:**

```json
{
    "sectionName": "Introduction",
    "courseId": 1
}
```

---

### 7. **Create New Sub-Section**

**Endpoint:** `POST /course/subsection`  
**Description:** Adds a new sub-section to a section.  
**Request Body:** (Multipart Form Data)

- `sectionId`: ID of the section (text)  
- `title`: Sub-section title (text)  
- `timeDuration`: Time duration (text)  
- `description`: Sub-section description (text)  
- `video`: Video file (file)  

---

## Reviews and Ratings APIs

### 1. **Write Review**

**Endpoint:** `POST /course/rating-and-review`  
**Description:** Submits a review and rating for a course.  
**Request Body:**

```json
{
    "courseId": 1,
    "rating": 4,
    "review": "Great course!"
}
```

---

### 2. **Get Course Reviews**

**Endpoint:** `GET /course/rating-and-review/{courseId}`  
**Description:** Retrieves all reviews for a specific course.  

---

### 3. **Get All Reviews**

**Endpoint:** `GET /rating/all`  
**Description:** Retrieves all ratings and reviews.

---

### 4. **Course Average Ratings**

**Endpoint:** `GET /course/avg-rating/{courseId}`  
**Description:** Retrieves the average rating for a specific course.

---

## Contact APIs

### 1. **Submit Contact Form**

**Endpoint:** `POST /contact/add`  
**Description:** Submits a contact form message.  
**Request Body:**

```json
{
    "userId": 3,
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "message": "Need help with the platform."
}
```

---

## Profile Management APIs

### 1. **Get Profile Data**

**Endpoint:** `GET /profile`  
**Description:** Retrieves user profile data.

---

### 2. **Update Profile**

**Endpoint:** `PUT /profile`  
**Description:** Updates user profile data.  
**Request Body:**

```json
{
    "dateOfBirth": "01-01-1990",
    "about": "Software Developer",
    "contactNumber": "+1234567890",
    "gender": "Male"
}
```

---

### 3. **Block/Delete User**

**Endpoint:** `DELETE /profile`  
**Description:** Deletes or blocks a user account.
