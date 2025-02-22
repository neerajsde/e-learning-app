const { getPool } = require('../config/database');
const sendResponse = require('../utlis/responseSender');

exports.instructorCourseDetails = async (req, res) => {
    try {
        const { id } = req.user;
        const Pool = getPool();

        // Fetch courses along with aggregated duration
        const [courses] = await Pool.query(
            `SELECT 
                c.id,
                c.courseName AS name,
                c.courseDescription AS courseDesc,  -- Changed 'desc' to 'courseDesc'
                c.price,
                c.thumbnail,
                c.category,
                c.slugUrl,
                c.isPublish,
                CONCAT(MONTHNAME(c.created_at), ' ', DAY(c.created_at), ', ', YEAR(c.created_at)) AS created_At,
                COALESCE(
                    SEC_TO_TIME(SUM(TIME_TO_SEC(sb.timeDuration))),
                    '10:00:00' -- Default to 10h 0m
                ) AS duration
            FROM Courses c
            LEFT JOIN Section s ON c.id = s.courseId
            LEFT JOIN SubSection sb ON s.id = sb.sectionId
            WHERE c.instructorId = ?
            GROUP BY c.id`,
            [id]
        );

        if (courses.length === 0) {
            return sendResponse(res, 404, false, 'No courses found');
        }

        return sendResponse(res, 200, true, "Fetched all courses", courses);
    } catch (err) {
        console.error("Error while fetching instructor course details:", err);
        return sendResponse(res, 500, false, 'Internal Server Error', { error: err.message });
    }
};
