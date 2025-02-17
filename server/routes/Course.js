const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourseDetails,
  getAllCourses,
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

const {
  auth,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middleware/Auth");

// Course routes
router.get("/c/:courseUrl", getCourseDetails);
router.post("/create", auth, isInstructor, createCourse);
router.get("/all", getAllCourses);

// Category routes
router.post("/category", auth, isAdmin, createCategory);
router.get("/categories", getAllCategory);
router.get("/category/:category", categoryPageDetails);

// Section routes
router.post("/section", auth, isInstructor, createSection);
router.put("/section", auth, isInstructor, updateSection);
router.delete("/section/:sectionId", auth, isInstructor, deleteSection);

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
router.post("/rating-and-review", auth, isStudent, createRating);
router.get("/avg-rating/:courseId", getAvgCourseRating);
router.get("/rating-and-review/:courseId", getRatingsAndReviewsByCourseId);

module.exports = router;
