const { getPool } = require('../config/database');
const videoUploader = require('../utlis/videoUploader');
const deleteVideoHandler = require('../utlis/deleteVideoHandler');
const sendResponse = require('../utlis/responseSender');

exports.createSubSection = async (req, res) => {
    try{
        const {sectionId, title, hour, minute, second, description} = req.body;
        if(!sectionId || !title || !hour || !minute || !second || !description){
            return sendResponse(res, 404, false, "All fields are required");
        }
        //extract file/video
        const video  = req.files?.video;

        if (!video) {
            return res.status(400).json({ success: false, message: 'No video file provided' });
        }

        //upload video to server
        const videoUploading = await videoUploader('CourseVideos', video);
        if (!videoUploading.flag) {
            return res.status(400).json({ success: false, message: videoUploading.message });
        }
        const duration = `${hour}:${minute}:${second}`;
        const Pool = getPool();
        const [insertResult] = await Pool.query('INSERT INTO SubSection (sectionId, title, timeDuration, description, videoURL) VALUES (?,?,?,?,?)', [sectionId, title, duration, description, videoUploading.url]);

        if (insertResult.affectedRows === 0) {
            return sendResponse(res, 500, false, 'Error creating the course');
        }
        return sendResponse(res, 200, true, 'Sub Section Created Successfully');
    }
    catch(error) {
        console.log("Error while creating new sub section: ", error);
        return sendResponse(res, 500, false, "Internal Server Error", {error:error.message});
    }
};

exports.updateSubSection = async (req, res) => {
    try {
        // Extract data from request body
        const { subSectionId, title, hour, minute, second, description, oldVideoUrl } = req.body;
        // Extract file/video
        const video = req.files?.video;
        const instructorId = req.user.id;

        // Validation
        if (!subSectionId || !title || !hour || !minute || !second || !description) {
            return sendResponse(res, 400, false, 'All fields are required');
        }

        let videoURL = null;
        if (video) {
            // delete old videos
            if(oldVideoUrl){
                await deleteVideoHandler(oldVideoUrl);
            }
            // Upload new video if provided
            const videoUploading = await videoUploader('CourseVideos', video);
            if (!videoUploading.flag) {
                return sendResponse(res, 400, false, videoUploading.message);
            }
            videoURL = videoUploading.url;
        }

        const duration = `${hour}:${minute}:${second}`;
        const Pool = getPool();
        let query = 'UPDATE SubSection SET title = ?, timeDuration = ?, description = ?';
        const params = [title, duration, description];

        if (videoURL) {
            query += ', videoURL = ?';
            params.push(videoURL);
        }

        query += ' WHERE id = ?';
        params.push(subSectionId);

        const [updateResult] = await Pool.query(query, params);

        if (updateResult.affectedRows === 0) {
            return sendResponse(res, 404, false, 'SubSection not found or no changes made');
        }

        return sendResponse(res, 200, true, 'SubSection updated successfully');
    } catch (error) {
        console.log("Error while updating sub section: ", error.message);
        return sendResponse(res, 500, false, "Internal server error", error.message);
    }
};

exports.deleteSubSection = async (req, res) => {
    try {
        // Extract subSectionId from request params
        const { subSectionId } = req.params;

        // Validation
        if (!subSectionId) {
            return sendResponse(res, 400, false, 'SubSection ID is required');
        }

        const Pool = getPool();
        const [subSectionData] = await Pool.query('SELECT * FROM SubSection WHERE id = ?', [subSectionId]);
        if(subSectionData.length > 0){
            if(subSectionData[0].videoURL){
                const isDelete = await deleteVideoHandler(subSectionData[0].videoURL);
                if(!isDelete.flag){
                    return sendResponse(res, 403, false, isDelete.message);
                }
            }
        }
        const [deleteResult] = await Pool.query('DELETE FROM SubSection WHERE id = ?', [subSectionId]);

        if (deleteResult.affectedRows === 0) {
            return sendResponse(res, 404, false, 'SubSection not found');
        }

        return sendResponse(res, 200, true, 'SubSection deleted successfully');
    } catch (error) {
        console.log("Error while deleting sub section: ", error.message);
        return sendResponse(res, 500, false, "Internal Server Error");
    }
};
