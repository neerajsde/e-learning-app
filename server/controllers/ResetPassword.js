const { getPool } = require('../config/database');
const sendResponse = require('../utlis/responseSender');
const mailSender = require('../utlis/mailSender');
const {validateEmail} = require('../utlis/validateEmail');
const { sendResetPasswordMail } = require('../mails/reserPasswordMail');
const { sendPasswordChangeMail } = require('../mails/updatedPassword');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

exports.resetPasswordAndSendMailWithUrl = async(req, res) => {
    try{
        const { email } = req.body;
        if(!email){
            return sendResponse(res, 401, false, "Please enter your email");
        }
        // Validate email format
        if (!validateEmail(email)) {
            return sendResponse(res, 400, false, 'Invaild email');
        }
        
        const Pool = getPool();
        const [user] = await Pool.query(
            `SELECT id, name, email, active FROM Users WHERE email = ?`, 
            [email.trim()]
        );

        if (!user || user.length === 0) {
            return sendResponse(res, 400, false, 'User not found');
        }

        
        const userData = user[0];
        // Check if user is blocked
        if (!userData.active) {
            return sendResponse(res, 403, false, 'Your account is blocked for 24 hours' );
        }

        // Generate a secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 10 * 60 * 1000;

        // Store the token and expiry in Database 
        await Pool.query('UPDATE Users SET token = ?, tokenExpirationTime = ? WHERE id = ?' , [resetToken, tokenExpiry, userData.id]);
        
        const url = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        // Send the reset email
        await mailSender(userData.email, 'Reset Password', sendResetPasswordMail(userData.name, url));

        return sendResponse(res, 200, true, 'Password reset instructions have been sent to your email.');
    } catch(err){
        console.log("Error while reset password: ", err.message);
        return sendResponse(res, 500, false,"Internal Server Error" );
    }
}

exports.updatePassword = async (req, res) => {
    try{
        const { token, newPassword } = req.body;

        if(!token || !newPassword){
            return sendResponse(res, 404, false, "Fill All required fields");
        }

        const Pool = getPool();
        const [user] = await Pool.query(
            `SELECT id, email, name, accountType, tokenExpirationTime FROM Users WHERE token = ?`, 
            [token]
        );

        if (!user || user.length === 0) {
            return sendResponse(res, 404, false, 'Invaild Token');
        }
        const userData = user[0];
        // Check if the token has expired
        if (Date.now() > userData.tokenExpirationTime) {
            return sendResponse(res, 400, false, 'Token has expired.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await Pool.query('UPDATE Users SET password = ? WHERE id = ?', [hashedPassword, userData.id]);
        // Send email notification
        await mailSender(
            userData.email, 
            'Password Updated.', 
            sendPasswordChangeMail(userData.name, userData.accountType)
        );

        return sendResponse(res, 200, true, 'Password Updated.', {email: userData.email});
    } catch (err) {
        console.error('Error in forgotPasswordUpdation:', err.message);
        return sendResponse(res, 500, false, 'Internal Server Error');
    }
}