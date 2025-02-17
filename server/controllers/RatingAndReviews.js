const { getPool } = require('../config/database');
const sendResponse = require('../utlis/responseSender');

// create new rating
exports.createRating = async (req, res) => {
    try {
        const { courseId, rating, review } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!courseId || !rating || !review) {
            return res.status(400).json({
                success: false,
                message: 'All fields (courseId, rating, review) are required.'
            });
        }

        const trimmedReview = review.trim();

        const pool = getPool();

        // Check if the user has already reviewed the course
        const [[existingReview]] = await pool.query(
            'SELECT id FROM RatingAndReviews WHERE userId = ? AND courseId = ?',
            [userId, courseId]
        );

        if (existingReview) {
            return res.status(403).json({
                success: false,
                message: 'You can only write one review per course.'
            });
        }

        // Check if the user is enrolled in the course
        const [[enrollment]] = await pool.query(
            'SELECT id FROM CourseEnroll WHERE userId = ? AND courseId = ?',
            [userId, courseId]
        );

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: 'You must enroll in the course before writing a review.'
            });
        }

        // Insert the new review
        const [result] = await pool.query(
            'INSERT INTO RatingAndReviews (userId, courseId, rating, review) VALUES (?, ?, ?, ?)',
            [userId, courseId, rating, trimmedReview]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create review. Please try again later.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Review submitted successfully.'
        });

    } catch (err) {
        console.error('Error while creating rating and review:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
            error: err.message
        });
    }
};

// Get course average ratings
exports.getAvgCourseRating = async (req, res) => {
    try {
        const { courseId } = req.params;
        const pool = getPool();

        // Fetch average rating and total reviews for the course
        const [[result]] = await pool.query(
            'SELECT ROUND(AVG(rating), 1) AS avgRating, COUNT(id) AS totalReviews FROM RatingAndReviews WHERE courseId = ?',
            [courseId]
        );

        const [[students]] = await pool.query(
            'SELECT COUNT(*) AS total_enrolled FROM CourseEnroll WHERE courseId = ?', [courseId]
        )

        // Handle case when there are no reviews
        if (!result || result.totalReviews === 0) {
            return sendResponse(res, 400, false, "No reviews found for this course.", {avgRating: '4.5', totalReviews: '250', students:'5680'});
        }

        // Respond with the average rating and total reviews
        return sendResponse(res, 200, true, 'Average rating fetched successfully.', {avgRating: result.avgRating, totalReviews: result.totalReviews, students:students?.total_enrolled || '455'});
    } catch (err) {
        console.error('Error while getting average rating and review:', err.message);
        return sendResponse(res, 500, false, 'Internal Srever Error', {error:err.message});
    }
};

// Get all ratings and reviews with user and course details
exports.getAllRatingsAndReviews = async (req, res) => {
    try {
        const pool = getPool();

        // Fetch all ratings and reviews with user and course details
        const [reviews] = await pool.query(
            `SELECT 
                rr.rating, 
                rr.review, 
                rr.date, 
                u.name AS userName, 
                u.user_img AS userImg, 
                c.courseName AS courseName 
            FROM RatingAndReviews rr
            JOIN Users u ON rr.userId = u.id
            JOIN Courses c ON rr.courseId = c.id
            ORDER BY rr.date DESC, rr.time DESC
            LIMIT 4`
        );

        // Handle case when there are no reviews
        if (reviews.length === 0) {
            return sendResponse(res, 404, false, 'No ratings or reviews found.');
        }

        // Respond with all reviews
        return sendResponse(res, 200, true, 'All ratings and reviews fetched successfully.', {reviews});
    } catch (err) {
        console.error('Error while fetching ratings and reviews:', err.message);
        return sendResponse(res, 500, false, 'Internal Server Error.', {error: err.message})
    }
};

// Get ratings and reviews by courseId
exports.getRatingsAndReviewsByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;
        const pool = getPool();

        // Fetch ratings and reviews for a specific course
        const [reviews] = await pool.query(
            `SELECT 
                rr.rating, 
                rr.review, 
                rr.date, 
                rr.time, 
                u.name AS userName, 
                u.user_img AS user_img 
            FROM RatingAndReviews rr
            JOIN Users u ON rr.userId = u.id
            WHERE rr.courseId = ?
            ORDER BY rr.date DESC, rr.time DESC`,
            [courseId]
        );

        // Handle case when there are no reviews for the course
        if (reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No ratings or reviews found for courseId: ${courseId}`
            });
        }

        // Respond with reviews for the course
        return res.status(200).json({
            success: true,
            message: 'Ratings and reviews fetched successfully for the course.',
            reviews
        });
    } catch (err) {
        console.error('Error while fetching ratings and reviews by courseId:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error.',
            error: err.message
        });
    }
};