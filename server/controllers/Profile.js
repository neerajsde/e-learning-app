const { getPool } = require('../config/database');
const sendResponse = require("../utlis/responseSender");
const imageUploader = require('../utlis/imageUploader');
const deleteImage = require('../utlis/deleteImageHandler');

// update user profile
exports.updateProfile = async (req, res) => {
    try {
        // Extract user data from request body
        const { username, dateOfBirth, profession, about, countryCode, contactNumber, gender } = req.body;

        // Get userId from authenticated user
        const id = req.user?.id;
        
        // Basic validation: required fields
        if (!contactNumber || !gender || !id) {
            return sendResponse(res, 400, false, 'User ID, contact number, and gender are required.');
        }

        const Pool = getPool();
        if(username){
            await Pool.query(
                'UPDATE users SET name = ? WHERE id = ?', [username, id]
            )
        }
        
        // Base query and parameters
        let query = 'UPDATE Profile SET contactNumber = ?, gender = ?';
        const params = [contactNumber, gender];

        
        if (dateOfBirth) {
            query += ', dateOfBirth = ?';
            params.push(dateOfBirth);
        }
        if (about) {
            query += ', about = ?';
            params.push(about);
        }
        if (profession) {
            query += ', profession = ?';
            params.push(profession);
        }
        if (countryCode) {
            query += ', contryCode = ?';
            params.push(countryCode);
        }

        // Finalizing query with WHERE condition
        query += ' WHERE userId = ?';
        params.push(id);

        // Execute the query
        await Pool.query(query, params);

        const [user] = await Pool.query('SELECT name, email, accountType, gender, dateOfBirth, about, contryCode, contactNumber, profession, user_img FROM users JOIN profile ON users.id = profile.userid WHERE users.id = ?', [req.user.id]);
        if(user.length === 0){
            return sendResponse(res, 404, false, 'User Data Not Found');
        }

        // Return success response
        return sendResponse(res, 200, true, 'Profile updated successfully.', {updatedData: user[0]});
    } catch (error) {
        console.error('Error while updating user profile:', error.message);
        return sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

// delete user profile
exports.deleteUser = async (req, res) => {
    try {
        // Get userId from the authenticated request
        const id = req.user.id;

        // Validate if userId exists
        if (!id) {
            return sendResponse(res, 400, false, 'User ID is required');
        }

        const Pool = getPool();

        // Delete the user
        await Pool.query('UPDATE Users SET active = ? WHERE id = ?', [false, id]);

        // Return response
        return sendResponse(res, 200, true, 'User deleted successfully');
    } catch (error) {
        console.error('Error while deleting user: ', error.message);
        return sendResponse(res, 500, false, 'Internal server error', {error: error.message});
    }
};

// get user Profile
exports.getProfile = async (req, res) => {
    try{
        const Pool = getPool();
        const [user] = await Pool.query('SELECT name, email, accountType, gender, dateOfBirth, about, contryCode, contactNumber, profession, user_img FROM users JOIN profile ON users.id = profile.userid WHERE users.id = ?', [req.user.id]);
        if(user.length === 0){
            return sendResponse(res, 404, false, 'User Data Not Found');
        }

        return sendResponse(res, 200, true, 'Found User data', {userData: user[0]});
    } catch(err){
        console.log("Error While Getting User Profile: ", err.message);
        return sendResponse(res, 500, false, 'Internal Server Error', {error: err.message});
    }
}


// update user profile picture
exports.updateProfilePicture = async (req, res) => {
    try{
        const { id } = req.user;
        const user_img = req.files?.img;
        
        if(!user_img){
            return sendResponse(res, 404, false, 'Please upload image');
        }

        const Pool = getPool();
        const [[user]] = await Pool.query(
            'SELECT user_img FROM users WHERE id = ?', [id]
        );

        if(user.user_img){
            await deleteImage(user.user_img);
        }

        // Upload image
        const userImage = await imageUploader('Users', user_img, {width:300, height:300, quality:80});
        if (!userImage.flag) {
            return sendResponse(res, 400, false,userImage.message );
        }

        await Pool.query(
            'UPDATE users SET user_img = ? WHERE id = ?', [userImage.url, id]
        );

        return sendResponse(res, 200, true, 'Profile Image Updated', {user_img:userImage.url});
    } catch(err){
        console.log("Error While Updating User Profile Picture: ", err.message);
        return sendResponse(res, 500, false, 'Internal Server Error', {error: err.message});
    }
}

// remove user profile picture
exports.removeProfilePicture = async (req, res) => {
    try{
        const { id } = req.user;

        const Pool = getPool();

        const [[user]] = await Pool.query(
            'SELECT user_img FROM users WHERE id = ?', [id]
        );
        
        const result = await deleteImage(user.user_img);
        if (!result.flag) {
            return sendResponse(res, 400, false,result.message );
        } 
        
        await Pool.query(
            'UPDATE users SET user_img = ? WHERE id = ?', [null, id]
        );

        return sendResponse(res, 200, true, 'Profile Image Removed', {user_img:''});
    } catch(err){
        console.log("Error While removing User Profile Picture: ", err.message);
        return sendResponse(res, 500, false, 'Internal Server Error', {error: err.message});
    }
}