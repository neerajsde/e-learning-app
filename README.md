# E-Learning App

## Overview
E-Learning App is a full-stack web application designed to provide a seamless online learning experience. This platform enables users to access courses, track progress, and enhance their learning journey with an intuitive interface. Built from scratch using modern web technologies, this project ensures performance, scalability, and user engagement.

## Features
- User authentication and authorization
- Course listing and detailed course pages
- Progress tracking for enrolled courses
- Interactive UI with a responsive design
- Backend API for managing users, courses, and progress
- Secure data storage and retrieval

## Technologies Used
### Frontend:
- **Next.js** – For server-side rendering and improved performance
- **TailwindCSS** – For rapid and responsive UI styling
- **Vercel** – For seamless frontend deployment

### Backend:
- **Node.js** – Server-side JavaScript runtime
- **Express.js** – Backend framework for API handling
- **MySQL** – Relational database for structured data storage
- **VPS (Ubuntu/Linux)** – For hosting the backend securely

## Deployment
### Frontend:
The frontend is deployed on **Vercel**, ensuring fast and scalable deployment with automatic optimizations.

### Backend:
The backend is hosted on a **VPS**, allowing full control over the server environment, optimized performance, and security.

## Installation & Setup
### Prerequisites:
- Node.js & npm installed
- MySQL database set up
- VPS configured for backend deployment

### Steps:
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/e-learning-app.git
   cd e-learning-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add required variables (e.g., database credentials, API keys)

4. Run the backend:
   ```sh
   cd server
   npm install
   npm run dev
   ```

5. Start the frontend:
   ```sh
   npm run dev
   ```


### Live Demo
[Visit the E-Learning App](https://e-learning-app-pink.vercel.app/)