const { getPool } = require('../config/database');

exports.createSection = async (req, res) => {
    try{
        const {sectionName, courseId} = req.body;
        //data validation
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }

        const Pool = getPool();
        //create section
        const [newSection] = await Pool.query('INSERT INTO Section (sectionName, courseId) VALUES (?, ?)', [sectionName, courseId]);

        if (newSection.affectedRows === 0) {
            return res.status(500).json({ success: false, message: 'Error creating the course section' });
        }
        //return response
        return res.status(200).json({
            success:true,
            message:'Section created successfully'
        })
    }
    catch(error) {
        console.log("Error while creating new section: ", error.message);
        return res.status(500).json({
            success:false,
            message:"Unable to create Section, please try again",
            error:error.message,
        });
    }
}

exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId } = req.body;

        // Data validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required properties: sectionName or sectionId',
            });
        }

        const pool = getPool(); // Ensure asynchronous call to getPool

        // Update section in the database
        const [updateResult] = await pool.query(
            'UPDATE Section SET sectionName = ? WHERE id = ?',
            [sectionName, sectionId]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Section not found or no changes made',
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Section updated successfully',
        });
    } catch (error) {
        console.error('Error while updating section:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Unable to update section. Please try again.',
            error: error.message,
        });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.params;

        // Validate sectionId
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: 'Section ID is required',
            });
        }

        const pool = getPool(); // Ensure asynchronous call to getPool

        // Delete section from the database
        const [deleteResult] = await pool.query('DELETE FROM Section WHERE id = ?', [sectionId]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Section not found',
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Section deleted successfully',
        });
    } catch (error) {
        console.error('Error while deleting section:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Unable to delete section. Please try again.',
            error: error.message,
        });
    }
};