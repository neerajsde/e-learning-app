const { getPool } = require('../config/database');
const encryptData  = require('../utlis/encrypt');

exports.createTag = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        const trimName = name.trim();
        const trimDesc = description.trim();

        const Pool = getPool();

        // Check if the tag already exists
        const [result] = await Pool.query(`SELECT * FROM tags WHERE name LIKE '${trimName}'`);
        if (result.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Tag already exists',
            });
        }

        // Insert the new tag
        const [newTags] = await Pool.query('INSERT INTO tags (name, description) VALUES (?, ?)', [trimName, trimDesc]);
        if (newTags.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: 'Error while creating the tag',
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Tag created successfully',
        });
    } catch (err) {
        console.error("Error while creating new tag: ", err.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

exports.getAllTags = async (req, res) => {
    try {
        const Pool = getPool();
        const [result] = await Pool.query('SELECT * FROM tags');

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Tags Not Found' });
        }

        const payload = {
            success: true,
            message: 'Fetched All Tags data securely',
            data: result,
        }

        // Encrypt the data
        const encryptedResult = encryptData(payload);

        res.status(200).json({encryptedResult});
    } catch (err) {
        console.error("Error while fetching tags: ", err.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
