const express = require("express");
const router = express.Router();

const {
  createCourse,
  publishCourse,
  unPublishCourse,
  getCourseById,
  getCourseDetails,
  updateCourse,
  getAllCourses,
  updateCourseThumbnail
} = require("../controllers/Course");

const {
  createCategory,
  getAllCategory,
  categoryPageDetails,
} = require("../controllers/Category");

const {
  createSection,
  updateSection,
  deleteSection,
  getCourseSections,
} = require("../controllers/Section");

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

const {
  createRating,
  getAvgCourseRating,
  getRatingsAndReviewsByCourseId,
} = require("../controllers/RatingAndReviews");

// Middleware
const {
  auth,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middleware/Auth");

// const upload = require("../middleware/FileUpload");
const { decryptData } = require('../middleware/Decrypt');

// Course routes
router.get("/c/:courseUrl",decryptData, getCourseDetails);
router.get("/cd/:courseId", auth, isInstructor, getCourseById);
router.post("/create", decryptData, auth, isInstructor, createCourse);
router.put("/update", decryptData, auth, isInstructor, updateCourse);
router.put("/publish/:courseId", auth, isInstructor, publishCourse);
router.put("/unpublish/:courseId", auth, isInstructor, unPublishCourse);
router.get("/all", decryptData, getAllCourses);
router.put('/update/thumbnail', auth, isInstructor, updateCourseThumbnail);

// Category routes
router.post("/category", decryptData, auth, isAdmin, createCategory);
router.get("/categories",decryptData, getAllCategory);
router.get("/category/:category",decryptData, categoryPageDetails);

// Section routes
router.get("/section", decryptData, auth, isInstructor, getCourseSections);
router.post("/section",decryptData, auth, isInstructor, createSection);
router.put("/section", decryptData, auth, isInstructor, updateSection);
router.delete("/section/:sectionId", decryptData, auth, isInstructor, deleteSection);

// Subsection routes
router.post("/subsection", auth, isInstructor, createSubSection);
router.put("/subsection", auth, isInstructor, updateSubSection);
router.delete(
  "/subsection/:subSectionId",
  auth,
  isInstructor,
  deleteSubSection
);

// rating and review
router.post("/rating-and-review", decryptData, auth, isStudent, createRating);
router.get("/avg-rating/:courseId", decryptData, getAvgCourseRating);
router.get("/rating-and-review/:courseId", decryptData, getRatingsAndReviewsByCourseId);

module.exports = router;
