const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const { connectToDatabase } = require('./config/database');
require('dotenv').config();
const { decryptData } = require('./middleware/Decrypt');
// Import route modules
const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/Profile');
const courseRoutes = require('./routes/Course');
const ratingRoutes = require('./routes/Ratings');
const contactRoutes = require('./routes/Contact');
// const paymentRoutes = require('./routes/Payments');
const dashboardRoutes = require('./routes/Dashboard/Main');
const studentRoutes = require('./routes/Dashboard/Student');
const instructorRoutes = require('./routes/Dashboard/Instructor');
const adminRoutes = require('./routes/Dashboard/Admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(fileUpload());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:3000",
  credentials: true
}));

// Database connection
connectToDatabase().catch((err) => {
  console.error("Database connection failed", err);
  process.exit(1);
});

// Serve static React files
const buildPath = path.join(__dirname, 'public');
app.use(express.static(buildPath));

// Fallback route for React app
app.get('/', (req, res) => {
  res.sendFile(path.resolve(buildPath, 'index.html'));
});

// Static file serving
app.use('/public', express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/v1/user', decryptData,  userRoutes);
app.use('/api/v1/profile',decryptData, profileRoutes);
app.use('/api/v1/course',decryptData, courseRoutes);
app.use('/api/v1/rating',decryptData, ratingRoutes);
app.use('/api/v1/contact',decryptData, contactRoutes);
// app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/dashboard',decryptData, dashboardRoutes);
// app.use('/api/v1/dashboard/student',decryptData, studentRoutes);
// app.use('/api/v1/dashboard/instructor',decryptData, instructorRoutes);
// app.use('/api/v1/dashboard/admin',decryptData, adminRoutes);

// Error handling
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});