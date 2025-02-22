const { getPool } = require('../config/database');
const sendResponse = require('../utlis/responseSender');

exports.createSection = async (req, res) => {
    try{
        const {sectionName, courseId} = req.body;
        //data validation
        if(!sectionName || !courseId) {
            return sendResponse(res, 400, false, `Missing Properties`);
        }

        const Pool = getPool();
        //create section
        const [newSection] = await Pool.query('INSERT INTO Section (sectionName, courseId) VALUES (?, ?)', [sectionName, courseId]);

        if (newSection.affectedRows === 0) {
            return sendResponse(res, 500, false, 'Error creating the course section');
        }
        //return response
        return sendResponse(res, 200, true, 'Section created successfully');
    }
    catch(error) {
        console.log("Error while creating new section: ", error.message);
        return sendResponse(res, 500, false, "Unable to create Section, please try again");
    }
}

exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId } = req.body;

        // Data validation
        if (!sectionName || !sectionId) {
            return sendResponse(res, 400, false, 'Missing required properties: sectionName or sectionId');
        }

        const pool = getPool(); // Ensure asynchronous call to getPool

        // Update section in the database
        const [updateResult] = await pool.query(
            'UPDATE Section SET sectionName = ? WHERE id = ?',
            [sectionName, sectionId]
        );

        if (updateResult.affectedRows === 0) {
            return sendResponse(res, 404, false, 'Section not found or no changes made');
        }

        // Return success response
        return sendResponse(res, 200, true, 'Section updated successfully');
    } catch (error) {
        console.error('Error while updating section:', error.message);
        return sendResponse(res, 500, false, 'Unable to update section. Please try again.', {error:error.message});
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.params;

        // Validate sectionId
        if (!sectionId) {
            return sendResponse(res, 400, false, 'Section ID is required');
        }

        const pool = getPool(); // Ensure asynchronous call to getPool

        // Delete section from the database
        const [deleteResult] = await pool.query('DELETE FROM Section WHERE id = ?', [sectionId]);

        if (deleteResult.affectedRows === 0) {
            return sendResponse(res, 404, false, 'Section not found');
        }

        // Return success response
        return sendResponse(res, 200, true, 'Section deleted successfully');
    } catch (error) {
        console.error('Error while deleting section:', error.message);
        return sendResponse(res, 500, false, 'Unable to delete section. Please try again.', {error: error.message});
    }
};

exports.getCourseSections = async (req, res) => {
    try{
        const {id} = req.query;
        const {userId} = req.user.id;

        const pool = getPool(); // Ensure asynchronous call to getPool

        // verify instructor
        const [course] = await pool.query('SELECT instructorId FROM Courses WHERE id = ?', [id]);
        if(course.length > 0 && course.instructorId !== userId){
            return sendResponse(res, 403, false, 'Unable to get section data');
        }

        // Fetch all sections and their subsections in one go
        const [sectionsAndSubsections] = await pool.query(
            `SELECT 
                s.id AS sectionId, s.sectionName, s.courseId,
                ss.id AS subSectionId, ss.title, ss.timeDuration, ss.description, ss.videoURL, ss.additionalURL 
             FROM Section s
             LEFT JOIN SubSection ss ON s.id = ss.sectionId
             WHERE s.courseId = ?
             ORDER BY ss.created_at ASC`,
            [id]
        );

        // Transform sections and group their subsections
        const sectionMap = {};
        sectionsAndSubsections.forEach(row => {
            if (!sectionMap[row.sectionId]) {
                sectionMap[row.sectionId] = {
                    sectionName: row.sectionName,
                    subSections: []
                };
            }
            if (row.subSectionId) {
                sectionMap[row.sectionId].subSections.push({
                    id: row.subSectionId,
                    title: row.title,
                    timeDuration: row.timeDuration,
                    description: row.description,
                    videoURL: row.videoURL,
                    additionalURL: row.additionalURL
                });
            }
        });

        const allSections = Object.values(sectionMap);
        if (sectionMap.length === 0) {
            return sendResponse(res, 404, false, 'Empty sections');
        }
        return sendResponse(res, 200, true, 'All Sections', allSections);
    } catch (error) {
        console.error('Error while fetching course section:', error.message);
        return sendResponse(res, 500, false, 'Unable to fetching course section. Please try again.', {error: error.message});
    }
}