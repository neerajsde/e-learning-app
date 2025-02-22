const express = require('express');
const router = express.Router();

const {
    auth, 
    isInstructor
} = require('../../middleware/Auth');
const {
    instructorCourseDetails
} = require('../../controllers/Instructor');

router.get('/courses', auth, isInstructor, instructorCourseDetails);

module.exports = router;