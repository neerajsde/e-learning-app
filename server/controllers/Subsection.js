const { getPool } = require('../config/database');
const videoUploader = require('../utlis/videoUploader');
const deleteVideoHandler = require('../utlis/deleteVideoHandler');

exports.createSubSection = async (req, res) => {
    try{
        //fecth data from Req body
        const {sectionId, title, timeDuration, description} = req.body;
        //extract file/video
        const video  = req.files?.video;
        //validation
        if(!sectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        if (!video) {
            return res.status(400).json({ success: false, message: 'No video file provided' });
        }

        //upload video to server
        const videoUploading = await videoUploader('CourseVideos', video);
        if (!videoUploading.flag) {
            return res.status(400).json({ success: false, message: videoUploading.message });
        }

        const Pool = getPool();
        const [insertResult] = await Pool.query('INSERT INTO SubSection (sectionId, title, timeDuration, description, videoURL) VALUES (?,?,?,?,?)', [sectionId, title, timeDuration, description, videoUploading.url]);

        if (insertResult.affectedRows === 0) {
            return res.status(500).json({ success: false, message: 'Error creating the course' });
        }
        return res.status(200).json({
            succcess:true,
            message:'Sub Section Created Successfully',
        });
    }
    catch(error) {
        console.log("Error while creating new sub section: ", error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message,
        })
    }
};

exports.updateSubSection = async (req, res) => {
    try {
        // Extract data from request body
        const { subSectionId, title, timeDuration, description, oldVideoUrl } = req.body;
        // Extract file/video
        const video = req.files?.video;

        // Validation
        if (!subSectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
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
                return res.status(400).json({ success: false, message: videoUploading.message });
            }
            videoURL = videoUploading.url;
        }

        const Pool = getPool();
        let query = 'UPDATE SubSection SET title = ?, timeDuration = ?, description = ?';
        const params = [title, timeDuration, description];

        if (videoURL) {
            query += ', videoURL = ?';
            params.push(videoURL);
        }

        query += ' WHERE id = ?';
        params.push(subSectionId);

        const [updateResult] = await Pool.query(query, params);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'SubSection not found or no changes made' });
        }

        return res.status(200).json({
            success: true,
            message: 'SubSection updated successfully',
        });
    } catch (error) {
        console.log("Error while updating sub section: ", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.deleteSubSection = async (req, res) => {
    try {
        // Extract subSectionId from request params
        const { subSectionId } = req.params;

        // Validation
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: 'SubSection ID is required',
            });
        }

        const Pool = getPool();
        const [subSectionData] = await Pool.query('SELECT * FROM SubSection WHERE id = ?', [subSectionId]);
        if(subSectionData.length > 0){
            if(subSectionData[0].videoURL){
                await deleteVideoHandler(subSectionData[0].videoURL);
            }
        }
        const [deleteResult] = await Pool.query('DELETE FROM SubSection WHERE id = ?', [subSectionId]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'SubSection not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'SubSection deleted successfully',
        });
    } catch (error) {
        console.log("Error while deleting sub section: ", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
