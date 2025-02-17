const { getPool } = require('../config/database');
const sendResponse = require("../utlis/responseSender");

exports.createTag = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validation
        if (!name || !description) {
            return sendResponse(res, 400, false, 'All fields are required');
        }

        const trimName = name.trim();
        const trimDesc = description.trim();

        const Pool = getPool();

        // Check if the tag already exists
        const [result] = await Pool.query(`SELECT * FROM Tags WHERE name LIKE '${trimName}'`);
        if (result.length > 0) {
            return sendResponse(res, 400, false, 'Tag already exists');
        }

        // Insert the new tag
        const [newTags] = await Pool.query('INSERT INTO Tags (name, description) VALUES (?, ?)', [trimName, trimDesc]);
        if (newTags.affectedRows === 0) {
            return sendResponse(res, 500, false, 'Error while creating the tag');
        }

        return sendResponse(res, 201, true, 'Tag created successfully');
    } catch (err) {
        console.error("Error while creating new tag: ", err.message);
        return sendResponse(res, 500, false, 'Internal server error');
    }
};

exports.getAllTags = async (req, res) => {
    try {
        const Pool = getPool();
        const [result] = await Pool.query('SELECT * FROM Tags');

        if (result.length === 0) {
            return sendResponse(res, 404, false, "Tags Not Found");
        }

        return sendResponse(res, 200, true, 'Fetched All Tags data securely', { result });
    } catch (err) {
        console.error("Error while fetching tags: ", err.message);
        return sendResponse(res, 500, false, 'Internal Server Error');
    }
};
